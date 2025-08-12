import React from 'react'
import {
  Table,
  Button,
  ScrollArea,
  Box,
  Flex,
  TextField,
} from '@radix-ui/themes'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  useReactTable,
  type ColumnDef,
  type CellContext,
  type Row,
  type FilterFn,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  flexRender,
} from '@tanstack/react-table'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid'

type RowShape = { type?: string; status?: string }

type TableProps<T extends RowShape> = {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export function SortableTable<T extends RowShape>({
  data,
  columns,
  onEdit,
  onDelete,
}: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const norm = (s: unknown) =>
    String(s ?? '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()

  const globalFilterFn: FilterFn<T> = (
    row: Row<T>,
    _colId: string,
    filterValue: unknown,
  ) => {
    const normalizedInfo = norm(filterValue)
    if (!normalizedInfo) return true

    const typeVal = norm(row.original.type)
    const statusVal = norm(row.original.status)

    const match = (v: string) =>
      v.startsWith(normalizedInfo) || v === normalizedInfo

    return match(typeVal) || match(statusVal)
  }

  const cols = React.useMemo<ColumnDef<T, unknown>[]>(() => {
    const base = [...columns]
    const hasActions = Boolean(onEdit) || Boolean(onDelete)

    if (hasActions) {
      const actionsCol: ColumnDef<T, unknown> = {
        id: '__actions',
        header: '',
        enableSorting: false,
        cell: ({ row }: CellContext<T, unknown>) => (
          <div className="flex items-center justify-center gap-3">
            <div className="hidden gap-2 md:flex">
              {onEdit && (
                <Button onClick={() => onEdit(row.original)} variant="ghost">
                  <PencilSquareIcon
                    className="text-green-500"
                    aria-hidden
                    width="1.5em"
                  />
                </Button>
              )}
              {onDelete && (
                <Button onClick={() => onDelete(row.original)} variant="ghost">
                  <TrashIcon
                    aria-hidden
                    className="text-red-500"
                    width="1.5em"
                  />
                </Button>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div className="md:hidden">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      type="button"
                      aria-label="Ações"
                      variant="soft"
                      color="blue"
                      size="2"
                      radius="large"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={6}
                      collisionPadding={8}
                      className="z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    >
                      {onEdit && (
                        <DropdownMenu.Item
                          onSelect={(e) => {
                            e.preventDefault()
                            onEdit(row.original)
                          }}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none select-none hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <PencilSquareIcon className="h-4 w-4" /> Editar
                        </DropdownMenu.Item>
                      )}
                      {onDelete && (
                        <DropdownMenu.Item
                          onSelect={(e) => {
                            e.preventDefault()
                            onDelete(row.original)
                          }}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 outline-none select-none hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <TrashIcon className="h-4 w-4" /> Excluir
                        </DropdownMenu.Item>
                      )}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            )}
          </div>
        ),
      }
      base.push(actionsCol)
    }

    return base
  }, [columns, onEdit, onDelete])

  const table = useReactTable({
    data,
    columns: cols,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const minW = React.useMemo(
    () => `${table.getVisibleLeafColumns().length * 160}px`,
    [table],
  )

  return (
    <>
      <Flex align="center" justify="between" className="mb-3 gap-2">
        <TextField.Root
          placeholder="Buscar por tipo ou status…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-100"
          size="2"
        />
      </Flex>

      <ScrollArea scrollbars="horizontal" type="auto">
        <Box style={{ minWidth: minW }}>
          <Table.Root variant="surface" layout="auto">
            <Table.Header className="bg-[#1154ff]">
              {table.getHeaderGroups().map((hg) => (
                <Table.Row key={hg.id}>
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const sorted = header.column.getIsSorted()

                    return (
                      <Table.ColumnHeaderCell
                        className="text-white"
                        key={header.id}
                        scope="col"
                        aria-sort={
                          canSort
                            ? sorted === 'asc'
                              ? 'ascending'
                              : sorted === 'desc'
                                ? 'descending'
                                : 'none'
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <span
                            role="button"
                            onClick={header.column.getToggleSortingHandler()}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ')
                                header.column.toggleSorting()
                            }}
                            className="inline-flex cursor-pointer items-center gap-1 select-none"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {sorted === 'asc' && (
                              <ChevronUpIcon
                                width="1em"
                                className="text-white"
                              />
                            )}
                            {sorted === 'desc' && (
                              <ChevronDownIcon
                                width="1em"
                                className="text-white"
                              />
                            )}
                            {!sorted && (
                              <span className="flex">
                                <ChevronUpIcon
                                  width="1em"
                                  className="text-grey -mb-0.5"
                                />
                                <ChevronDownIcon
                                  width="1em"
                                  className="text-grey -mt-0.5"
                                />
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                        )}
                      </Table.ColumnHeaderCell>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Header>

            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id} className="max-w-24 truncate">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <Table.Row>
                  <Table.Cell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="text-center"
                  >
                    <span className="block py-8 text-sm text-gray-500">
                      Nada por aqui ainda.
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </ScrollArea>
    </>
  )
}
