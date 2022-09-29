import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { useMemo, useRef, useState } from "react";
import { getUnwrappedBinaries } from "../../api/AppBinary";
import { AppBinary } from "../../api/interfaces/response/app_binary";
import { StorageCredential } from "../../api/interfaces/response/storage_credential";
import { useAuth } from "../../contexts/AuthProvider";
import { humanReadableDate } from "../../utils/utils";

export default function Binaries() {

  const { profile } = useAuth();

  const [sorting, setSorting] = useState<SortingState>([]);
  // const hasSort = sorting.length > 0;
  const apiSorting = sorting.map(({ id, desc }) => ({ key: id, direction: (desc ? 'desc' : 'asc') }));

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex: page, pageSize: size } = pagination;

  const queryKey = ['storage_creds', {
    page,
    size,
    // organization,
    authenticated: profile?.authenticated,

    // sortColumn,
    // sortType,
    apiSorting,
    // types,
    // name,
  }];

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedBinaries(page, size, undefined, apiSorting
      // , types
    ));

  const tableInstanceRef = useRef<MRT_TableInstance<AppBinary>>(null);

  const content = data?.content ?? [];
  const rowCount = data?.totalElements ?? 0;

  // table hooks begin here
  const columns = useMemo<MRT_ColumnDef<AppBinary>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        // filterSelectOptions: [
        //   { text: 'S3', value: 'S3' },
        //   { text: 'FTP', value: 'FTP' },
        // ],
        // filterVariant: 'multi-select',
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'version',
        header: 'Version',
        enableColumnFilter: false
      },
      {
        accessorKey: 'build',
        header: 'Build',
        enableColumnFilter: false
      },
      {
        accessorKey: 'uploadDate',
        header: 'Upload Date',
        Cell: ({ cell }) => <span>{humanReadableDate(cell.getValue<Date>())}</span>,
        enableColumnFilter: false
      },
    ],
    [],
  );


  return <div className="mx-auto px-10">
    <h1 className="py-10 subpixel-antialiased font-semibold text-5xl">App Binaries</h1>




    <MaterialReactTable
      columns={columns}
      data={content}
      getRowId={({ id }) => id}
      tableInstanceRef={tableInstanceRef}
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
      // onColumnFiltersChange={setColumnFilters}
      // onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={rowCount}

      // renderDetailPanel={enableEditing && renderDetailPanel}

      // enableRowSelection={onCredentialSelected !== undefined}
      enableSelectAll={false}
      // onRowSelectionChange={(foo: any) => setRowSelection(foo())}

      state={{
        // rowSelection,
        // columnFilters,
        // globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
    />

  </div>
}