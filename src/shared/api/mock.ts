import { ApiClientError } from '@/shared/api/errors'

export async function callMock<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const payload = error as { code?: string; message: string; status?: number }
      throw new ApiClientError(payload.message, {
        code: payload.code ?? 'MOCK_ERROR',
        status: payload.status,
      })
    }
    throw error
  }
}
