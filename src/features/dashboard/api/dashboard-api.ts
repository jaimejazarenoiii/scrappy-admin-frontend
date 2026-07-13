import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { filtersToApiParams } from '@/features/dashboard/lib/filter-url'
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

function mapOverviewToSummary(overview: Record<string, unknown>): DashboardSummaryResponse {
  return {
    total: Number(overview.totalCompanies ?? overview.companyCount ?? 0),
    active: Number(overview.activeCompanies ?? 0),
    trial: Number(overview.trialCompanies ?? 0),
    gracePeriod: Number(overview.gracePeriodCompanies ?? 0),
    expired: Number(overview.expiredCompanies ?? 0),
    suspended: Number(overview.suspendedCompanies ?? 0),
    newCompaniesToday: Number(overview.newCompaniesToday ?? 0),
    newCompaniesThisMonth: Number(overview.newCompaniesThisMonth ?? 0),
  }
}

export async function fetchDashboardSummary(
  filters: DashboardFilterSet,
): Promise<DashboardSummaryResponse> {
  if (env.useMock) return callMock(() => mockHandlers.dashboardSummary(filters))
  const { data } = await apiClient.get<Record<string, unknown>>('/admin/analytics/overview', {
    params: filtersToApiParams(filters),
  })
  return mapOverviewToSummary(data)
}

export async function fetchPlatformStatistics(
  filters: DashboardFilterSet,
): Promise<PlatformStatisticsResponse> {
  if (env.useMock) return callMock(() => mockHandlers.dashboardStatistics(filters))
  const { data } = await apiClient.get<Record<string, unknown>>('/admin/analytics/overview', {
    params: filtersToApiParams(filters),
  })
  return {
    users: {
      totalUsers: Number(data.totalUsers ?? 0),
      owners: Number(data.owners ?? 0),
      managers: Number(data.managers ?? 0),
      employees: Number(data.employees ?? 0),
      activeUsers: Number(data.activeUsers ?? 0),
      inactiveUsers: Number(data.inactiveUsers ?? 0),
      lockedUsers: Number(data.lockedUsers ?? 0),
      newUsersThisMonth: Number(data.newUsersThisMonth ?? 0),
    },
    operations: {
      transactions: {
        total: Number(data.totalTransactions ?? 0),
        today: Number(data.transactionsToday ?? 0),
        week: Number(data.transactionsThisWeek ?? 0),
        month: Number(data.transactionsThisMonth ?? 0),
        inbound: Number(data.inboundTransactions ?? 0),
        outbound: Number(data.outboundTransactions ?? 0),
      },
      trips: {
        total: Number(data.totalTrips ?? 0),
        completed: Number(data.completedTrips ?? 0),
        active: Number(data.activeTrips ?? 0),
        cancelled: Number(data.cancelledTrips ?? 0),
      },
      totalExpenses: Number(data.totalExpenses ?? 0),
      totalBranches: Number(data.totalBranches ?? 0),
      totalWarehouses: Number(data.totalWarehouses ?? 0),
      totalVehicles: Number(data.totalVehicles ?? 0),
    },
  }
}

export async function fetchGrowthAnalytics(
  filters: DashboardFilterSet,
): Promise<GrowthSeriesBundle> {
  if (env.useMock) return callMock(() => mockHandlers.growthAnalytics(filters))
  // Growth series not a dedicated admin overview field — empty-safe fallback
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
  const { data } = await apiClient.get<Record<string, unknown>>('/admin/analytics/overview', {
    params: filtersToApiParams(filters),
  })
  return {
    distribution: [
      { status: 'TRIAL', count: Number(data.trialCompanies ?? 0) },
      { status: 'ACTIVE', count: Number(data.activeCompanies ?? 0) },
      { status: 'GRACE_PERIOD', count: Number(data.gracePeriodCompanies ?? 0) },
      { status: 'EXPIRED', count: Number(data.expiredCompanies ?? 0) },
      { status: 'SUSPENDED', count: Number(data.suspendedCompanies ?? 0) },
    ],
    statusBreakdown: {},
    averageDurationDays: Number(data.averageSubscriptionDays ?? 0),
    expiringSoon: [],
    recentlyExpired: [],
    recentlyRenewed: [],
  }
}

export async function fetchCompanyRankings(
  filters: DashboardFilterSet,
  limit = 5,
): Promise<CompanyRankingSet> {
  if (env.useMock) return callMock(() => mockHandlers.companyRankings(filters, limit))
  void filters
  void limit
  return {
    mostActive: [],
    leastActive: [],
    newest: [],
    mostUsers: [],
    highestTransactionVolume: [],
  }
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
  void filters
  void limit
  return { items: [] }
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
