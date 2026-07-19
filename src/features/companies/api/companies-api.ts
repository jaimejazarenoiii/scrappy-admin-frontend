import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type {
  AdministrativeNote,
  AdministrativeTimelineEvent,
  Company,
  CompanyAccount,
  CompanyAccountCreateInput,
  CompanyAccountPasswordResetResult,
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

export async function listCompanyAccounts(companyId: string): Promise<CompanyAccount[]> {
  if (env.useMock) return callMock(() => mockHandlers.listCompanyAccounts(companyId))
  const { data } = await apiClient.get<CompanyAccount[]>(`/admin/companies/${companyId}/accounts`)
  return Array.isArray(data) ? data : []
}

export async function resetCompanyAccountPassword(
  companyId: string,
  userId: string,
  temporaryPassword: string,
): Promise<CompanyAccountPasswordResetResult> {
  if (env.useMock) {
    return callMock(() =>
      mockHandlers.resetCompanyAccountPassword(companyId, userId, temporaryPassword),
    )
  }
  const { data } = await apiClient.post<CompanyAccountPasswordResetResult>(
    `/admin/companies/${companyId}/accounts/${userId}/password-reset`,
    { temporaryPassword },
  )
  return data
}

function emptyCompanyStatistics(id: string): CompanyStatistics {
  return {
    companyId: id,
    totalInboundTransactions: 0,
    totalOutboundTransactions: 0,
    totalTransactionAmount: 0,
    inboundAmount: 0,
    outboundAmount: 0,
    totalExpenses: 0,
    totalPayroll: 0,
    netOperationalAmount: 0,
    activeEmployees: 0,
    activeTrips: 0,
    activeVehicles: 0,
    period: null,
    periodFrom: null,
    periodTo: null,
    generatedAt: null,
  }
}

export async function getCompanyStatistics(id: string): Promise<CompanyStatistics> {
  if (env.useMock) {
    const mock = await callMock(() => mockHandlers.getCompanyStatistics(id))
    return {
      ...emptyCompanyStatistics(id),
      totalInboundTransactions: mock.transactionVolume,
      totalTransactionAmount: mock.transactionVolume,
      inboundAmount: mock.transactionVolume,
      totalExpenses: mock.expenseVolume,
      activeEmployees: mock.activeUsers,
      activeTrips: mock.tripVolume,
      generatedAt: mock.lastActivityAt,
      period: 'THIS_MONTH',
    }
  }
  try {
    const { data } = await apiClient.get<Record<string, unknown>>(
      `/admin/analytics/companies/${id}/company`,
    )
    const applied = (data.appliedFilters ?? {}) as Record<string, unknown>
    const num = (value: unknown) => {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return {
      companyId: id,
      totalInboundTransactions: num(data.totalInboundTransactions),
      totalOutboundTransactions: num(data.totalOutboundTransactions),
      totalTransactionAmount: num(data.totalTransactionAmount),
      inboundAmount: num(data.inboundAmount),
      outboundAmount: num(data.outboundAmount),
      totalExpenses: num(data.totalExpenses),
      totalPayroll: num(data.totalPayroll),
      netOperationalAmount: num(data.netOperationalAmount),
      activeEmployees: num(data.activeEmployees),
      activeTrips: num(data.activeTrips),
      activeVehicles: num(data.activeVehicles),
      period: typeof applied.period === 'string' ? applied.period : null,
      periodFrom: typeof applied.from === 'string' ? applied.from : null,
      periodTo: typeof applied.to === 'string' ? applied.to : null,
      generatedAt: typeof data.generatedAt === 'string' ? data.generatedAt : null,
    }
  } catch {
    return emptyCompanyStatistics(id)
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
