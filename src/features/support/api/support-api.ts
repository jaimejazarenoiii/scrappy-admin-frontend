import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { mockHandlers } from '@/shared/mocks/handlers'

export async function triggerPasswordReset(userId: string) {
  if (env.useMock) return callMock(() => mockHandlers.triggerPasswordReset(userId))
  const { data } = await apiClient.post<{ userId: string; status: string }>(
    `/admin/users/${userId}/password-reset`,
  )
  return data
}

export async function unlockUser(userId: string) {
  if (env.useMock) return callMock(() => mockHandlers.unlockUser(userId))
  const { data } = await apiClient.post<{ userId: string; status: string }>(
    `/admin/users/${userId}/unlock`,
  )
  return data
}
