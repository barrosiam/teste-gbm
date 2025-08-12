type Props = {
  disabled: boolean
  color: string
  label: string
  onClick?: () => void
  type?: 'reset' | 'submit' | 'button'
  classInfo?: string
}

export const Button = ({
  disabled,
  color,
  label,
  onClick,
  type = 'button',
  classInfo,
}: Props) => {
  return (
    <div className={`${classInfo}`}>
      <button
        className={`rounded-md ${classInfo} transition-colors bg-${color} rounded p-3 font-medium text-white hover:bg-${color} disabled:opacity-50`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {label}
      </button>
    </div>
  )
}
