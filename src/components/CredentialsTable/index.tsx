import { useQuery } from "@tanstack/react-query";
import { ReactElement, useState, useMemo } from "react";
import { BsSearch } from "react-icons/bs";
import { Input, InputGroup, TagPicker, Pagination } from "rsuite";
import { Table, Column, HeaderCell, Cell, SortType, RowDataType } from 'rsuite-table';
import styled from "styled-components";

import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import { StorageCredential, instanceOfS3Credential } from "../../api/interfaces/response/storage_credential";
import { getStorageCredentials } from "../../api/StorageCredentials";
import { useAuth } from "../../contexts/AuthProvider";
import { STORAGE_TYPES } from "../../utils/constants";

import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import IconButton from 'rsuite/IconButton';

import { InnerCellProps } from 'rsuite-table/lib/Cell';
import UpdateDeleteS3Row from "./UpdateDeleteS3Row";

// table utilities start

const CustomHeaderCell = styled(HeaderCell).attrs({
  className: 'text-sm'
})``;

const CustomCell = styled(Cell).attrs({
  className: 'text-base'
})``;

const humanReadableDate = (d?: Date): string => {
  if (!d) return "Never";
  return new Date(d).toLocaleString();
}

const AVAILABLE_TYPES = Object.entries(STORAGE_TYPES).map(([key, value]) => ({ key, label: value }));

const renderRowExpanded = (data?: RowDataType) => {
  if (instanceOfS3Credential(data)) return <UpdateDeleteS3Row
    s3_credential={data} />
}

const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }: Omit<InnerCellProps, 'onChange'> & { expandedRowKeys: string[], onChange: (rowData: StorageCredential) => void }) => (
  <Cell {...props} >
    <IconButton
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
      icon={
        expandedRowKeys.some(key => key === rowData.id) ? (
          <CollaspedOutlineIcon />
        ) : (
          <ExpandOutlineIcon />
        )
      }
    />
  </Cell>
);

// table utilities end


export default function CredentialsTable({
  // getStorageCredentialsUseQuery,
  noCredsBlurb
}: {
  // getStorageCredentialsUseQuery: UseQueryResult<AxiosResponse<PagingSortingSpring<StorageCredential>>>,
  enableEditing?: Boolean,
  noCredsBlurb?: ReactElement,

}) {
  // const [sortColumn, setSortColumn] = useState<string>();
  // const [sortType, setSortType] = useState<SortType>();

  // const hasSort = sortType !== undefined && sortColumn !== undefined;

  // const [page, setPage] = useState(1);
  // const [size, setSize] = useState(15);

  // const handleChangeLimit = (dataKey: number) => {
  //   setPage(1);
  //   setSize(dataKey);
  // };

  const [sorting, setSorting] = useState<SortingState>([]);
  console.log("sorting", sorting);
  // const hasSort = sorting.length > 0;
  const apiSorting = sorting.map(({ id, desc }) => ({ key: id, direction: (desc ? 'desc' : 'asc') }));


  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: "type", value: Object.values(STORAGE_TYPES) }]);

  console.log("columnFilters", columnFilters);

  const nameColFilter = columnFilters.find(({ id }) => id === 'name');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex: page, pageSize: size } = pagination;

  const types = (columnFilters.find(({ id }) => id === "type")?.value ?? []) as string[];

  // const [types, setTypes] = useState(["S3", "FTP"]);
  // const [_name, set_Name] = useState<string>();
  // const [name, setName] = useState<string>();
  const name = nameColFilter?.value as string | undefined;

  const { profile } = useAuth();

  // TODO: implement organization
  const [organization, setOrganization] = useState(null);

  const queryKey = ['storage_creds', {
    page,
    size,
    organization,
    authenticated: profile?.authenticated,

    // sortColumn,
    // sortType,
    apiSorting,
    types,
    name,
  }];

  // editing and deleting expandable begins here
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleExpanded = (rowData: StorageCredential) => {
    let open = false;
    const nextExpandedRowKeys = [] as string[];

    expandedRowKeys.forEach(key => {
      if (key === rowData.id) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowData.id);
    }
    setExpandedRowKeys(nextExpandedRowKeys);
  };
  // editing and deleting ends here


  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getStorageCredentials(page, size, apiSorting, name, types));


  const noCreds = !isLoading && data?.data.empty === true && types.length == AVAILABLE_TYPES.length && name == undefined;

  // table hooks begin here
  const columns = useMemo<MRT_ColumnDef<StorageCredential>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        filterSelectOptions: [
          { text: 'S3', value: 'S3' },
          { text: 'FTP', value: 'FTP' },
        ],
        filterVariant: 'multi-select',
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'createdOn',
        header: 'Created On',
        Cell: ({ cell }) => <span>{humanReadableDate(cell.getValue<Date>())}</span>,
        enableColumnFilter: false
      },
      {
        accessorKey: 'checkedOn',
        header: 'Checked On',
        Cell: ({ cell }) => <span>{humanReadableDate(cell.getValue<Date>())}</span>,
        enableColumnFilter: false
      },
      {
        accessorKey: 'lastUsed',
        header: 'Last Used',
        Cell: ({ cell }) => <span>{humanReadableDate(cell.getValue<Date>())}</span>,
        enableColumnFilter: false
      },
    ],
    [],
  );
  // table hooks end here

  // ... because hooks cannot be called conditionally
  if (noCreds && noCredsBlurb !== undefined) return noCredsBlurb;

  return <>
    {/* <div className="py-5 flex flex-wrap flex-row gap-2 justify-end">

      <TagPicker
        className="grow"
        data={AVAILABLE_TYPES}
        labelKey="label"
        valueKey="key"
        value={types}
        onChange={setTypes}
        cleanable={false}
      />

      <div className="grow">
        <InputGroup>
          <Input onKeyDown={evt => { if (evt.key === 'Enter') setName(_name) }} onChange={(value) => set_Name(value)} placeholder="Name" />
          <InputGroup.Button onClick={() => setName(_name)}>
            <BsSearch />
          </InputGroup.Button>
        </InputGroup>
      </div>

      <button onClick={() => { setSortColumn(undefined); setSortType(undefined); }} disabled={!hasSort} className="px-4 py-2 font-semibold text-sm bg-blue-700 text-white rounded-md shadow-sm disabled:opacity-75">Reset</button>
    </div> */}

    <MaterialReactTable
      columns={columns}
      data={data?.data.content ?? []}
      initialState={{ showColumnFilters: true, density: 'compact' }}
      enableGlobalFilter={false}
      manualFiltering
      manualPagination
      manualSorting
      muiTableContainerProps={{ sx: { maxHeight: '750px' } }}
      muiToolbarAlertBannerProps={
        isError
          ? {
            color: 'error',
            children: 'Error loading data',
          }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      // onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={data?.data.totalElements ?? 0}


      state={{
        columnFilters,
        // globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
    />
  </>
}