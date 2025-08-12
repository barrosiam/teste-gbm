import * as React from 'react'
import * as Toast from '@radix-ui/react-toast'
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import { ToastCtx, type ToastMsg } from './ToastContext'
import { useBreakpoint } from '../../hooks/useMediaQuery'

function colorClasses(c?: ToastMsg['color']) {
  switch (c) {
    case 'red':
      return {
        root: 'bg-red-50 border-red-200',
        title: 'text-red-900',
        desc: 'text-red-700',
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />,
      }
    case 'blue':
      return {
        root: 'bg-blue-50 border-blue-200',
        title: 'text-blue-900',
        desc: 'text-blue-700',
        icon: <InformationCircleIcon className="h-5 w-5 text-blue-600" />,
      }
    case 'amber':
      return {
        root: 'bg-amber-50 border-amber-200',
        title: 'text-amber-900',
        desc: 'text-amber-700',
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />,
      }
    default:
      return {
        root: 'bg-green-50 border-green-200',
        title: 'text-green-900',
        desc: 'text-green-700',
        icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
      }
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { isSmUp } = useBreakpoint()
  const swipeDir = isSmUp ? 'right' : 'down'

  const [items, setItems] = React.useState<ToastMsg[]>([])

  const remove = React.useCallback(
    (id: string) => setItems((prev) => prev.filter((t) => t.id !== id)),
    [],
  )

  const show = React.useCallback((m: Omit<ToastMsg, 'id'>) => {
    const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random())
    setItems((prev) => [...prev, { id, duration: 3000, color: 'green', ...m }])
  }, [])

  const toastSuccess = React.useCallback(
    (title: string, description?: string) =>
      show({ title, description, color: 'green' }),
    [show],
  )

  const toastError = React.useCallback(
    (title: string, description?: string) =>
      show({ title, description, color: 'red' }),
    [show],
  )

  const value = React.useMemo(
    () => ({ show, toastSuccess, toastError }),
    [show, toastSuccess, toastError],
  )

  const viewportClass = React.useMemo(
    () =>
      isSmUp
        ? [
            'fixed z-[9999] m-0 flex flex-col gap-2 outline-none',
            'right-4 bottom-4 left-auto',
            'w-[360px] max-w-[calc(100vw-2rem)]',
          ].join(' ')
        : [
            'fixed z-[9999] m-0 flex flex-col gap-2 outline-none',
            'left-0 right-0 px-4',
            'bottom-[max(theme(spacing.4),env(safe-area-inset-bottom))]',
          ].join(' '),
    [isSmUp],
  )

  return (
    <ToastCtx.Provider value={value}>
      <Toast.Provider swipeDirection={swipeDir}>
        {children}

        {items.map((t) => {
          const c = colorClasses(t.color)
          return (
            <Toast.Root
              key={t.id}
              duration={t.duration}
              defaultOpen
              onOpenChange={(open) => !open && remove(t.id)}
              className={[
                'w-full max-w-full',
                'group flex items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg',
                c.root,
                'min-w-0',
                'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
                'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-200',
                'data-[swipe=end]:animate-toastSwipeOut',
                'data-[state=open]:animate-toastIn data-[state=closed]:animate-toastOut',
              ].join(' ')}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 shrink-0">{c.icon}</div>
                <div className="min-w-0">
                  <Toast.Title
                    className={`leading-5 font-medium ${c.title} break-words`}
                  >
                    {t.title}
                  </Toast.Title>
                  {t.description && (
                    <Toast.Description
                      className={`mt-1 text-sm leading-5 ${c.desc} break-words`}
                    >
                      {t.description}
                    </Toast.Description>
                  )}
                </div>
              </div>

              <Toast.Close
                aria-label="Fechar"
                className="self-start rounded opacity-60 transition hover:opacity-100 focus:ring-2 focus:ring-black/20 focus:outline-none"
              >
                <XMarkIcon className="h-4 w-4" />
              </Toast.Close>
            </Toast.Root>
          )
        })}

        <Toast.Viewport className={viewportClass} />
      </Toast.Provider>
    </ToastCtx.Provider>
  )
}
