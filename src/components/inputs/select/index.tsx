import { Select } from '@radix-ui/themes'

export type Option<V extends string> = { value: V; label: string }

type Props<V extends string> = {
  value: V | ''
  onChange: (value: V) => void
  options: readonly Option<V>[]
  placeholder?: string
  disabled?: boolean
}

export function ModalSelect<V extends string>({
  value,
  onChange,
  options,
  placeholder = 'Selecione…',
  disabled,
}: Props<V>) {
  return (
    <Select.Root
      value={value || undefined}
      onValueChange={(v) => onChange(v as V)}
      disabled={disabled}
      size="3"
    >
      <Select.Trigger
        className={[
          '[&.rt-SelectTrigger]:border',
          '[&.rt-SelectTrigger]:border-gray-300',
          'focus:ring-2 focus:ring-indigo-500',
          'w-full',
        ].join(' ')}
        placeholder={placeholder}
      />
      <Select.Content color="indigo" variant="soft" position="popper">
        {options.map((opt) => (
          <Select.Item key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
