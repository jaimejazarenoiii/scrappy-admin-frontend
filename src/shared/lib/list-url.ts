import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ListQueryParams } from '@/shared/types/api'

export type ListUrlParams = ListQueryParams & {
  status?: string
  [key: string]: string | number | undefined
}

/** Read list query params from URLSearchParams. */
export function parseListSearchParams(search: URLSearchParams): ListUrlParams {
  const page = Number(search.get('page') || '1')
  const pageSize = Number(search.get('pageSize') || '20')
  const q = search.get('q') || undefined
  const sort = search.get('sort') || undefined
  const order = search.get('order') === 'asc' ? 'asc' : search.get('order') === 'desc' ? 'desc' : undefined
  const status = search.get('status') || undefined

  const extras: Record<string, string> = {}
  search.forEach((value, key) => {
    if (['page', 'pageSize', 'q', 'sort', 'order', 'status'].includes(key)) return
    extras[key] = value
  })

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20,
    q,
    sort,
    order,
    status,
    ...extras,
  }
}

/** Build URLSearchParams from list params (omit empty). */
export function toListSearchParams(params: ListUrlParams): URLSearchParams {
  const next = new URLSearchParams()
  if (params.page && params.page !== 1) next.set('page', String(params.page))
  if (params.pageSize && params.pageSize !== 20) next.set('pageSize', String(params.pageSize))
  if (params.q) next.set('q', params.q)
  if (params.sort) next.set('sort', params.sort)
  if (params.order) next.set('order', params.order)
  if (params.status) next.set('status', params.status)
  Object.entries(params).forEach(([key, value]) => {
    if (['page', 'pageSize', 'q', 'sort', 'order', 'status'].includes(key)) return
    if (value === undefined || value === '') return
    next.set(key, String(value))
  })
  return next
}

export function listSearchString(params: ListUrlParams): string {
  const s = toListSearchParams(params).toString()
  return s ? `?${s}` : ''
}

/** URL-synced list query for management list pages. */
export function useListUrlQuery(defaults?: Partial<ListUrlParams>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => {
    const parsed = parseListSearchParams(searchParams)
    return { ...parsed, ...defaults } as ListUrlParams
  }, [searchParams]) // defaults are merge-once style; callers should pass stable values

  const setQuery = useCallback(
    (patch: Partial<ListUrlParams>) => {
      const next = { ...query, ...patch }
      setSearchParams(toListSearchParams(next), { replace: true })
    },
    [query, setSearchParams],
  )

  return { query, setQuery, searchParams }
}
