import * as Dialog from "@radix-ui/react-dialog";
import * as TextField from "@radix-ui/themes/components/text-field";
import { TextArea, Text, Flex, Button } from "@radix-ui/themes";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import type { Operation } from "../../types/operations/operation";
import { ModalSelect } from "../inputs/select";
import {
  STATUS_OPTIONS, TYPE_OPTIONS, TERMINAL_OPTIONS,
  type OpStatus, type OpType, type OpTerminal
} from "../inputs/select/selectOptions";

type EditProps = {
  mode: 'edit',
  open: boolean;
  onOpenChange: (v: boolean) => void;
  operation: Operation; // edição sempre vem com operação completa
  onSubmit: (updated: Operation) => void | Promise<void>;
  saving?: boolean;
};

type CreateProps = {
  mode: 'create',
  open: boolean;
  onOpenChange: (v: boolean) => void;
  // valores padrão opcionais para pré-preencher na criação
  initial?: Partial<Pick<Operation, "description" | "type" | "terminal" | "status">>;
  onSubmit: (values: Omit<Operation, "id">) => void | Promise<void>;
  saving?: boolean;
};


type Props = CreateProps | EditProps

export function OperationModal(props: Props) {
  const { open, onOpenChange, saving = false } = props;

  const [description, setDescription] = useState("");
  const [terminal, setTerminal] = useState<OpTerminal | "">("");
  const [type, setType] = useState<OpType | "">("");
  const [status, setStatus] = useState<OpStatus | "">("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const nameId = "op-name";
  const nameErrId = "op-name-error";

  useEffect(() => {
    if (!open) return;

    if (props.mode === "edit") {
      const op = props.operation;
      setName(op.name ?? "");
      setDescription(op.description ?? "");
      setType(op.type ?? "");
      setTerminal(op.terminal ?? "");
      setStatus(op.status ?? "");
    } else {
      setName(props.initial?.name ?? "")
      setDescription(props.initial?.description ?? "");
      setType(props.initial?.type ?? "");
      setTerminal(props.initial?.terminal ?? "");
      setStatus(props.initial?.status ?? "");
    }
  }, [open, props]);

  const title = props.mode === 'edit' ? "Editar operação" : "Nova operação";
  const submitLabel = props.mode === 'edit' ? "Salvar" : "Criar";


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Nome é obrigatório.");
      return;
    }
 
    if (!type || !terminal || (props.mode === "edit" && !status) || !description) return;

    const submitData = {
      name: name.trim(),
      description,
      type,
      terminal,
      status,
    }

    try {
      if (props.mode === 'edit') {
        if (!props.operation) {
          console.error("OperationModal: operation é obrigatório em modo edição");
          return;
        }

        await Promise.resolve(
          props.onSubmit({
            ...props.operation,
            ...submitData
          } as Operation)
        );
      } else {
        await Promise.resolve(
          props.onSubmit({
            ...submitData
          } as Omit<Operation, "id">)
        );
      }
      console.log('Sucesso') // add toast sucesso
    } catch (err) {
      console.log('Ocorreu um erro com a sua operação: ', err) // add toast err aq
    }

  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-3">
            {title}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Flex direction="column" className="gap-2">
              <Flex direction="column" className="gap-1">
                <Text as="label" htmlFor={nameId} className="font-medium text-black/90">
                  Nome:
                </Text>

                <TextField.Root id={nameId}
                  type="text"
                  autoComplete="name"
                  className="rt-TextFieldInput w-full bg-transparent outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? nameErrId : undefined}
                  disabled={saving} size="3">

                </TextField.Root>

                {nameError && (
                  <Text id={nameErrId} color="red" size="2">
                    {nameError}
                  </Text>
                )}
              </Flex>

              <Flex direction="column" className="gap-1">
                <Text as="label" className="font-medium text-black/90">Terminal:</Text>
                <ModalSelect
                  value={terminal}
                  onChange={setTerminal}
                  options={TERMINAL_OPTIONS}
                  placeholder="Selecione um terminal"
                  disabled={saving}
                />
              </Flex>
              <Flex direction="column" className="gap-1">
                <Text as="label" className="font-medium text-black/90">Tipo:</Text>
                <ModalSelect
                  value={type}
                  onChange={setType}
                  options={TYPE_OPTIONS}
                  placeholder="Selecione um tipo"
                  disabled={saving}
                />
              </Flex>
              {props.mode === "edit" && (
                <Flex direction="column" className="gap-1" >
                  <Text as="label" className="font-medium text-black/90">Status:</Text>
                  <ModalSelect
                    value={status}
                    onChange={setStatus}
                    options={STATUS_OPTIONS}
                    placeholder="Selecione um status"
                    disabled={saving}
                  />
                </Flex>
              )}
              <Flex direction="column" className="gap-1">
                <Text as="label" className="font-medium text-black/90">Descrição:</Text>
                <TextArea
                  size="3"
                  value={description}
                  placeholder="Informe uma descrição"
                  radius="large"
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </Flex>
            </Flex>

            <Flex direction="row" className="gap-3" justify="end">
              <Dialog.Close asChild>
                <Button size="1" color="red" radius="medium" disabled={saving}>
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                color="blue"
                disabled={saving}
                className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {saving ? "Salvando..." : submitLabel}
              </Button>
            </Flex>
          </form>

          <Dialog.Close asChild>
            <Button
              color="blue"
              aria-label="Fechar"
              disabled={saving}
            >
              <XMarkIcon color="green" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
}
