import type { ApiError } from '@/shared/types/api'
import type { AxiosError } from 'axios'
import { isApiEnvelope } from '@/shared/api/envelope'

export class ApiClientError extends Error {
  readonly code: string
  readonly status: number | undefined
  readonly details: Record<string, unknown> | undefined

  constructor(
    message: string,
    options: {
      code?: string
      status?: number
      details?: Record<string, unknown>
      cause?: unknown
    } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiClientError'
    this.code = options.code ?? 'UNKNOWN_ERROR'
    this.status = options.status
    this.details = options.details
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

export function mapAxiosError(error: unknown): ApiClientError {
  if (isApiClientError(error)) {
    return error
  }

  const axiosError = error as AxiosError<unknown>

  if (axiosError?.isAxiosError) {
    const body = axiosError.response?.data
    if (isApiEnvelope(body) && body.error) {
      const err = body.error
      const details = err.details
      let message = err.message
      if (Array.isArray(details) && details.length > 0) {
        const parts = details
          .map((item) => {
            if (item && typeof item === 'object' && 'path' in item && 'message' in item) {
              return `${String((item as { path: unknown }).path)}: ${String((item as { message: unknown }).message)}`
            }
            return null
          })
          .filter(Boolean)
        if (parts.length) {
          message = `${err.message} (${parts.join('; ')})`
        }
      }
      return new ApiClientError(message, {
        code: err.code,
        status: axiosError.response?.status,
        details: details as Record<string, unknown> | undefined,
        cause: error,
      })
    }

    const legacy = body as ApiError | undefined
    return new ApiClientError(legacy?.message ?? axiosError.message, {
      code: legacy?.code ?? 'HTTP_ERROR',
      status: axiosError.response?.status,
      details: legacy?.details as Record<string, unknown> | undefined,
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message, { code: 'CLIENT_ERROR', cause: error })
  }

  return new ApiClientError('An unexpected error occurred', { code: 'UNKNOWN_ERROR', cause: error })
}
