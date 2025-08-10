import * as Dialog from "@radix-ui/react-dialog";
import { TextArea, Text, Flex, Button } from "@radix-ui/themes";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import type { Operation } from "../../types/operations/operation";
import { ModalSelect } from "../inputs/select";
import {
  STATUS_OPTIONS, TYPE_OPTIONS, TERMINAL_OPTIONS,
  type OpStatus, type OpType, type OpTerminal
} from "../inputs/select/selectOptions";


// type EditProps = {
//   mode: 'edit',
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   operation: Operation; // edição sempre vem com operação completa
//   onSubmit: (updated: Operation) => void | Promise<void>;
//   saving?: boolean;
// };

// type CreateProps = {
//   mode: 'create',
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   // valores padrão opcionais para pré-preencher na criação
//   initial?: Partial<Pick<Operation, "description" | "type" | "terminal" | "status">>;
//   onSubmit: (values: Omit<Operation, "id">) => void | Promise<void>;
//   saving?: boolean;
// };

type BaseProps= {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  saving?: boolean;
};

type CreateProps = BaseProps & {
  mode: "create"
  onSubmit: (values: Omit<Operation, "id">) => void | Promise<void>;
  initial?: Partial<Pick<Operation, "description" | "type" | "terminal" | "status">>; // opcional no create
};

type EditProps = BaseProps & {
  mode: "edit"
  operation: Operation; // vem com id
  onSubmit: (updated: Operation) => void | Promise<void>;
};


type Props = CreateProps | EditProps

export function OperationModal(props: Props) {
  const { open, onOpenChange, saving = false } = props;

  const [description, setDescription] = useState("");
  const [terminal, setTerminal] = useState<OpTerminal | "">("");
  const [type, setType] = useState<OpType | "">("");
  const [status, setStatus] = useState<OpStatus | "">("");

  useEffect(() => {
    if (!open) return;

    if (props.mode === "edit") {
      const op = props.operation;
      setDescription(op.description ?? "");
      setType(op.type ?? "");
      setTerminal(op.terminal ?? "");
      setStatus(op.status ?? "");
    } else {
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

    // add lib de gerenciamento de formulario
    if (!type || !terminal || !status || !description) return;

    const submitData = {
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
              <Flex direction="column">
                <Text as="label" className="font-medium text-rgba(0, 0, 0, 0.9)">Descrição:</Text>
                <TextArea
                  size="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </Flex>

              <Flex align="center" className="gap-2">
                <Text as="label" className="font-medium text-rgba(0, 0, 0, 0.9)">Terminal:</Text>
                <ModalSelect
                  value={terminal}
                  onChange={setTerminal}
                  options={TERMINAL_OPTIONS}
                  placeholder="Selecione um terminal"
                  disabled={saving}
                />
              </Flex>
              <Flex align="center" className="gap-2">
                <Text as="label" className="font-medium text-rgba(0, 0, 0, 0.9)">Tipo:</Text>
                <ModalSelect
                  value={type}
                  onChange={setType}
                  options={TYPE_OPTIONS}
                  placeholder="Selecione um tipo"
                  disabled={saving}
                />
              </Flex>

              <Flex align="center" className="gap-2" >
                <Text as="label" className="font-medium text-rgba(0, 0, 0, 0.9)">Status:</Text>
                <ModalSelect
                  value={status}
                  onChange={setStatus}
                  options={STATUS_OPTIONS}
                  placeholder="Selecione um status"
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
