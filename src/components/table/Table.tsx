import * as React from 'react'
import { Table, ScrollArea, Box } from '@radix-ui/themes'
import {
  useReactTable,
  type ColumnDef, type CellContext, type Row, type FilterFn,
  getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  type SortingState, flexRender,
} from '@tanstack/react-table'
import {
  ChevronUpIcon, ChevronDownIcon, PencilSquareIcon, TrashIcon, EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid'

type RowShape = { type?: string; status?: string; terminal?: string }

type TableProps<T extends RowShape> = {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  selectedTerminals?: Set<string> 
  externalSearch?: string          
}


type GlobalFilterPayload = { q: string; terms: string[] }

export function SortableTable<T extends RowShape>({
  data,
  columns,
  onEdit,
  onDelete,
  selectedTerminals,
  externalSearch = '',
}: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const norm = (s: unknown) =>
    String(s ?? '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()

  const globalFilterState = React.useMemo<GlobalFilterPayload>(
    () => ({
      q: externalSearch ?? '',
      terms: selectedTerminals ? Array.from(selectedTerminals) : [],
    }),
    [externalSearch, selectedTerminals]
  )


  const globalFilterFn: FilterFn<T> = (
    row: Row<T>,
    _colId,
    filterValue: unknown
  ) => {
    const { q, terms } = (filterValue as GlobalFilterPayload) ?? { q: '', terms: [] }

    const nq = norm(q)
    const rowType = norm(row.original.type)
    const rowStatus = norm(row.original.status)
    const rowTerminal = row.original.terminal ?? ''

    const matchesQuery =
      !nq ||
      rowType.startsWith(nq) || rowType === nq ||
      rowStatus.startsWith(nq) || rowStatus === nq

    const matchesTerminals =
      terms.length === 0 ? true : terms.includes(rowTerminal)

    return matchesQuery && matchesTerminals
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
                <button
                  onClick={() => onEdit(row.original)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-black/5"
                  aria-label="Editar"
                >
                  <PencilSquareIcon className="h-5 w-5 text-green-600" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(row.original)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-black/5"
                  aria-label="Excluir"
                >
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              )}
            </div>
  
            {(onEdit || onDelete) && (
              <div className="md:hidden">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-black/5"
                  aria-label="Ações"
                  onClick={() => onEdit?.(row.original)}
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
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
    state: { sorting, globalFilter: globalFilterState }, 
    onSortingChange: setSorting,
    onGlobalFilterChange: () => {},
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const minW = React.useMemo(
    () => `${table.getVisibleLeafColumns().length * 160}px`,
    [table]
  )

  return (
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
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' && <ChevronUpIcon width="1em" className="text-white" />}
                          {sorted === 'desc' && <ChevronDownIcon width="1em" className="text-white" />}
                          {!sorted && (
                            <span className="flex">
                              <ChevronUpIcon width="1em" className="text-grey -mb-0.5" />
                              <ChevronDownIcon width="1em" className="text-grey -mt-0.5" />
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}
