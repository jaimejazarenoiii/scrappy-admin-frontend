import type { DashboardFilterSet } from '@/features/dashboard/types'

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  summary: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'summary', filters] as const,
  statistics: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'statistics', filters] as const,
  growth: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'growth', filters] as const,
  subscriptions: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'subscriptions', filters] as const,
  rankings: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'rankings', filters] as const,
  recentActivities: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'recent-activities', filters] as const,
  attentionCompanies: (filters: DashboardFilterSet) =>
    [...dashboardQueryKeys.all, 'attention-companies', filters] as const,
  quickActions: () => [...dashboardQueryKeys.all, 'quick-actions'] as const,
}
