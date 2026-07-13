export type Granularity = 'day' | 'week' | 'month'

export type SubscriptionStatusFilter =
  | 'active'
  | 'suspended'
  | 'expired'
  | 'pending'
  | 'trial'
  | null

export type CompanyStatusFilter =
  | 'active'
  | 'trial'
  | 'grace_period'
  | 'expired'
  | 'suspended'
  | 'registered'
  | 'inactive'
  | 'deactivated'
  | null

export interface DashboardFilterSet {
  from: string | null
  to: string | null
  subscriptionStatus: string | null
  companyStatus: string | null
  companyId: string | null
  granularity: Granularity
  expiringWithinDays: number
}

export interface PlatformOverviewMetrics {
  total: number
  active: number
  trial: number
  gracePeriod: number
  expired: number
  suspended: number
  newCompaniesToday: number
  newCompaniesThisMonth: number
}

export interface DashboardSummaryResponse extends PlatformOverviewMetrics {
  recentCompanies?: RecentCompanyItem[]
}

export interface UserStatistics {
  totalUsers: number
  owners: number
  managers: number
  employees: number
  activeUsers: number
  inactiveUsers: number
  lockedUsers: number
  newUsersThisMonth: number
}

export interface OperationalStatistics {
  transactions: {
    total: number
    today: number
    week: number
    month: number
    inbound: number
    outbound: number
  }
  trips: {
    total: number
    completed: number
    active: number
    cancelled: number
  }
  totalExpenses: number
  totalBranches: number
  totalWarehouses: number
  totalVehicles: number
}

export interface PlatformStatisticsResponse {
  users: UserStatistics
  operations: OperationalStatistics
}

export interface GrowthSeriesPoint {
  period: string
  value: number
}

export type GrowthMetricFamily =
  | 'companies'
  | 'users'
  | 'transactions'
  | 'trips'
  | 'expenses'
  | 'subscriptions'

export type GrowthSeriesBundle = Record<GrowthMetricFamily, GrowthSeriesPoint[]>

export interface SubscriptionDistributionItem {
  status: string
  count: number
}

export interface SubscriptionCompanyRef {
  companyId: string
  companyName: string
  subscriptionId: string
  date: string
}

export interface SubscriptionOverview {
  distribution: SubscriptionDistributionItem[]
  statusBreakdown: Record<string, number>
  averageDurationDays: number
  expiringSoon: SubscriptionCompanyRef[]
  recentlyExpired: SubscriptionCompanyRef[]
  recentlyRenewed: SubscriptionCompanyRef[]
}

export interface CompanyRankItem {
  companyId: string
  name: string
  value: number
  meta?: Record<string, string | number>
}

export interface CompanyRankingSet {
  mostActive: CompanyRankItem[]
  leastActive: CompanyRankItem[]
  newest: CompanyRankItem[]
  mostUsers: CompanyRankItem[]
  highestTransactionVolume: CompanyRankItem[]
}

export interface RecentActivityItem {
  id: string
  type: string
  title: string
  timestamp: string
  actorLabel?: string
  targetType?: string
  targetId?: string
  href?: string
}

export interface RecentActivitiesResponse {
  items: RecentActivityItem[]
  total?: number
}

export type AttentionReason =
  | 'expired_subscription'
  | 'suspended_subscription'
  | 'grace_ending_soon'
  | 'no_recent_activity'
  | 'locked_owner'

export interface AttentionCompany {
  companyId: string
  name: string
  reasons: AttentionReason[]
}

export interface AttentionCompaniesResponse {
  items: AttentionCompany[]
}

export interface QuickAction {
  key: string
  label: string
  destination: string
  iconKey?: string
}

export interface QuickActionsResponse {
  items: QuickAction[]
}

export interface RecentCompanyItem {
  companyId: string
  name: string
  status: string
  registeredAt: string
}
