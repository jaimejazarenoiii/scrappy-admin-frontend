import { useQuery } from '@tanstack/react-query'
import { fetchPlatformStatistics } from '@/features/dashboard/api/dashboard-api'
import { useAppliedDashboardFilters } from '@/features/dashboard/hooks/use-applied-dashboard-filters'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'

const STALE_TIME = 60_000

export function usePlatformStatistics() {
  const filters = useAppliedDashboardFilters()

  return useQuery({
    queryKey: dashboardQueryKeys.statistics(filters),
    queryFn: () => fetchPlatformStatistics(filters),
    staleTime: STALE_TIME,
  })
}
