import * as Dialog from '@radix-ui/react-dialog'
import { TextField, TextArea, Text, Flex } from '@radix-ui/themes'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import type { Operation } from '../../types/operations/operation'
import { ModalSelect } from '../inputs/select'
import {
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  TERMINAL_OPTIONS,
  type OpStatus,
  type OpType,
  type OpTerminal,
} from '../inputs/select/selectOptions'
import { useBreakpointValue } from '../../hooks/breakpoint'
import { Button } from '../inputs/button'

type EditProps = {
  mode: 'edit'
  open: boolean
  onOpenChange: (v: boolean) => void
  operation: Operation
  onSubmit: (updated: Operation) => void | Promise<void>
  saving?: boolean
}

type CreateProps = {
  mode: 'create'
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: Partial<
    Pick<Operation, 'name' | 'description' | 'type' | 'terminal' | 'status'>
  >
  onSubmit: (values: Omit<Operation, 'id'>) => void | Promise<void>
  saving?: boolean
}

type Props = CreateProps | EditProps

type FormValues = {
  name: string
  description: string
  terminal: OpTerminal | ''
  type: OpType | ''
  status: OpStatus | ''
}

export function OperationModal(props: Props) {
  const { open, onOpenChange, saving = false } = props

  const defaults = useMemo<FormValues>(
    () =>
      props.mode === 'edit'
        ? {
            name: props.operation.name ?? '',
            description: props.operation.description ?? '',
            type: props.operation.type ?? '',
            terminal: props.operation.terminal ?? '',
            status: props.operation.status ?? '',
          }
        : {
            name: props.initial?.name ?? '',
            description: props.initial?.description ?? '',
            type: props.initial?.type ?? '',
            terminal: props.initial?.terminal ?? '',
            status: props.initial?.status ?? '',
          },
    [props],
  )


  const modalWidth = useBreakpointValue(
    {
      base: 'w-[min(90vw,400px)]',
      md: 'w-[min(92vw,560px)]',
    }

  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: defaults,
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (open) reset(defaults)
  }, [open, defaults, reset])

  const title = props.mode === 'edit' ? 'Editar operação' : 'Nova operação'
  const submitLabel = props.mode === 'edit' ? 'Salvar' : 'Criar'
  const nameId = 'op-name'
  const nameErrId = 'op-name-error'

  const onSubmit = async (values: FormValues) => {
    if (props.mode === 'edit' && !values.status) {
      setError('status', {
        type: 'required',
        message: 'Status é obrigatório no modo edição.',
      })
      return
    }

    const submitData = {
      name: values.name.trim(),
      description: values.description,
      type: values.type,
      terminal: values.terminal,
      status: values.status,
    }

    try {
      if (props.mode === 'edit') {
        await Promise.resolve(
          props.onSubmit({ ...props.operation, ...submitData } as Operation),
        )
      } else {
        await Promise.resolve(
          props.onSubmit(submitData as Omit<Operation, 'id'>),
        )
      }
    } catch (err) {
      setError('root.server', {
        type: 'server',
        message: 'Erro ao salvar operação.',
      })
      console.error(err)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${modalWidth} max-h-[85vh] overflow-y-auto rounded-lg bg-white p-4 shadow-lg sm:p-6`}
        >
          <Dialog.Title className="mb-3 text-lg font-semibold">
            {title}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Flex direction="column" className="gap-2">
              <Flex direction="column" className="gap-1">
                <Text
                  as="label"
                  htmlFor={nameId}
                  className="font-medium text-black/90"
                >
                  Nome:
                </Text>
                <TextField.Root
                  size="3"
                  radius="large"
                  id={nameId}
                  className="w-full"
                   type="text"
                    autoComplete="name"                  
                    placeholder="Digite o nome"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? nameErrId : undefined}
                    disabled={saving}
                    {...register('name', { required: 'Nome é obrigatório.' })}
                >
               
              
                </TextField.Root>
                {errors.name && (
                  <Text id={nameErrId} color="red" size="2">
                    {errors.name.message}
                  </Text>
                )}
              </Flex>

              <Flex direction="column" className="gap-1">
                <Text as="label" className="font-medium text-black/90">
                  Terminal:
                </Text>
                <Controller
                  control={control}
                  name="terminal"
                  rules={{ required: 'Terminal é obrigatório.' }}
                  render={({ field }) => (
                    <ModalSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={TERMINAL_OPTIONS}
                      placeholder="Selecione um terminal"
                      disabled={saving}
                    />
                  )}
                />
                {errors.terminal && (
                  <Text color="red" size="2">
                    {errors.terminal.message}
                  </Text>
                )}
              </Flex>

              <Flex direction="column" className="gap-1">
                <Text as="label" className="font-medium text-black/90">
                  Tipo:
                </Text>
                <Controller
                  control={control}
                  name="type"
                  rules={{ required: 'Tipo é obrigatório.' }}
                  render={({ field }) => (
                    <ModalSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={TYPE_OPTIONS}
                      placeholder="Selecione um tipo"
                      disabled={saving}
                    />
                  )}
                />
                {errors.type && (
                  <Text color="red" size="2">
                    {errors.type.message}
                  </Text>
                )}
              </Flex>

              {props.mode === 'edit' && (
                <Flex direction="column" className="gap-1">
                  <Text as="label" className="font-medium text-black/90">
                    Status:
                  </Text>
                  <Controller
                    control={control}
                    name="status"
                    rules={{ required: 'Status é obrigatório no modo edição.' }}
                    render={({ field }) => (
                      <ModalSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={STATUS_OPTIONS}
                        placeholder="Selecione um status"
                        disabled={saving}
                      />
                    )}
                  />
                  {errors.status && (
                    <Text color="red" size="2">
                      {errors.status.message}
                    </Text>
                  )}
                </Flex>
              )}

              <Flex direction="column" className="gap-1">
                <Text as="label" className="font-medium text-black/90">
                  Descrição:
                </Text>
                <Controller
                  control={control}
                  name="description"
                  rules={{ required: 'Descrição é obrigatória.' }}
                  render={({ field }) => (
                    <TextArea
                      size="3"
                      placeholder="Informe uma descrição"
                      radius="large"
                      disabled={saving}
                      value={field.value}
                      className="text-wrap"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                {errors.description && (
                  <Text color="red" size="2">
                    {errors.description.message}
                  </Text>
                )}
              </Flex>

              {errors.root?.server?.message && (
                <Text color="red" size="2">
                  {errors.root.server.message}
                </Text>
              )}
            </Flex>

            <Flex direction="row" className="gap-3" justify="end">
              <Dialog.Close asChild>
                <Button
                  label="Cancelar"
                  color="red-600"
                  disabled={saving}
                  type="button"
                />
              </Dialog.Close>
              <Button
                label={saving ? 'Salvando...' : submitLabel}
                color="[#1154ff]"
                type="submit"
                disabled={saving}
              />
            </Flex>
          </form>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Fechar"
              disabled={saving}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
