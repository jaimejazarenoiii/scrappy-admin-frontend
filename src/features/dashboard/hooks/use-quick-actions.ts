import { useQuery } from '@tanstack/react-query'
import { fetchQuickActions } from '@/features/dashboard/api/dashboard-api'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'
import type { QuickAction } from '@/features/dashboard/types'

const FALLBACK_QUICK_ACTIONS: QuickAction[] = [
  { key: 'create_company', label: 'Create company', destination: 'companies', iconKey: 'building' },
  { key: 'view_companies', label: 'View companies', destination: 'companies', iconKey: 'building' },
  {
    key: 'manage_subscriptions',
    label: 'Manage subscriptions',
    destination: 'subscriptions',
    iconKey: 'credit-card',
  },
  {
    key: 'manage_administrators',
    label: 'Manage administrators',
    destination: 'administrators',
    iconKey: 'users',
  },
  { key: 'view_reports', label: 'View reports', destination: 'reports', iconKey: 'file-text' },
  {
    key: 'view_activity_logs',
    label: 'View activity logs',
    destination: 'activity',
    iconKey: 'activity',
  },
]

const STALE_TIME = 300_000

export function useQuickActions() {
  return useQuery({
    queryKey: dashboardQueryKeys.quickActions(),
    queryFn: async () => {
      const response = await fetchQuickActions()
      return response.items.length > 0 ? response.items : FALLBACK_QUICK_ACTIONS
    },
    staleTime: STALE_TIME,
  })
}
