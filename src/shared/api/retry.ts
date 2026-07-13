import type { AxiosRequestConfig } from 'axios'
import { apiClient } from '@/shared/api/client'
import { isApiClientError } from '@/shared/api/errors'

export interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 400,
  shouldRetry: (error) => {
    if (isApiClientError(error)) {
      const status = error.status
      return status === undefined || status >= 500 || status === 429
    }
    return true
  },
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retryGet<T>(
  url: string,
  config?: AxiosRequestConfig,
  options?: RetryOptions,
): Promise<T> {
  const { maxAttempts, delayMs, shouldRetry } = { ...DEFAULT_OPTIONS, ...options }

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await apiClient.get<T>(url, config)
      return response.data
    } catch (error) {
      lastError = error
      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        throw error
      }
      await sleep(delayMs * attempt)
    }
  }

  throw lastError
}
