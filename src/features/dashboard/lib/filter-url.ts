import type { DashboardFilterSet, Granularity } from '@/features/dashboard/types'

const DEFAULT_EXPIRING_WITHIN_DAYS = 14
const DEFAULT_RANGE_DAYS = 30

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function daysBetween(from: string, to: string): number {
  const start = new Date(from)
  const end = new Date(to)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function resolveGranularity(from: string | null, to: string | null): Granularity {
  if (from && to && daysBetween(from, to) > 31) return 'week'
  return 'day'
}

export function getDefaultDashboardFilters(): DashboardFilterSet {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - DEFAULT_RANGE_DAYS)
  const fromStr = formatDate(from)
  const toStr = formatDate(to)

  return {
    from: fromStr,
    to: toStr,
    subscriptionStatus: null,
    companyStatus: null,
    companyId: null,
    granularity: resolveGranularity(fromStr, toStr),
    expiringWithinDays: DEFAULT_EXPIRING_WITHIN_DAYS,
  }
}

export function parseFiltersFromSearchParams(params: URLSearchParams): DashboardFilterSet {
  const defaults = getDefaultDashboardFilters()

  const from = params.get('from') ?? defaults.from
  const to = params.get('to') ?? defaults.to
  const granularityParam = params.get('granularity') as Granularity | null

  return {
    from,
    to,
    subscriptionStatus: params.get('subscriptionStatus') || null,
    companyStatus: params.get('companyStatus') || null,
    companyId: params.get('companyId') || null,
    granularity: granularityParam ?? resolveGranularity(from, to),
    expiringWithinDays: Number(params.get('expiringWithinDays') ?? defaults.expiringWithinDays),
  }
}

export function serializeFiltersToSearchParams(filters: DashboardFilterSet): URLSearchParams {
  const params = new URLSearchParams()
  const defaults = getDefaultDashboardFilters()

  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.subscriptionStatus) params.set('subscriptionStatus', filters.subscriptionStatus)
  if (filters.companyStatus) params.set('companyStatus', filters.companyStatus)
  if (filters.companyId) params.set('companyId', filters.companyId)
  if (filters.granularity !== defaults.granularity || params.has('from') || params.has('to')) {
    params.set('granularity', filters.granularity)
  }
  if (filters.expiringWithinDays !== defaults.expiringWithinDays) {
    params.set('expiringWithinDays', String(filters.expiringWithinDays))
  }

  return params
}

export function filtersToApiParams(
  filters: DashboardFilterSet,
  extra?: Record<string, string | number | undefined>,
): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  if (filters.subscriptionStatus) params.subscriptionStatus = filters.subscriptionStatus
  if (filters.companyStatus) params.companyStatus = filters.companyStatus
  if (filters.companyId) params.companyId = filters.companyId
  if (filters.granularity) params.granularity = filters.granularity
  if (filters.expiringWithinDays) params.expiringWithinDays = filters.expiringWithinDays

  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value !== undefined) params[key] = value
    }
  }

  return params
}
