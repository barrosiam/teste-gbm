import type { ColumnDef } from "@tanstack/react-table";
import type { Operation } from "../../types/operations/operation";
import { Badge } from "@radix-ui/themes";

type BadgeVariant = "soft" | "solid" | "surface" | "outline";

export const STATUS_BADGE = {
    Criada: { color: "blue", variant: "soft" },
    Processando: { color: "amber", variant: "soft" },
    Finalizada: { color: "green", variant: "solid" },
} as const satisfies Record<Operation["status"], { color: string; variant: BadgeVariant }>;

export const operationColumns: ColumnDef<Operation>[] = [
    {
        accessorKey: "id",
        header: "ID",
        enableSorting: true
    },
    {
        accessorKey: "description",
        header: "Descrição", enableSorting: true,
        cell: ({ getValue }) => String(getValue() ?? "")
    },
    {
        accessorKey: "type",
        header: "Tipo",
        enableSorting: true,
        cell: ({ getValue }) => String(getValue() ?? "")
    },
    {
        accessorKey: "terminal",
        header: "Terminal",
        enableSorting: true,
        cell: ({ getValue }) => String(getValue() ?? ""),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const v = String(getValue() ?? "") as Operation["status"];
            const cfg = STATUS_BADGE[v] ?? { color: "gray", variant: "soft" as const };

            return (
                <Badge color= { cfg.color } variant = { cfg.variant } radius = "full" highContrast size = "2" >
                    { v }
                    </Badge>
      );
    },
    }
];
