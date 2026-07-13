import { useQuery } from '@tanstack/react-query'
import { listActivity } from '@/features/activity/api/activity-api'
import type { ListQueryParams } from '@/shared/types/api'

export function useActivity(params: ListQueryParams) {
  return useQuery({
    queryKey: ['activity', params],
    queryFn: () => listActivity(params),
  })
}
