import { Send } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import { ListItemIcon, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import MaterialReactTable, { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUnwrappedBinaries } from "../../api/AppBinary";
import { AppBinary } from "../../api/interfaces/response/app_binary";
import { useAuth } from "../../contexts/AuthProvider";
import { BINARY_TYPES } from "../../utils/constants";
import { humanReadableDate } from "../../utils/utils";

export default function Binaries() {
  const navigate = useNavigate();

  const { profile } = useAuth();

  const [sorting, setSorting] = useState<SortingState>([]);
  const apiSorting = sorting.map(({ id, desc }) => ({ key: id, direction: (desc ? 'desc' : 'asc') }));

  // type and name
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "type", value: Object.values(BINARY_TYPES) }
  ]);


  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex: page, pageSize: size } = pagination;

  const types = (columnFilters.find(({ id }) => id === "type")?.value ?? []) as string[];

  const search = columnFilters.filter(({ id }) => id !== "type").map(({ id, value }) => ({
    key: id, operation: 'like', value
  } as { key: string, operation: string, value: string }));


  const queryKey = ['storage_creds', {
    page,
    size,
    // organization,
    authenticated: profile?.authenticated,

    apiSorting,
    types,
    search,
  }];

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedBinaries(page, size, search, apiSorting, types
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
        filterSelectOptions: [
          { text: 'IPA', value: 'IPA' },
          { text: 'APK', value: 'APK' },
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
        size: 150,
      },
      {
        accessorKey: 'identifier',
        header: 'Identifier',
        size: 250,
      },
      {
        accessorKey: 'version',
        header: 'Version',
        size: 100,
        enableColumnFilter: false
      },
      {
        accessorKey: 'build',
        header: 'Build',
        size: 100,
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


  return <div className="mx-auto md:px-10 px-5">
    <h1 className="py-10 subpixel-antialiased font-semibold text-5xl">App Binaries</h1>

    <MaterialReactTable
      enableRowActions
      enableColumnResizing
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

      // renderDetailPanel={enableEditing && renderDetailPanel}

      // enableRowSelection={onCredentialSelected !== undefined}
      enableSelectAll={false}
      // onRowSelectionChange={(foo: any) => setRowSelection(foo())}

      renderRowActionMenuItems={({ closeMenu, row }) => [
        <Link target={"_blank"} to={`/manage/${row.id}`}>
          <MenuItem
            key={0}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            Manage
          </MenuItem>
        </Link>,
        (row.original.available &&
          <Link target={"_blank"} to={`/i/${row.id}`}>
            <MenuItem
              key={1}
              sx={{ m: 0 }}
            >
              <ListItemIcon>
                <Send />
              </ListItemIcon>
              Public page
            </MenuItem>
          </Link>),
      ]}

      state={{
        // rowSelection,
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

  </div>
}