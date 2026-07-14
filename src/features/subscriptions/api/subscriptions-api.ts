import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { listCompanies } from '@/features/companies/api/companies-api'
import type { Subscription } from '@/features/subscriptions/types'
import { mockHandlers } from '@/shared/mocks/handlers'
import type { ListQueryParams, PaginatedResponse } from '@/shared/types/api'

export interface SubscriptionStatusPayload {
  subscriptionStatus: string
  companyId?: string
  currentPeriod?: Subscription | null
}

function asSubscriptionArray(
  data: PaginatedResponse<Subscription> | Subscription[],
): Subscription[] {
  return Array.isArray(data) ? data : data.items
}

function normalizeSubscription(
  row: Partial<Subscription> & {
    id: string
    companyId: string
    planName?: string
    notes?: string | null
  },
): Subscription {
  const planName = row.planName ?? row.planCode ?? ''
  const isStatusOnly = Boolean(row.isStatusOnly) || String(row.id).startsWith('status-')
  return {
    id: row.id,
    companyId: row.companyId,
    companyName: row.companyName ?? 'Company',
    planName,
    planCode: row.planCode ?? planName,
    status: row.status ?? 'PENDING',
    startsAt: row.startsAt ?? '',
    endsAt: row.endsAt ?? '',
    renewedAt: row.renewedAt ?? null,
    suspendedAt: row.suspendedAt ?? null,
    notes: row.notes ?? null,
    companyStatus: row.companyStatus ?? null,
    isStatusOnly,
  }
}

