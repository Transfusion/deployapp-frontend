import { useQuery } from "@tanstack/react-query";
import { ReactElement, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Input, InputGroup, TagPicker, Pagination } from "rsuite";
import { Table, Column, HeaderCell, Cell, SortType, RowDataType } from 'rsuite-table';
import styled from "styled-components";
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
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortType, setSortType] = useState<SortType>();

  const hasSort = sortType !== undefined && sortColumn !== undefined;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(15);

  const handleChangeLimit = (dataKey: number) => {
    setPage(1);
    setSize(dataKey);
  };

  const [types, setTypes] = useState(["S3", "FTP"]);
  const [_name, set_Name] = useState<string>();
  const [name, setName] = useState<string>();

  const { profile } = useAuth();

  // TODO: implement organization
  const [organization, setOrganization] = useState(null);

  const queryKey = ['storage_creds', {
    page,
    size,
    organization,
    authenticated: profile?.authenticated,

    sortColumn,
    sortType,

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
    isPreviousData, } = useQuery(queryKey, () => getStorageCredentials(page - 1, size, (hasSort ? [{ key: sortColumn, direction: sortType }] : undefined), name, types));


  const noCreds = !isLoading && data?.data.empty === true && types.length == AVAILABLE_TYPES.length && name == undefined;

  if (noCreds && noCredsBlurb !== undefined) return noCredsBlurb;

  return <>
    <div className="py-5 flex flex-wrap flex-row gap-2 justify-end">

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
    </div>

    <Table
      loading={isLoading}
      shouldUpdateScroll={false}
      data={data?.data.content}
      sortColumn={sortColumn}
      sortType={sortType}
      height={400}
      showHeader={true}
      // onRowClick={rowData => {
      //   console.log(rowData);
      // }}

      // renderRowExpanded={renderRowExpanded}
      // rowExpandedHeight={300}
      // expandedRowKeys={expandedRowKeys}
      rowKey={'id'}
      onSortColumn={(sortColumn, sortType) => {
        console.log(sortColumn, sortType);
        setSortColumn(sortColumn);
        setSortType(sortType);
      }}>

      <Column width={70} align="center">
        <HeaderCell>Details</HeaderCell>
        <ExpandCell expandedRowKeys={expandedRowKeys}
          onChange={handleExpanded} />
      </Column>

      <Column width={80} align="center">
        <CustomHeaderCell className="text-sm">Type</CustomHeaderCell>
        <CustomCell dataKey="type" />
      </Column>

      <Column sortable width={150}>
        <CustomHeaderCell>Name</CustomHeaderCell>
        <CustomCell dataKey="name" />
      </Column>

      <Column sortable width={200} resizable>
        <CustomHeaderCell>Created On</CustomHeaderCell>
        <CustomCell dataKey="createdOn">{rowData => humanReadableDate(rowData.createdOn)}</CustomCell>
      </Column>

      <Column sortable width={200} resizable>
        <CustomHeaderCell>Checked On</CustomHeaderCell>
        <CustomCell dataKey="checkedOn">{rowData => humanReadableDate(rowData.checkedOn)}</CustomCell>
      </Column>

      <Column sortable width={200} resizable>
        <CustomHeaderCell>Last Used</CustomHeaderCell>
        <CustomCell dataKey="lastUsed">{rowData => humanReadableDate(rowData.lastUsed)}</CustomCell>
      </Column>

    </Table>


    <div className="p-4">
      <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={5}
        size="xs"
        layout={['total', '-', 'limit', '|', 'pager', 'skip']}
        // total number of rows
        total={data?.data.totalElements || 0}
        limitOptions={[5, 10, 15, 20]}
        limit={size}
        activePage={page}
        onChangePage={setPage}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  </>
}