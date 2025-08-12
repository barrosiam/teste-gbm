import * as React from 'react'
import { ToastCtx } from '../components/toast/ToastContext.ts'

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
