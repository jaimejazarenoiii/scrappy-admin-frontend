import type {
  AttentionCompaniesResponse,
  AttentionReason,
  CompanyRankingSet,
  DashboardSummaryResponse,
  PlatformStatisticsResponse,
  RecentCompanyItem,
  SubscriptionOverview,
} from '@/features/dashboard/types'

/** Live `GET /admin/analytics/overview` company row. */
export interface AdminOverviewCompanyMetrics {
  totalInboundTransactions: number
  totalOutboundTransactions: number
  totalTransactionAmount: number
  totalExpenses: number
  totalPayroll: number
  netOperationalAmount: number
  activeEmployees: number
  activeTrips: number
  activeVehicles: number
}

export interface AdminOverviewCompanyItem {
  companyId: string
  name: string
  status: string
  subscriptionStatus: string
  metrics: AdminOverviewCompanyMetrics
}

export interface AdminOverviewResponse {
  items: AdminOverviewCompanyItem[]
  appliedFilters?: Record<string, unknown>
  generatedAt?: string
}

function num(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function normalizeStatus(value: string | undefined | null): string {
  return (value ?? '').toUpperCase().replace(/-/g, '_')
}

export function parseAdminOverview(payload: unknown): AdminOverviewResponse {
  if (!payload || typeof payload !== 'object') {
    return { items: [] }
  }
  const root = payload as Record<string, unknown>
  const rawItems = Array.isArray(root.items)
    ? root.items
    : Array.isArray(payload)
      ? payload
      : []

  const items: AdminOverviewCompanyItem[] = rawItems.map((row) => {
    const item = (row ?? {}) as Record<string, unknown>
    const metrics = (item.metrics ?? {}) as Record<string, unknown>
    return {
      companyId: String(item.companyId ?? ''),
      name: String(item.name ?? 'Company'),
      status: String(item.status ?? 'ACTIVE'),
      subscriptionStatus: String(item.subscriptionStatus ?? 'TRIAL'),
      metrics: {
        totalInboundTransactions: num(metrics.totalInboundTransactions),
        totalOutboundTransactions: num(metrics.totalOutboundTransactions),
        totalTransactionAmount: num(metrics.totalTransactionAmount),
        totalExpenses: num(metrics.totalExpenses),
        totalPayroll: num(metrics.totalPayroll),
        netOperationalAmount: num(metrics.netOperationalAmount),
        activeEmployees: num(metrics.activeEmployees),
        activeTrips: num(metrics.activeTrips),
        activeVehicles: num(metrics.activeVehicles),
      },
    }
  })

  return {
    items,
    appliedFilters: (root.appliedFilters as Record<string, unknown>) ?? undefined,
    generatedAt: typeof root.generatedAt === 'string' ? root.generatedAt : undefined,
  }
}

function countBySubscription(items: AdminOverviewCompanyItem[], status: string): number {
  const target = normalizeStatus(status)
  return items.filter((item) => normalizeStatus(item.subscriptionStatus) === target).length
}

export function overviewToSummary(
  overview: AdminOverviewResponse,
  generatedAt?: string,
): DashboardSummaryResponse {
  const { items } = overview
  const stamp = generatedAt ?? overview.generatedAt ?? new Date().toISOString()

  const recentCompanies: RecentCompanyItem[] = [...items]
    .sort((a, b) => b.metrics.totalTransactionAmount - a.metrics.totalTransactionAmount)
    .slice(0, 8)
    .map((item) => ({
      companyId: item.companyId,
      name: item.name,
      status: item.subscriptionStatus || item.status,
      registeredAt: stamp,
    }))

  return {
    total: items.length,
    active: countBySubscription(items, 'ACTIVE'),
    trial: countBySubscription(items, 'TRIAL'),
    gracePeriod: countBySubscription(items, 'GRACE_PERIOD'),
    expired: countBySubscription(items, 'EXPIRED'),
    suspended: countBySubscription(items, 'SUSPENDED'),
    newCompaniesToday: 0,
    newCompaniesThisMonth: 0,
    totalTransactionAmount: items.reduce((sum, item) => sum + item.metrics.totalTransactionAmount, 0),
    activeEmployees: items.reduce((sum, item) => sum + item.metrics.activeEmployees, 0),
    activeVehicles: items.reduce((sum, item) => sum + item.metrics.activeVehicles, 0),
    totalTransactions: items.reduce(
      (sum, item) =>
        sum +
        item.metrics.totalInboundTransactions +
        item.metrics.totalOutboundTransactions,
      0,
    ),
    recentCompanies,
  }
}

export function overviewToPlatformStatistics(
  overview: AdminOverviewResponse,
): PlatformStatisticsResponse {
  const { items } = overview
  let inbound = 0
  let outbound = 0
  let expenses = 0
  let activeEmployees = 0
  let activeTrips = 0
  let activeVehicles = 0

  for (const item of items) {
    inbound += item.metrics.totalInboundTransactions
    outbound += item.metrics.totalOutboundTransactions
    expenses += item.metrics.totalExpenses
    activeEmployees += item.metrics.activeEmployees
    activeTrips += item.metrics.activeTrips
    activeVehicles += item.metrics.activeVehicles
  }

  const totalTx = inbound + outbound

  return {
    users: {
      totalUsers: activeEmployees,
      owners: 0,
      managers: 0,
      employees: activeEmployees,
      activeUsers: activeEmployees,
      inactiveUsers: 0,
      lockedUsers: 0,
      newUsersThisMonth: 0,
    },
    operations: {
      transactions: {
        total: totalTx,
        today: 0,
        week: 0,
        month: totalTx,
        inbound,
        outbound,
      },
      trips: {
        total: activeTrips,
        completed: 0,
        active: activeTrips,
        cancelled: 0,
      },
      totalExpenses: expenses,
      totalBranches: 0,
      totalWarehouses: 0,
      totalVehicles: activeVehicles,
    },
  }
}

export function overviewToSubscriptionAnalytics(
  overview: AdminOverviewResponse,
): SubscriptionOverview {
  const { items } = overview
  const statuses = ['TRIAL', 'ACTIVE', 'GRACE_PERIOD', 'EXPIRED', 'SUSPENDED'] as const
  const distribution = statuses.map((status) => ({
    status,
    count: countBySubscription(items, status),
  }))

  const statusBreakdown = Object.fromEntries(
    distribution.map((row) => [row.status, row.count]),
  )

  return {
    distribution,
    statusBreakdown,
    averageDurationDays: 0,
    expiringSoon: [],
    recentlyExpired: items
      .filter((item) => normalizeStatus(item.subscriptionStatus) === 'EXPIRED')
      .map((item) => ({
        companyId: item.companyId,
        companyName: item.name,
        subscriptionId: item.companyId,
        date: overview.generatedAt ?? new Date().toISOString(),
      })),
    recentlyRenewed: [],
  }
}

export function overviewToRankings(
  overview: AdminOverviewResponse,
  limit = 5,
): CompanyRankingSet {
  const { items } = overview

  const byVolume = [...items]
    .sort((a, b) => b.metrics.totalTransactionAmount - a.metrics.totalTransactionAmount)
    .slice(0, limit)
    .map((item) => ({
      companyId: item.companyId,
      name: item.name,
      value: item.metrics.totalTransactionAmount,
    }))

  const byEmployees = [...items]
    .sort((a, b) => b.metrics.activeEmployees - a.metrics.activeEmployees)
    .slice(0, limit)
    .map((item) => ({
      companyId: item.companyId,
      name: item.name,
      value: item.metrics.activeEmployees,
    }))

  const byActivity = [...items]
    .map((item) => ({
      companyId: item.companyId,
      name: item.name,
      value:
        item.metrics.totalInboundTransactions +
        item.metrics.totalOutboundTransactions +
        item.metrics.activeTrips,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)

  const leastActive = [...byActivity].reverse().slice(0, limit)

  return {
    mostActive: byActivity,
    leastActive,
    newest: byVolume,
    mostUsers: byEmployees,
    highestTransactionVolume: byVolume,
  }
}

export function overviewToAttention(
  overview: AdminOverviewResponse,
  limit = 10,
): AttentionCompaniesResponse {
  const items = overview.items
    .map((item) => {
      const reasons: AttentionReason[] = []
      const sub = normalizeStatus(item.subscriptionStatus)
      if (sub === 'EXPIRED') reasons.push('expired_subscription')
      if (sub === 'SUSPENDED') reasons.push('suspended_subscription')
      if (sub === 'GRACE_PERIOD') reasons.push('grace_ending_soon')
      if (
        item.metrics.totalInboundTransactions + item.metrics.totalOutboundTransactions === 0 &&
        item.metrics.activeTrips === 0
      ) {
        reasons.push('no_recent_activity')
      }
      return { companyId: item.companyId, name: item.name, reasons }
    })
    .filter((item) => item.reasons.length > 0)
    .slice(0, limit)

  return { items }
}
