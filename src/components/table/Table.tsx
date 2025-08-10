import React from "react";
import { Table, Button, ScrollArea, Box } from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    useReactTable,
    type ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    flexRender,
} from "@tanstack/react-table";
import { ChevronUpIcon, ChevronDownIcon, PencilSquareIcon, TrashIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

type TableProps<T> = {
    data: T[];
    columns: ColumnDef<T, unknown>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
};

export function SortableTable<T>({ data, columns, onEdit, onDelete }: TableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const cols = React.useMemo<ColumnDef<T, unknown>[]>(() => {
        const base = [...columns];
        const hasActions = Boolean(onEdit) || Boolean(onDelete);
        if (hasActions) {
            base.push({
                id: "__actions",
                header: "Ações",
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-end gap-2">
                            {/* Desktop */}
                            <div className="hidden md:flex gap-2">
                                {onEdit && (
                                    <Button
                                        onClick={() => onEdit(row.original)}
                                        variant="solid"
                                        color="green"
                                        size="2"
                                        radius="large"
                                    >
                                        <PencilSquareIcon aria-hidden width="1.5em" />
                                        Editar
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="solid"
                                        color="red"
                                        size="2"
                                        radius="large"
                                        onClick={() => onDelete(row.original)}
                                    >
                                        <TrashIcon aria-hidden width="1.5em" />
                                        Excluir
                                    </Button>
                                )}
                            </div>

                            {/* Mobile: menu ⋯ */}
                            {hasActions &&
                                (
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
                                                                e.preventDefault();
                                                                onEdit(row.original);
                                                            }}
                                                            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <PencilSquareIcon className="h-4 w-4" /> Editar
                                                        </DropdownMenu.Item>
                                                    )}
                                                    {onDelete && (
                                                        <DropdownMenu.Item
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                onDelete(row.original);
                                                            }}
                                                            className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 outline-none hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    );
                },
            });
        }

        return base;
    }, [columns, onEdit, onDelete]);

    const table = useReactTable({
        data,
        columns: cols,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const minW = React.useMemo(
        () => `${table.getVisibleLeafColumns().length * 160}px`,
        [table]
    );

    return (

        <ScrollArea scrollbars="horizontal" type="auto">
            <Box style={{ minWidth: minW }}>
                <Table.Root variant="surface" layout="auto">
                    <Table.Header >
                        {table.getHeaderGroups().map((hg) => (
                            <Table.Row key={hg.id}>
                                {hg.headers.map((header) => {
                                    const canSort = header.column.getCanSort(); // cehcar outro modo sem precisar add aqui boas praticas
                                    const sorted = header.column.getIsSorted();

                                    return (
                                        <Table.ColumnHeaderCell
                                            key={header.id}
                                            scope="col"
                                            aria-sort={header.column.getCanSort()
                                                ? sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"
                                                : undefined}
                                        >
                                            {header.isPlaceholder ? null : canSort ? (

                                                <span
                                                    role="button"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") header.column.toggleSorting();
                                                    }}
                                                    className="inline-flex items-center gap-1 select-none cursor-pointer"
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {sorted === "asc" && <ChevronUpIcon width="1em" />}
                                                    {sorted === "desc" && <ChevronDownIcon width="1em" />}
                                                    {!sorted && (

                                                        <span className="opacity-40 flex">
                                                            <ChevronUpIcon width="1em" className="-mb-0.5" />
                                                            <ChevronDownIcon width="1em" className="-mt-0.5" />
                                                        </span>

                                                    )}
                                                </span>

                                            ) : (
                                                <span className="inline-flex items-center gap-1">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>
                                            )}
                                        </Table.ColumnHeaderCell>
                                    );
                                })}
                            </Table.Row>
                        ))}
                    </Table.Header>

                    <Table.Body>
                        {table.getRowModel().rows.map((row) => (
                            <Table.Row key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Table.Cell key={cell.id}>
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
                </Table.Root >
            </Box>
        </ScrollArea>
    );
}
