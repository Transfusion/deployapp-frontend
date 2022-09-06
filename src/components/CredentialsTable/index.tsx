import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import classNames from "classnames";
import { ReactElement, useState } from "react";
import { BsExclamationCircle, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Input, InputGroup, TagPicker, Pagination } from "rsuite";
import { Table, Column, HeaderCell, Cell, SortType } from 'rsuite-table';
import styled from "styled-components";
import PagingSortingSpring from "../../api/interfaces/response/paging_sorting_spring";
import { StorageCredential } from "../../api/interfaces/response/storage_credential";
import { getStorageCredentials } from "../../api/StorageCredentials";
import { useAuth } from "../../contexts/AuthProvider";
import { STORAGE_TYPES } from "../../utils/constants";

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
      loading={isLoading || isFetching}
      data={data?.data.content}
      sortColumn={sortColumn}
      sortType={sortType}
      height={400}
      showHeader={true}
      onRowClick={rowData => {
        console.log(rowData);
      }}

      onSortColumn={(sortColumn, sortType) => {
        console.log(sortColumn, sortType);
        setSortColumn(sortColumn);
        setSortType(sortType);
      }}>

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