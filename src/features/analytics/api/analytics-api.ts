import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { mockHandlers } from '@/shared/mocks/handlers'

export interface AnalyticsPayload {
  reportKey: string
  generatedAt: string
  series: Array<{ label: string; value: number }>
  breakdown: Array<{ name: string; value: number }>
}

/** Prefer dashboard widgets (`/admin/analytics/overview`) for live portfolio metrics. */
export async function fetchAnalytics(reportKey: string): Promise<AnalyticsPayload> {
  if (env.useMock) return callMock(() => mockHandlers.analytics(reportKey))
  if (reportKey === 'overview' || reportKey === 'platform') {
    const { data } = await apiClient.get<Record<string, unknown>>('/admin/analytics/overview')
    return {
      reportKey,
      generatedAt: (data.generatedAt as string) ?? new Date().toISOString(),
      series: [
        { label: 'Companies', value: Number(data.totalCompanies ?? data.companyCount ?? 0) },
        { label: 'Active', value: Number(data.activeCompanies ?? 0) },
        { label: 'Trial', value: Number(data.trialCompanies ?? 0) },
        { label: 'Users', value: Number(data.totalUsers ?? 0) },
      ],
      breakdown: [
        { name: 'TRIAL', value: Number(data.trialCompanies ?? 0) },
        { name: 'ACTIVE', value: Number(data.activeCompanies ?? 0) },
        { name: 'GRACE_PERIOD', value: Number(data.gracePeriodCompanies ?? 0) },
        { name: 'EXPIRED', value: Number(data.expiredCompanies ?? 0) },
        { name: 'SUSPENDED', value: Number(data.suspendedCompanies ?? 0) },
      ],
    }
  }
  return {
    reportKey,
    generatedAt: new Date().toISOString(),
    series: [],
    breakdown: [],
  }
}
