import { useQuery } from '@tanstack/react-query'
import { getAdministrator, listAdministrators } from '@/features/administrators/api/administrators-api'
import type { ListQueryParams } from '@/shared/types/api'

export function useAdministrators(params: ListQueryParams) {
  return useQuery({
    queryKey: ['administrators', params],
    queryFn: () => listAdministrators(params),
  })
}

export function useAdministrator(id: string) {
  return useQuery({
    queryKey: ['administrators', id],
    queryFn: () => getAdministrator(id),
    enabled: Boolean(id),
  })
}
