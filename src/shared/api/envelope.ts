import type { ApiError } from '@/shared/types/api'

/** Scrappy API success/error envelope (`/api/v1`). */
export interface ApiEnvelope<T> {
  success: boolean
  data: T
  meta: Record<string, unknown>
  error: ApiError | null
}

export interface ApiPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    'data' in value &&
    'error' in value
  )
}
