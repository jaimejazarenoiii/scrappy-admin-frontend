import { useQuery } from '@tanstack/react-query'
import { fetchSubscriptionAnalytics } from '@/features/dashboard/api/dashboard-api'
import { useAppliedDashboardFilters } from '@/features/dashboard/hooks/use-applied-dashboard-filters'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'

const STALE_TIME = 60_000

export function useSubscriptionAnalytics() {
  const filters = useAppliedDashboardFilters()

  return useQuery({
    queryKey: dashboardQueryKeys.subscriptions(filters),
    queryFn: () => fetchSubscriptionAnalytics(filters),
    staleTime: STALE_TIME,
  })
}
