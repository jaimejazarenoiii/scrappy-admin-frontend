import { useQuery } from '@tanstack/react-query'
import { fetchAttentionCompanies } from '@/features/dashboard/api/dashboard-api'
import { useAppliedDashboardFilters } from '@/features/dashboard/hooks/use-applied-dashboard-filters'
import { dashboardQueryKeys } from '@/features/dashboard/lib/query-keys'

const STALE_TIME = 45_000

export function useAttentionCompanies() {
  const filters = useAppliedDashboardFilters()

  return useQuery({
    queryKey: dashboardQueryKeys.attentionCompanies(filters),
    queryFn: () => fetchAttentionCompanies(filters),
    staleTime: STALE_TIME,
  })
}
