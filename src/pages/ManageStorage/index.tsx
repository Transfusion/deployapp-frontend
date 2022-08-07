import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

import { Table, Column, HeaderCell, Cell } from 'rsuite-table';

import { getStorageCredentials } from "../../api/StorageCredentials";
import { useAuth } from "../../contexts/AuthProvider";
import classNames from "classnames";

import { BsPlusCircleFill } from "react-icons/bs";

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

const size = 15;
export default function ManageStorage() {
  const [page, setPage] = useState(0);
  const { profile } = useAuth();

  // TODO: implement organization
  const [organization, setOrganization] = useState(null);

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(['storage_creds', {
      page,
      size,
      organization,
      authenticated: profile?.authenticated
    }], () => getStorageCredentials(page, size));

  return <div className="mx-auto px-10">
    <h1 className="py-10 subpixel-antialiased font-semibold text-5xl">Storage</h1>

    <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end')}>
      <button type="button" className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
        // 'mr-2', 'mb-2',
        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )}><BsPlusCircleFill className="inline-block mr-2" size={'1.5em'} />Add Credential</button>
    </div>

    <Table
      loading={isLoading}
      data={data?.data.content}
      height={300}
      showHeader={true}
      onRowClick={rowData => {
        console.log(rowData);
      }}>

      <Column width={60} align="center" fixed>
        <CustomHeaderCell className="text-sm">Type</CustomHeaderCell>
        <CustomCell dataKey="type" />
      </Column>

      <Column width={150}>
        <CustomHeaderCell>Name</CustomHeaderCell>
        <CustomCell dataKey="name" />
      </Column>

      <Column width={150} resizable>
        <CustomHeaderCell>Created On</CustomHeaderCell>
        <CustomCell dataKey="createdOn">{rowData => humanReadableDate(rowData.createdOn)}</CustomCell>
      </Column>

      <Column width={150} resizable>
        <CustomHeaderCell>Checked On</CustomHeaderCell>
        <CustomCell dataKey="checkedOn">{rowData => humanReadableDate(rowData.checkedOn)}</CustomCell>
      </Column>

      <Column width={150} resizable>
        <CustomHeaderCell>Last Used</CustomHeaderCell>
        <CustomCell dataKey="lastUsed">{rowData => humanReadableDate(rowData.lastUsed)}</CustomCell>
      </Column>

      {/* <Column width={100}>
        <HeaderCell>Gender</HeaderCell>
        <Cell dataKey="gender" />
      </Column> */}

    </Table>

  </div>
}