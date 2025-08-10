import type { ColumnDef } from "@tanstack/react-table";
import type { Operation } from "../../types/operations/operation";

export const operationColumns: ColumnDef<Operation>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "description", header: "Descrição" },
    { accessorKey: "type", header: "Tipo" },
    { accessorKey: "terminal", header: "Terminal" },
    { accessorKey: "status",header: "Status" },
];
