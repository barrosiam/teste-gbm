import React from 'react'
import {
  Table, Button, ScrollArea, Box, Flex, TextField,
} from '@radix-ui/themes'
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
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm whitespace-nowrap",
        "border transition",
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        "focus:outline-none focus:ring-2 focus:ring-blue-600/40",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

export function SortableTable<T extends RowShape>({
  data, columns, onEdit, onDelete,
}: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [selectedTerminals, setSelectedTerminals] = React.useState<Set<string>>(new Set())

  const terminals = React.useMemo(
    () =>
      Array.from(
        new Set(
          data.map(d => d.terminal).filter((t): t is string => Boolean(t))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [data]
  )

  const toggleTerminal = (t: string) => {
    setSelectedTerminals(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }
  const clearTerminals = () => setSelectedTerminals(new Set())

  const norm = (s: unknown) =>
    String(s ?? '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()

  const globalFilterFn: FilterFn<T> = (row: Row<T>, _colId, filterValue) => {
    const q = norm(filterValue)
    const rowType = norm(row.original.type)
    const rowStatus = norm(row.original.status)
    const rowTerminal = row.original.terminal ?? ''

    const matchesQuery =
      !q ||
      rowType.startsWith(q) || rowType === q ||
      rowStatus.startsWith(q) || rowStatus === q

    const matchesTerminals =
      selectedTerminals.size === 0 || selectedTerminals.has(rowTerminal)

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
                <Button onClick={() => onEdit(row.original)} variant="ghost">
                  <PencilSquareIcon className="text-green-500" aria-hidden width="1.5em" />
                </Button>
              )}
              {onDelete && (
                <Button onClick={() => onDelete(row.original)} variant="ghost">
                  <TrashIcon className="text-red-500" aria-hidden width="1.5em" />
                </Button>
              )}
            </div>
            {(onEdit || onDelete) && (
              <div className="md:hidden">
    
                <Button type="button" aria-label="Ações" variant="soft" color="blue" size="2" radius="large">
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Button>
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
    [table]
  )

  const selectedCount = selectedTerminals.size

  return (
    <>

      <div className="mb-3 space-y-2">

        <div className="flex items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={selectedCount === 0} onClick={clearTerminals}>
            Todos
          </Chip>
          {terminals.map((t) => (
            <Chip key={t} active={selectedTerminals.has(t)} onClick={() => toggleTerminal(t)}>
              {t}
            </Chip>
          ))}
        </div>

        <Flex align="center" justify="between" className="gap-2">
          <TextField.Root
            placeholder="Buscar por tipo ou status…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:w-100"
            size="2"
          />
          {selectedCount > 0 && (
            <span className="hidden md:inline text-sm text-gray-600">
              {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
            </span>
          )}
        </Flex>
      </div>

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
                  <Table.Cell colSpan={table.getVisibleLeafColumns().length} className="text-center">
                    <span className="block py-8 text-sm text-gray-500">Nada por aqui ainda.</span>
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
