import { useQuery } from '@tanstack/react-query'
import {
  getCompany,
  getCompanyNotes,
  getCompanyStatistics,
  getCompanyTimeline,
} from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'

export function useCompany(id: string) {
  return useQuery({
    queryKey: companyQueryKeys.detail(id),
    queryFn: () => getCompany(id),
    enabled: Boolean(id),
  })
}

export function useCompanyStatistics(id: string) {
  return useQuery({
    queryKey: companyQueryKeys.statistics(id),
    queryFn: () => getCompanyStatistics(id),
    enabled: Boolean(id),
  })
}

export function useCompanyTimeline(id: string) {
  return useQuery({
    queryKey: companyQueryKeys.timeline(id),
    queryFn: () => getCompanyTimeline(id),
    enabled: Boolean(id),
  })
}

export function useCompanyNotes(id: string) {
  return useQuery({
    queryKey: companyQueryKeys.notes(id),
    queryFn: () => getCompanyNotes(id),
    enabled: Boolean(id),
  })
}
