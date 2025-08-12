import { useEffect, useState } from 'react'
import { OperationsService } from '../services/operation.service'
import type { Operation } from '../types/operations/operation'
import { SortableTable } from '../components/table/Table'
import { operationColumns } from '../components/table/operationColumns'
import { OperationModal } from '../components/modals/OperationModal'
import { Flex, Spinner } from '@radix-ui/themes'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/inputs/button'

export default function Operation() {
  const { toastSuccess, toastError } = useToast()

  const [operations, setOperations] = useState<Operation[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setError] = useState<string | null>(null) // check

  const [openCreate, setOpenCreate] = useState(false)
  const [savingCreate, setSavingCreate] = useState(false)

  const [openEdit, setOpenEdit] = useState(false)
  const [editing, setEditing] = useState<Operation | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await OperationsService.getAll()
        if (!alive) return
        setOperations(data)
        setError(null)
      } catch (err) {
        if (!alive) return
        console.error(err)
        setError('Não foi possível carregar as operações.')
        toastError('Falha ao carregar', 'Tente novamente em instantes.')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [toastError])

  const retry = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await OperationsService.getAll()
      setOperations(data)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar as operações.')
      toastError('Falha ao carregar', 'Tente novamente em instantes.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: Omit<Operation, 'id'>) => {
    try {
      setSavingCreate(true)
      const created = await OperationsService.create(values)
      setOperations((prev) => [created, ...prev])
      setOpenCreate(false)
      toastSuccess('Operação criada', `${created.name} criada com sucesso.`)
    } catch (err) {
      console.error(err)
      toastError('Erro ao criar', 'Tente novamente em instantes.')
    } finally {
      setSavingCreate(false)
    }
  }

  const handleDelete = async (operation: Operation) => {
    try {
      await OperationsService.delete(operation.id)

      setOperations((prev) => prev.filter((op) => op.id !== operation.id))
      toastSuccess('Operação removida', `${operation.name} deletada.`)
    } catch (err) {
      console.log(err)
      toastError('Erro ao deletar', 'Não foi possível remover a operação.')
    }
  }

  const handleEdit = (row: Operation) => {
    setEditing(row)
    setOpenEdit(true)
  }

  const handleEditSave = async (updated: Operation) => {
    try {
      setSavingEdit(true)
      const saved = await OperationsService.update(updated.id, updated)
      setOperations((prev) =>
        prev.map((op) => (op.id === saved.id ? saved : op)),
      )
      setOpenEdit(false)
      setEditing(null)

      toastSuccess('Operação atualizada', `${saved.name} salva com sucesso.`)
    } catch (err) {
      console.error(err)
      toastError('Erro ao salvar', 'Não foi possível atualizar a operação.')
    } finally {
      setSavingEdit(false)
    }
  }

  return (
    <div className="w-full">
      <Flex justify="between" align="center" className="mb-4">
        <h1 className="text-xl font-bold">Operações</h1>
        <Button
          color="[#1154ff]"
          label="Nova operação"
          onClick={() => setOpenCreate(true)}
          disabled={loading || savingCreate}
        />
      </Flex>

      {!loading && errorMsg && (
        <div className="mb-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-sm text-red-800">{errorMsg}</span>
          <button
            onClick={retry}
            className="ml-auto rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <Flex justify="center" className="py-10">
          <Spinner size="3" />
        </Flex>
      ) : (
        <SortableTable
          data={operations}
          columns={operationColumns}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
      <OperationModal
        mode="create"
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSubmit={handleCreate}
        saving={savingCreate}
        initial={{
          status: 'Criada',
          type: 'Embarque',
          terminal: 'Terminal Sul',
        }}
      />
      {editing && (
        <OperationModal
          mode="edit"
          open={openEdit}
          onOpenChange={(v) => {
            setOpenEdit(v)
            if (!v) setEditing(null)
          }}
          operation={editing}
          onSubmit={handleEditSave}
          saving={savingEdit}
        />
      )}
    </div>
  )
}
