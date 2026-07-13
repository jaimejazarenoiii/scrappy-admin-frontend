export { toast, Toaster } from 'sonner'
export type { ExternalToast } from 'sonner'

import { toast as sonnerToast } from 'sonner'

export function showSuccess(message: string) {
  return sonnerToast.success(message)
}

export function showError(message: string) {
  return sonnerToast.error(message)
}

export function showInfo(message: string) {
  return sonnerToast.info(message)
}

export function showWarning(message: string) {
  return sonnerToast.warning(message)
}

export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  },
) {
  return sonnerToast.promise(promise, messages)
}
