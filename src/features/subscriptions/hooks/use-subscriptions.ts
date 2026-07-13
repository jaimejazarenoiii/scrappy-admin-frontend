import { useQuery } from '@tanstack/react-query'
import { getSubscription } from '@/features/subscriptions/api/subscriptions-api'
import type { ListQueryParams } from '@/shared/types/api'
import { listSubscriptions } from '@/features/subscriptions/api/subscriptions-api'
import { useSearchParams } from 'react-router-dom'

export function useSubscriptions(params: ListQueryParams) {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => listSubscriptions(params),
  })
}

export function useSubscription(id: string) {
  const [params] = useSearchParams()
  const companyId = params.get('companyId') ?? undefined
  return useQuery({
    queryKey: ['subscriptions', id, companyId],
    queryFn: () => getSubscription(id, companyId),
    enabled: Boolean(id),
  })
}
