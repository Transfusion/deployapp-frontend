import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useState } from "react";
import { BsExclamationCircle, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Input, InputGroup, TagPicker, Pagination } from "rsuite";
import { Table, Column, HeaderCell, Cell, SortType } from 'rsuite-table';
import styled from "styled-components";
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


// const size = 15;
export default function DropzoneCredentialsPicker() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortType, setSortType] = useState<SortType>();

  const hasSort = sortType !== undefined && sortColumn !== undefined;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

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

  if (noCreds) return <div className="bg-blue-100 py-5 px-6 mb-3 text-base text-blue-700 inline-flex items-center w-full" role="alert">

    <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px" }} />

    <div className="h-fit">
      <p>Add storage credentials to get started.</p>
      <Link className={classNames('hover:text-white', 'block', 'w-fit', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center',
        'mt-2',
        // 'mr-2', 'mb-2',

        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )} to="/storage">Manage Credentials</Link>
    </div>

  </div>

  return <>

    <h3 className="font-semibold">Choose storage</h3>

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