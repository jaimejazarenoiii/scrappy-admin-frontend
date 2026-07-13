import { useQuery } from '@tanstack/react-query'
import { listLoginHistory } from '@/features/auth/api/auth-api'
import type { LoginHistoryQueryParams } from '@/features/auth/types'

export function useLoginHistory(params: LoginHistoryQueryParams) {
  return useQuery({
    queryKey: ['login-history', params],
    queryFn: () => listLoginHistory(params),
  })
}
