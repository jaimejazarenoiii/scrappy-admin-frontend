import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type { CompanyOwner } from '@/features/companies/types'
import { mockHandlers } from '@/shared/mocks/handlers'
import type { ListQueryParams, PaginatedResponse } from '@/shared/types/api'

export interface OwnerCreateInput {
  name: string
  email: string
}

export interface OwnerUpdateInput {
  name?: string
  email?: string
}

export interface OwnerLoginHistoryItem {
  id: string
  at: string
  success: boolean
  result?: string
  ip?: string | null
  userAgent?: string | null
}

export interface OwnerActivitySummary {
  ownerId: string
  recentActions: Array<{ id: string; summary: string; at: string }>
}

function liveUnavailable(action: string): never {
  throw new Error(
    `${action} is not available on the live admin API. Create OWNER/MANAGER/EMPLOYEE accounts via POST /admin/companies/{id}/accounts.`,
  )
}

export async function listCompanyOwners(
  companyId: string,
  _params?: ListQueryParams,
): Promise<PaginatedResponse<CompanyOwner> | CompanyOwner[]> {
  if (env.useMock) return callMock(() => mockHandlers.getCompanyOwners(companyId))
  void _params
  return []
}

export async function createOwner(companyId: string, payload: OwnerCreateInput): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.createOwner(companyId, payload))
  return liveUnavailable('Owner CRUD')
}

export async function getOwner(id: string): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.getOwner(id))
  void id
  return liveUnavailable('Owner detail')
}

export async function updateOwner(id: string, payload: OwnerUpdateInput): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.updateOwner(id, payload))
  return liveUnavailable('Owner update')
}

export async function activateOwner(id: string): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.activateOwner(id))
  void id
  return liveUnavailable('Owner activate')
}

export async function deactivateOwner(id: string): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.deactivateOwner(id))
  void id
  return liveUnavailable('Owner deactivate')
}

export async function lockOwner(id: string): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.lockOwner(id))
  void id
  return liveUnavailable('Owner lock')
}

export async function unlockOwner(id: string): Promise<CompanyOwner> {
  if (env.useMock) return callMock(() => mockHandlers.unlockOwner(id))
  void id
  return liveUnavailable('Owner unlock')
}

export async function resetOwnerPassword(id: string): Promise<{ accepted: true; message?: string }> {
  if (env.useMock) return callMock(() => mockHandlers.resetOwnerPassword(id))
  void id
  return liveUnavailable('Owner password reset')
}

export async function getOwnerLoginHistory(
  id: string,
  params?: ListQueryParams,
): Promise<PaginatedResponse<OwnerLoginHistoryItem>> {
  if (env.useMock) return callMock(() => mockHandlers.getOwnerLoginHistory(id, params))
  void id
  void params
  return { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 }
}

export async function getOwnerActivitySummary(id: string): Promise<OwnerActivitySummary> {
  if (env.useMock) return callMock(() => mockHandlers.getOwnerActivitySummary(id))
  return { ownerId: id, recentActions: [] }
}
