import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type {
  AdministrativeNote,
  AdministrativeTimelineEvent,
  Company,
  CompanyAccountCreateInput,
  CompanyCreateInput,
  CompanyOwner,
  CompanyStatistics,
  CompanyUpdateInput,
} from '@/features/companies/types'
import { mockHandlers } from '@/shared/mocks/handlers'
import type { ListQueryParams, PaginatedResponse } from '@/shared/types/api'

function toListParams(params?: ListQueryParams & { status?: string }) {
  if (!params) return undefined
  return {
    page: params.page,
    limit: params.pageSize,
    search: params.q,
    sortBy: params.sort,
    sortOrder: params.order,
    status: params.status?.toUpperCase(),
  }
}

export async function listCompanies(
  params?: ListQueryParams & { status?: string },
): Promise<PaginatedResponse<Company>> {
  if (env.useMock) return callMock(() => mockHandlers.listCompanies(params))
  const { data } = await apiClient.get<PaginatedResponse<Company>>('/admin/companies', {
    params: toListParams(params),
  })
  return data
}

export async function getCompany(id: string): Promise<Company> {
  if (env.useMock) return callMock(() => mockHandlers.getCompany(id))
  const { data } = await apiClient.get<Company>(`/admin/companies/${id}`)
  return data
}

export async function createCompany(payload: CompanyCreateInput): Promise<Company> {
  if (env.useMock) return callMock(() => mockHandlers.createCompany(payload))
  const { data } = await apiClient.post<Company>('/admin/companies', {
    name: payload.name,
    contactNumber: payload.contactNumber,
    email: payload.email ?? payload.contactEmail,
    address: payload.address,
  })
  return data
}

export async function updateCompany(id: string, payload: CompanyUpdateInput): Promise<Company> {
  if (env.useMock) return callMock(() => mockHandlers.updateCompany(id, payload as { name: string }))
  void id
  void payload
  throw new Error(
    'Company update is not available on the live admin API. Use subscription lifecycle for entitlement changes.',
  )
}

export async function createCompanyAccount(
  companyId: string,
  payload: CompanyAccountCreateInput,
): Promise<unknown> {
  if (env.useMock) return callMock(() => mockHandlers.createCompanyAccount(companyId, payload))
  const { data } = await apiClient.post(`/admin/companies/${companyId}/accounts`, payload)
  return data
}

export async function getCompanyStatistics(id: string): Promise<CompanyStatistics> {
  if (env.useMock) return callMock(() => mockHandlers.getCompanyStatistics(id))
  // Prefer per-company admin analytics when live.
  try {
    const { data } = await apiClient.get<Record<string, unknown>>(
      `/admin/analytics/companies/${id}/company`,
    )
    return {
      companyId: id,
      transactionVolume: Number(data.totalTransactionAmount ?? data.transactionVolume ?? 0),
      tripVolume: Number(data.activeTrips ?? data.tripVolume ?? 0),
      expenseVolume: Number(data.totalExpenses ?? data.expenseVolume ?? 0),
      activeUsers: Number(data.activeEmployees ?? data.activeUsers ?? 0),
      lastActivityAt: (data.generatedAt as string) ?? null,
    }
  } catch {
    return {
      companyId: id,
      transactionVolume: 0,
      tripVolume: 0,
      expenseVolume: 0,
      activeUsers: 0,
      lastActivityAt: null,
    }
  }
}

export async function getCompanyOwners(companyId: string): Promise<CompanyOwner[]> {
  if (env.useMock) return callMock(() => mockHandlers.getCompanyOwners(companyId))
  // No dedicated owners list in admin API — return empty; use accounts create instead.
  void companyId
  return []
}

export async function getCompanyNotes(companyId: string): Promise<AdministrativeNote[]> {
  if (env.useMock) return callMock(() => mockHandlers.getCompanyNotes(companyId))
  void companyId
  return []
}

export async function getCompanyTimeline(companyId: string): Promise<AdministrativeTimelineEvent[]> {
  if (env.useMock) return callMock(() => mockHandlers.getCompanyTimeline(companyId))
  void companyId
  return []
}

export async function addCompanyNote(companyId: string, body: string): Promise<AdministrativeNote> {
  if (env.useMock) return callMock(() => mockHandlers.addCompanyNote(companyId, body))
  throw new Error('Company notes are not available on the live admin API yet')
}

/** Subscription cascade is the live entitlement control — no activate/deactivate company admin route. */
export async function activateCompany(id: string): Promise<Company> {
  if (env.useMock) return callMock(() => mockHandlers.activateCompany(id))
  return getCompany(id)
}

export async function deactivateCompany(id: string): Promise<Company> {
  if (env.useMock) return callMock(() => mockHandlers.deactivateCompany(id))
  return getCompany(id)
}
