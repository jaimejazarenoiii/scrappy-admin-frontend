import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '@/features/dashboard/api/dashboard-api'
import { useAppliedDashboardFilters } from '@/features/dashboard/hooks/use-applied-dashboard-filters'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'

const STALE_TIME = 60_000

export function useDashboardSummary() {
  const filters = useAppliedDashboardFilters()

  return useQuery({
    queryKey: dashboardQueryKeys.summary(filters),
    queryFn: () => fetchDashboardSummary(filters),
    staleTime: STALE_TIME,
  })
}
