import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Cell, HeaderCell } from 'rsuite-table';
import styled from "styled-components";

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState
} from '@tanstack/react-table';
import MaterialReactTable, { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'material-react-table';

import { instanceOfFtpCredential, instanceOfS3Credential, StorageCredential } from "../../api/interfaces/response/storage_credential";
import { getUnwrappedStorageCredentials } from "../../api/StorageCredentials";
import { useAuth } from "../../contexts/AuthProvider";
import { STORAGE_TYPES } from "../../utils/constants";


import _ from "lodash";
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import PagingSortingSpring from "../../api/interfaces/response/paging_sorting_spring";
import { humanReadableDate } from "../../utils/utils";
import UpdateDeleteS3Row from "./UpdateDeleteS3Row";
import UpdateDeleteFtpRow from "./UpdateDeleteFtpRow";

// table utilities start

const CustomHeaderCell = styled(HeaderCell).attrs({
  className: 'text-sm'
})``;

const CustomCell = styled(Cell).attrs({
  className: 'text-base'
})``;

const AVAILABLE_TYPES = Object.entries(STORAGE_TYPES).map(([key, value]) => ({ key, label: value }));

/* const renderRowExpanded = (data?: RowDataType) => {
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
); */

// table utilities end


export default function CredentialsTable({
  // getStorageCredentialsUseQuery,
  enableEditing,
  noCredsBlurb,
  onCredentialSelected
}: {
  // getStorageCredentialsUseQuery: UseQueryResult<AxiosResponse<PagingSortingSpring<StorageCredential>>>,
  enableEditing?: Boolean,
  noCredsBlurb?: ReactElement,

  onCredentialSelected?: (cred?: StorageCredential) => any
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
  // const hasSort = sorting.length > 0;
  const apiSorting = sorting.map(({ id, desc }) => ({ key: id, direction: (desc ? 'desc' : 'asc') }));


  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: "type", value: Object.values(STORAGE_TYPES) }]);

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
  /* const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

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
  }; */
  // editing and deleting ends here

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedStorageCredentials(page, size, apiSorting, name, types));

  const noCreds = !isLoading && data?.empty === true && types.length == AVAILABLE_TYPES.length && name == undefined;

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
        accessorKey: 'id',
        header: 'ID',
        size: 300,
        enableColumnFilter: false,
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

  // const [freshlyUpdatedRecords, setFreshlyUpdatedRecords] = useState(new Map<string, StorageCredential>());
  // console.log("freshlyUpdatedRecords", freshlyUpdatedRecords);
  // useEffect(() => { setFreshlyUpdatedRecords(new Map<string, StorageCredential>()) }, [isLoading, isFetching]);
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    if (_.isUndefined(onCredentialSelected)) return;
    if (!_.isEmpty(rowSelection)) {
      const id = _.keys(rowSelection)[0];
      const cred = content.find(cred => cred.id === id);
      onCredentialSelected(cred);
      // onCredentialSelected(_.keys(rowSelection)[0]);
    }
    else onCredentialSelected(undefined);
  }, [rowSelection]);

  const tableInstanceRef = useRef<MRT_TableInstance<StorageCredential>>(null);
  const queryClient = useQueryClient();
  // table hooks end here

  // ... because hooks cannot be called conditionally
  if (noCreds && noCredsBlurb !== undefined) return noCredsBlurb;

  // table helpers begin here
  // const _content = data?.content ?? [];
  const content = data?.content ?? [];
  const rowCount = data?.totalElements ?? 0;

  // const content = _content.map(cred => freshlyUpdatedRecords.has(cred.id) ? freshlyUpdatedRecords.get(cred.id) : cred) as StorageCredential[];


  const renderDetailPanel = ({ row }: { row: MRT_Row<StorageCredential> }) => {
    if (instanceOfS3Credential(row.original)) return <UpdateDeleteS3Row
      s3_credential={row.original}
      onSuccess={(resp) => {
        const { credential } = resp.data;
        if (!credential) return; // should never reach this
        const { id } = credential;
        // const updatedRecordsClone = new Map(freshlyUpdatedRecords);
        // updatedRecordsClone.set(id, credential);
        // setFreshlyUpdatedRecords(updatedRecordsClone);
        if (data == null) return;
        const clonedData = { ...data };
        clonedData.content = clonedData.content.map(cred => cred.id == id ? credential : cred);
        queryClient.setQueryData<PagingSortingSpring<StorageCredential>>(queryKey, clonedData);
      }}

      onDeleteSuccess={async (resp) => {
        tableInstanceRef.current?.toggleAllRowsExpanded(false);
        queryClient.resetQueries(['storage_creds']);
      }}
    />

    else if (instanceOfFtpCredential(row.original)) return <UpdateDeleteFtpRow
      ftp_credential={row.original}
      onSuccess={(resp) => {
        const { credential } = resp.data;
        if (!credential) return; // should never reach this
        const { id } = credential;
        // const updatedRecordsClone = new Map(freshlyUpdatedRecords);
        // updatedRecordsClone.set(id, credential);
        // setFreshlyUpdatedRecords(updatedRecordsClone);
        if (data == null) return;
        const clonedData = { ...data };
        clonedData.content = clonedData.content.map(cred => cred.id == id ? credential : cred);
        queryClient.setQueryData<PagingSortingSpring<StorageCredential>>(queryKey, clonedData);
      }}
      onDeleteSuccess={async (resp) => {
        tableInstanceRef.current?.toggleAllRowsExpanded(false);
        queryClient.resetQueries(['storage_creds']);
      }}
    />

    return <>unknown</>
  }
  // table helpers end here

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
      data={content}
      getRowId={({ id }) => id}
      tableInstanceRef={tableInstanceRef}
      initialState={{
        showColumnFilters: true, density: 'compact',
        columnVisibility: { id: false }
      }}
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
      rowCount={rowCount}

      renderDetailPanel={enableEditing && renderDetailPanel}

      enableRowSelection={onCredentialSelected !== undefined}
      enableSelectAll={false}
      onRowSelectionChange={(foo: any) => setRowSelection(foo())}

      state={{
        rowSelection,
        columnFilters,
        // globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}

      localization={MRT_Localization_EN}
    />
  </>
}