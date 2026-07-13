import { useQuery } from '@tanstack/react-query'
import { getCompany, listCompanies } from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import { useListUrlQuery } from '@/shared/lib/list-url'
import type { ListQueryParams } from '@/shared/types/api'

export function useCompanies(params: ListQueryParams) {
  return useQuery({
    queryKey: companyQueryKeys.list(params),
    queryFn: () => listCompanies(params),
  })
}

export function useCompaniesList() {
  const { query, setQuery } = useListUrlQuery()
  return { ...useCompanies(query), query, setQuery }
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: companyQueryKeys.detail(id),
    queryFn: () => getCompany(id),
    enabled: Boolean(id),
  })
}

export function useCompanyDetail(id: string) {
  return useCompany(id)
}
