import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { filtersToApiParams } from '@/features/dashboard/lib/filter-url'
import {
  overviewToAttention,
  overviewToPlatformStatistics,
  overviewToRankings,
  overviewToSubscriptionAnalytics,
  overviewToSummary,
  parseAdminOverview,
} from '@/features/dashboard/lib/map-admin-overview'
import type {
  AttentionCompaniesResponse,
  CompanyRankingSet,
  DashboardFilterSet,
  DashboardSummaryResponse,
  GrowthSeriesBundle,
  PlatformStatisticsResponse,
  QuickActionsResponse,
  RecentActivitiesResponse,
  SubscriptionOverview,
} from '@/features/dashboard/types'
import { mockHandlers } from '@/shared/mocks/handlers'

async function fetchLiveOverview(filters: DashboardFilterSet) {
  const { data } = await apiClient.get<unknown>('/admin/analytics/overview', {
    params: filtersToApiParams(filters),
  })
  return parseAdminOverview(data)
}

export async function fetchDashboardSummary(
  filters: DashboardFilterSet,
): Promise<DashboardSummaryResponse> {
  if (env.useMock) return callMock(() => mockHandlers.dashboardSummary(filters))
  const overview = await fetchLiveOverview(filters)
  return overviewToSummary(overview)
}

export async function fetchPlatformStatistics(
  filters: DashboardFilterSet,
): Promise<PlatformStatisticsResponse> {
  if (env.useMock) return callMock(() => mockHandlers.dashboardStatistics(filters))
  const overview = await fetchLiveOverview(filters)
  return overviewToPlatformStatistics(overview)
}

export async function fetchGrowthAnalytics(
  filters: DashboardFilterSet,
): Promise<GrowthSeriesBundle> {
  if (env.useMock) return callMock(() => mockHandlers.growthAnalytics(filters))
  // Overview is a point-in-time portfolio — no time series yet.
  void filters
  return {
    companies: [],
    users: [],
    transactions: [],
    trips: [],
    expenses: [],
    subscriptions: [],
  }
}

export async function fetchSubscriptionAnalytics(
  filters: DashboardFilterSet,
): Promise<SubscriptionOverview> {
  if (env.useMock) return callMock(() => mockHandlers.subscriptionAnalytics(filters))
  const overview = await fetchLiveOverview(filters)
  return overviewToSubscriptionAnalytics(overview)
}

export async function fetchCompanyRankings(
  filters: DashboardFilterSet,
  limit = 5,
): Promise<CompanyRankingSet> {
  if (env.useMock) return callMock(() => mockHandlers.companyRankings(filters, limit))
  const overview = await fetchLiveOverview(filters)
  return overviewToRankings(overview, limit)
}

export async function fetchRecentActivities(
  filters: DashboardFilterSet,
  limit = 8,
): Promise<RecentActivitiesResponse> {
  if (env.useMock) return callMock(() => mockHandlers.dashboardRecentActivities(filters, limit))
  void filters
  void limit
  return { items: [], total: 0 }
}

export async function fetchAttentionCompanies(
  filters: DashboardFilterSet,
  limit = 10,
): Promise<AttentionCompaniesResponse> {
  if (env.useMock) return callMock(() => mockHandlers.attentionCompanies(filters, limit))
  const overview = await fetchLiveOverview(filters)
  return overviewToAttention(overview, limit)
}

export async function fetchQuickActions(): Promise<QuickActionsResponse> {
  if (env.useMock) return callMock(() => mockHandlers.quickActions())
  return {
    items: [
      { key: 'create_company', label: 'Create company', destination: '/companies/new' },
      { key: 'view_companies', label: 'Companies', destination: '/companies' },
      { key: 'manage_subscriptions', label: 'Subscriptions', destination: '/subscriptions' },
    ],
  }
}
