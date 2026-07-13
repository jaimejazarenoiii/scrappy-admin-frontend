import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type { Administrator } from '@/features/administrators/types'
import { mockHandlers } from '@/shared/mocks/handlers'
import type { ListQueryParams, PaginatedResponse, Role } from '@/shared/types/api'

function liveUnavailable(): never {
  throw new Error(
    'Administrator management is not available on the live admin API yet. Use mock mode or create SUPER_ADMIN via CLI.',
  )
}

export async function listAdministrators(
  params?: ListQueryParams,
): Promise<PaginatedResponse<Administrator>> {
  if (env.useMock) return callMock(() => mockHandlers.listAdministrators(params))
  return { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 }
}

export async function getAdministrator(id: string): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.getAdministrator(id))
  void id
  return liveUnavailable()
}

export async function createAdministrator(payload: {
  email: string
  name: string
  roles: Role[]
}): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.createAdministrator(payload))
  return liveUnavailable()
}

export async function updateAdministrator(
  id: string,
  payload: Partial<Pick<Administrator, 'roles' | 'status' | 'name'>>,
): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.updateAdministrator(id, payload))
  return liveUnavailable()
}

export async function deactivateAdministrator(id: string): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.deactivateAdministrator(id))
  void id
  return liveUnavailable()
}

export async function activateAdministrator(id: string): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.activateAdministrator(id))
  void id
  return liveUnavailable()
}

export async function lockAdministrator(id: string): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.lockAdministrator(id))
  void id
  return liveUnavailable()
}

export async function unlockAdministrator(id: string): Promise<Administrator> {
  if (env.useMock) return callMock(() => mockHandlers.unlockAdministrator(id))
  void id
  return liveUnavailable()
}

export async function resetAdministratorPassword(
  id: string,
): Promise<{ accepted: true; message?: string }> {
  if (env.useMock) return callMock(() => mockHandlers.resetAdministratorPassword(id))
  void id
  return liveUnavailable()
}
