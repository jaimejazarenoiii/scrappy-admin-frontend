import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseFiltersFromSearchParams } from '@/features/dashboard/lib/filter-url'
import { useDashboardFilterStore } from '@/features/dashboard/store/filter-store'
import type { DashboardFilterSet } from '@/features/dashboard/types'

export function useAppliedDashboardFilters(): DashboardFilterSet {
  const [searchParams] = useSearchParams()
  const applyFromUrl = useDashboardFilterStore((state) => state.applyFromUrl)

  useEffect(() => {
    applyFromUrl(searchParams)
  }, [searchParams, applyFromUrl])

  return parseFiltersFromSearchParams(searchParams)
}
