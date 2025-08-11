import { useEffect, useState } from "react";
import { OperationsService } from "../services/operation.service";
import type { Operation } from "../types/operations/operation";
import { SortableTable } from "../components/table/Table";
import { operationColumns } from "../components/table/operationColumns";
import { OperationModal } from "../components/modals/OperationModal";
import { Flex, Button, Spinner} from "@radix-ui/themes";

export default function Operation() {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);

    const [openCreate, setOpenCreate] = useState(false);
    const [savingCreate, setSavingCreate] = useState(false);

   
    const [openEdit, setOpenEdit] = useState(false);
    const [editing, setEditing] = useState<Operation | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await OperationsService.getAll();
            setOperations(data);
            setLoading(false);
        })();
    }, []);

    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    const handleCreate = async (values: Omit<Operation, "id">) => {
        try {
            setSavingCreate(true);
            const created = await OperationsService.create(values);
            setOperations(prev => [created, ...prev]);
            setOpenCreate(false);
        } finally {
            setSavingCreate(false);
        }
    };

    const handleDelete = async (operation: Operation) => {
        try {
            await OperationsService.delete(operation.id);

            setOperations((prev) => prev.filter((op) => op.id !== operation.id));

            console.log(`Operação ${operation.id} deletada com sucesso.`); // chmar toast de sucesso
        } catch (err) {
            console.error("Erro ao deletar operação:", err); // chamar toast de erro
        }
    };

    const handleEdit = (row: Operation) => {
        setEditing(row);
        setOpenEdit(true);
    };

    const handleEditSave = async (updated: Operation) => {
        try {
            setSavingEdit(true);
            const saved = await OperationsService.update(updated.id, updated);
            setOperations(prev => prev.map(op => (op.id === saved.id ? saved : op)));
            setOpenEdit(false);
            setEditing(null);
        } finally {
            setSavingEdit(false);
        }
    };


    return (
        <div className="w-fit">
            <Flex justify="between" align="center" className="mb-4">
                <h1 className="text-xl font-bold">Operações</h1>
                <Button color="blue" onClick={handleOpenCreate}>Nova operação</Button>
            </Flex>

            {loading ? (
                <Flex justify="center" className="py-10">
                    <Spinner size="3" />
                </Flex>) : (
                <SortableTable
                    data={operations}
                    columns={operationColumns}
                    onDelete={handleDelete}
                    onEdit={handleEdit} />
            )}
            <OperationModal
                mode='create'
                open={openCreate}
                onOpenChange={setOpenCreate}
                onSubmit={handleCreate}
                saving={savingCreate}
                initial={{ status: "Criada", type: "Embarque", terminal: "Terminal Sul" }}
            />
            {editing && (
                <OperationModal
                    mode='edit'
                    open={openEdit}
                    onOpenChange={(v) => {
                        setOpenEdit(v);
                        if (!v) setEditing(null);
                    }}
                    operation={editing}
                    onSubmit={handleEditSave}
                    saving={savingEdit}
                />
            )}
        </div>
    );
}
