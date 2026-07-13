import { useQuery } from '@tanstack/react-query'
import { fetchGrowthAnalytics } from '@/features/dashboard/api/dashboard-api'
import { useAppliedDashboardFilters } from '@/features/dashboard/hooks/use-applied-dashboard-filters'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'

const STALE_TIME = 90_000

export function useGrowthAnalytics() {
  const filters = useAppliedDashboardFilters()

  return useQuery({
    queryKey: dashboardQueryKeys.growth(filters),
    queryFn: () => fetchGrowthAnalytics(filters),
    staleTime: STALE_TIME,
  })
}
