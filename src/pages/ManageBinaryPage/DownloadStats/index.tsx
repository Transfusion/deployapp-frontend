import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { useMemo, useRef, useState } from "react";
import { getUnwrappedBinaryDownloads } from "../../../api/AppBinary";
import { AppBinaryDownload } from "../../../api/interfaces/response/app_binary_download";
import { humanReadableDate } from "../../../utils/utils";

type DownloadStatsProps = { appBinaryId: string };

export default function DownloadStats(props: DownloadStatsProps & React.HTMLAttributes<HTMLDivElement>) {
  const { appBinaryId: id } = props;

  const [sorting, setSorting] = useState<SortingState>([
    { id: "ts", desc: true }
  ]);
  const apiSorting = sorting.map(({ id, desc }) => ({ key: id, direction: (desc ? 'desc' : 'asc') }));

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex: page, pageSize: size } = pagination;

  const queryKey = ['download_stats', id, apiSorting,];
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedBinaryDownloads(id, page, size, apiSorting));

  const tableInstanceRef = useRef<MRT_TableInstance<AppBinaryDownload>>(null);
  const content = data?.content ?? [];
  const rowCount = data?.totalElements ?? 0;


  // table hooks begin here
  const columns = useMemo<MRT_ColumnDef<AppBinaryDownload>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 300,
        // enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: 'ts',
        header: 'Timestamp',
        Cell: ({ cell }) => <span>{humanReadableDate(cell.getValue<Date>())}</span>,
        // size: 150,
      },
      {
        accessorKey: 'ip',
        header: 'ip',
        // size: 250,
      },
      {
        accessorKey: 'ua',
        header: 'User-Agent',
        size: 250,
        Cell: ({ cell }) => <div className="whitespace-normal">{cell.getValue<string>()}</div>,
        // enableColumnFilter: false
      },
    ],
    [],
  );

  return <div {...props}>
    <MaterialReactTable
      enableColumnFilters={false}
      enableRowActions={false}
      enableColumnResizing
      columns={columns}
      data={content}
      getRowId={({ id }) => id}
      tableInstanceRef={tableInstanceRef}
      initialState={{
        // showColumnFilters: true, 
        density: 'compact',
        columnVisibility: { id: false }
      }}
      enableGlobalFilter={false}
      manualFiltering={false}
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
      enableRowSelection={false}
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

      localization={MRT_Localization_EN}
    />


  </div>
}