function paginateLocal(
  items: Subscription[],
  params?: ListQueryParams,
): PaginatedResponse<Subscription> {
  const page = params?.page ?? 1
  const pageSize = params?.pageSize ?? 20
  const q = params?.q?.trim().toLowerCase()
  let filtered = items
  if (q) {
    filtered = items.filter((item) => {
      const haystack = [item.companyName, item.planName, item.planCode, item.status, item.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }

  const sortKey = params?.sort
  if (sortKey) {
    const dir = params?.order === 'desc' ? -1 : 1
    filtered = [...filtered].sort((a, b) => {
      const left = String(a[sortKey as keyof Subscription] ?? '')
      const right = String(b[sortKey as keyof Subscription] ?? '')
      return left.localeCompare(right) * dir
    })
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  return {
    items: filtered.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

/**
 * Live API has no flat `/admin/subscriptions` index.
 * Aggregate real periods from every company: GET …/companies/{id}/subscriptions
 */
export async function listSubscriptions(
  params?: ListQueryParams,
): Promise<PaginatedResponse<Subscription>> {
  if (env.useMock) {
    const page = await callMock(() => mockHandlers.listSubscriptions(params))
    return {
      ...page,
      items: page.items.map((item) =>
        normalizeSubscription({ ...item, planName: item.planName ?? item.planCode }),
      ),
    }
  }

  const companies = await listCompanies({
    page: 1,
    pageSize: 100,
    q: undefined,
  })

  const allPeriods = (
    await Promise.all(
      companies.items.map(async (company) => {
        try {
          const periods = asSubscriptionArray(
            await listCompanySubscriptions(company.id, { page: 1, pageSize: 100 }),
          )
          return periods.map((period) =>
            normalizeSubscription({
              ...period,
              companyId: company.id,
              companyName: company.name,
            }),
          )
        } catch {
          return [] as Subscription[]
        }
      }),
    )
  )
    .flat()
    .filter((period) => !period.isStatusOnly && Boolean(period.id))

  allPeriods.sort((a, b) => String(b.endsAt).localeCompare(String(a.endsAt)))

  return paginateLocal(allPeriods, params)
}

export async function listCompanySubscriptions(
  companyId: string,
  params?: ListQueryParams,
): Promise<PaginatedResponse<Subscription> | Subscription[]> {
  if (env.useMock) {
    const rows = await callMock(() => mockHandlers.listCompanySubscriptions(companyId))
    return rows.map((item) =>
      normalizeSubscription({ ...item, planName: item.planName ?? item.planCode }),
    )
  }
  const { data } = await apiClient.get<PaginatedResponse<Subscription> | Subscription[]>(
    `/admin/companies/${companyId}/subscriptions`,
    {
      params: {
        page: params?.page,
        limit: params?.pageSize,
      },
    },
  )
  if (Array.isArray(data)) {
    return data.map((item) =>
      normalizeSubscription({ ...item, companyId: item.companyId ?? companyId }),
    )
  }
  return {
    ...data,
    items: data.items.map((item) =>
      normalizeSubscription({ ...item, companyId: item.companyId ?? companyId }),
    ),
  }
}

export async function getSubscriptionStatus(companyId: string): Promise<SubscriptionStatusPayload> {
  if (env.useMock) {
    return callMock(async () => {
      const subs = await mockHandlers.listCompanySubscriptions(companyId)
      const current = subs[0]
      return {
        subscriptionStatus: current?.status ?? 'TRIAL',
        companyId,
        currentPeriod: current
          ? normalizeSubscription({ ...current, planName: current.planName ?? current.planCode })
          : null,
      }
    })
  }
  const { data } = await apiClient.get<SubscriptionStatusPayload>(
    `/admin/companies/${companyId}/subscription-status`,
  )
  return {
    ...data,
    currentPeriod: data.currentPeriod
      ? normalizeSubscription({
          ...data.currentPeriod,
          companyId: data.currentPeriod.companyId ?? companyId,
        })
      : null,
  }
}

export async function getSubscription(id: string, companyId?: string): Promise<Subscription> {
  if (env.useMock) {
    const sub = await callMock(() => mockHandlers.getSubscription(id))
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  if (!companyId) {
    throw new Error('companyId is required to load a subscription period')
  }
  if (id.startsWith('status-')) {
    const status = await getSubscriptionStatus(companyId)
    return normalizeSubscription({
      id,
      companyId,
      companyName: 'Company',
      status: status.subscriptionStatus,
      planName: '',
      startsAt: '',
      endsAt: '',
      isStatusOnly: true,
    })
  }
  const { data } = await apiClient.get<Subscription>(
    `/admin/companies/${companyId}/subscriptions/${id}`,
  )
  return normalizeSubscription({ ...data, companyId: data.companyId ?? companyId })
}

export async function createSubscription(payload: {
  companyId: string
  planName: string
  status: string
  startsAt: string
  endsAt: string
  notes?: string
}): Promise<Subscription> {
  if (env.useMock) {
    const sub = await callMock(() =>
      mockHandlers.createSubscription({
        companyId: payload.companyId,
        planCode: payload.planName,
        planName: payload.planName,
        status: payload.status,
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
      }),
    )
    return normalizeSubscription({
      ...sub,
      planName: sub.planName ?? sub.planCode,
      notes: payload.notes ?? null,
    })
  }
  const { data } = await apiClient.post<Subscription>(
    `/admin/companies/${payload.companyId}/subscriptions`,
    {
      planName: payload.planName,
      status: payload.status,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      ...(payload.notes ? { notes: payload.notes } : {}),
    },
  )
  return normalizeSubscription({
    ...data,
    companyId: payload.companyId,
    id: data.id,
  })
}

export async function updateSubscription(
  companyId: string,
  subscriptionId: string,
  payload: {
    planName?: string
    startsAt?: string
    endsAt?: string
    status?: string
    notes?: string | null
    companyStatus?: string
  },
): Promise<Subscription> {
  if (env.useMock) {
    const sub = await callMock(() => mockHandlers.getSubscription(subscriptionId))
    if (payload.planName) {
      sub.planName = payload.planName
      sub.planCode = payload.planName
    }
    if (payload.startsAt) sub.startsAt = payload.startsAt
    if (payload.endsAt) sub.endsAt = payload.endsAt
    if (payload.status) sub.status = payload.status
    return normalizeSubscription({
      ...sub,
      planName: sub.planName ?? sub.planCode,
      notes: payload.notes ?? null,
    })
  }
  const { data } = await apiClient.patch<Subscription>(
    `/admin/companies/${companyId}/subscriptions/${subscriptionId}`,
    payload,
  )
  return normalizeSubscription({ ...data, companyId: data.companyId ?? companyId })
}

export async function renewSubscription(
  companyId: string,
  payload: {
    planName: string
    status: string
    startsAt: string
    endsAt: string
    notes?: string
  },
  _id?: string,
): Promise<Subscription> {
  if (env.useMock) {
    const id = _id
    if (!id) throw new Error('subscription id required in mock mode')
    const sub = await callMock(() => mockHandlers.renewSubscription(id))
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  const { data } = await apiClient.post<Subscription>(
    `/admin/companies/${companyId}/subscriptions/renew`,
    {
      planName: payload.planName,
      status: payload.status,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      ...(payload.notes ? { notes: payload.notes } : {}),
    },
  )
  return normalizeSubscription({ ...data, companyId: data.companyId ?? companyId })
}

export async function suspendSubscription(companyId: string, _id?: string): Promise<Subscription> {
  if (env.useMock) {
    const id = _id
    if (!id) throw new Error('subscription id required in mock mode')
    const sub = await callMock(() => mockHandlers.suspendSubscription(id))
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  const { data } = await apiClient.post<Subscription>(
    `/admin/companies/${companyId}/subscriptions/suspend`,
    {},
  )
  return normalizeSubscription({ ...data, companyId: data.companyId ?? companyId })
}

export async function expireSubscription(companyId: string, _id?: string): Promise<Subscription> {
  if (env.useMock) {
    const id = _id
    if (!id) throw new Error('subscription id required in mock mode')
    const sub = await callMock(() => mockHandlers.expireSubscription(id))
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  const { data } = await apiClient.post<Subscription>(
    `/admin/companies/${companyId}/subscriptions/expire`,
    {},
  )
  return normalizeSubscription({ ...data, companyId: data.companyId ?? companyId })
}
