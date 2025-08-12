import * as React from 'react'

export type ToastColor = 'green' | 'red' | 'blue' | 'amber'

export type ToastMsg = {
  id: string
  title: string
  description?: string
  color?: ToastColor
  duration?: number
}

export type ToastCtxType = {
  show: (m: Omit<ToastMsg, 'id'>) => void
  toastSuccess: (title: string, description?: string) => void
  toastError: (title: string, description?: string) => void
}

export const ToastCtx = React.createContext<ToastCtxType | null>(null)
