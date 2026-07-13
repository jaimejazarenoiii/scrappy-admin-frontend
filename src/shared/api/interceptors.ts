import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { apiClient } from '@/shared/api/client'
import { isApiEnvelope, type ApiPaginationMeta } from '@/shared/api/envelope'
import { ApiClientError, mapAxiosError } from '@/shared/api/errors'
import * as tokenStorage from '@/features/auth/lib/token-storage'
import type { PaginatedResponse } from '@/shared/types/api'

type AuthStoreModule = typeof import('@/features/auth/store/auth-store')

let authStorePromise: Promise<AuthStoreModule> | null = null
let refreshPromise: Promise<string | null> | null = null

const SKIP_REFRESH_PATHS = [
  '/admin/auth/login',
  '/auth/login',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
]

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return false
  return SKIP_REFRESH_PATHS.some((path) => url.includes(path))
}

async function getAuthStore(): Promise<AuthStoreModule> {
  if (!authStorePromise) {
    authStorePromise = import('@/features/auth/store/auth-store')
  }
  return authStorePromise
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { useAuthStore } = await getAuthStore()
      return useAuthStore.getState().refreshSession()
    })().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

function unwrapEnvelope(response: AxiosResponse): AxiosResponse {
  const body = response.data
  if (!isApiEnvelope(body)) {
    return response
  }

  if (!body.success) {
    const err = body.error
    throw new ApiClientError(err?.message ?? 'Request failed', {
      code: err?.code ?? 'REQUEST_FAILED',
      status: response.status,
      details: err?.details as Record<string, unknown> | undefined,
    })
  }

  const meta = body.meta as Partial<ApiPaginationMeta> | undefined
  if (Array.isArray(body.data) && meta && typeof meta.total === 'number') {
    const page: PaginatedResponse<unknown> = {
      items: body.data,
      page: meta.page ?? 1,
      pageSize: meta.limit ?? body.data.length,
      total: meta.total,
      totalPages: meta.totalPages ?? 1,
    }
    response.data = page
  } else {
    response.data = body.data
  }

  return response
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => unwrapEnvelope(response),
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = originalRequest?.url

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl)
    ) {
      originalRequest._retry = true

      try {
        const newToken = await refreshAccessToken()
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }

        const { useAuthStore } = await getAuthStore()
        useAuthStore.getState().clearSession()
        useAuthStore.setState({ sessionExpired: true })
      } catch {
        const { useAuthStore } = await getAuthStore()
        useAuthStore.getState().clearSession()
        useAuthStore.setState({ sessionExpired: true })
      }
    }

    return Promise.reject(mapAxiosError(error))
  },
)

export function setupApiInterceptors(): void {
  // Interceptors are registered on module load; this export exists for explicit app wiring.
}
