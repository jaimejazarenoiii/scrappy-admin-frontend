import { useQuery } from '@tanstack/react-query'
import { fetchRecentActivities } from '@/features/dashboard/api/dashboard-api'
import { useAppliedDashboardFilters } from '@/features/dashboard/hooks/use-applied-dashboard-filters'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'

const STALE_TIME = 30_000

export function useRecentActivities() {
  const filters = useAppliedDashboardFilters()

  return useQuery({
    queryKey: dashboardQueryKeys.recentActivities(filters),
    queryFn: () => fetchRecentActivities(filters),
    staleTime: STALE_TIME,
  })
}
