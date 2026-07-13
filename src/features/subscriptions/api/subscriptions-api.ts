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
  row: Partial<Subscription> & { id: string; companyId: string; planName?: string },
): Subscription {
  const planName = row.planName ?? row.planCode ?? '—'
  return {
    id: row.id,
    companyId: row.companyId,
    companyName: row.companyName ?? 'Company',
    planName,
    planCode: row.planCode ?? planName,
    status: row.status ?? 'TRIAL',
    startsAt: row.startsAt ?? new Date(0).toISOString(),
    endsAt: row.endsAt ?? new Date(0).toISOString(),
    renewedAt: row.renewedAt ?? null,
    suspendedAt: row.suspendedAt ?? null,
  }
}

/**
 * Live API has no flat `/admin/subscriptions` index.
 * Build a portfolio view from companies + per-company subscription status/periods.
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
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 20,
    q: params?.q,
    sort: params?.sort,
    order: params?.order,
  })

  const items = (
    await Promise.all(
      companies.items.map(async (company) => {
        try {
          const periods = asSubscriptionArray(await listCompanySubscriptions(company.id, { page: 1, pageSize: 1 }))
          const latest = periods[0]
          if (latest) {
            return normalizeSubscription({
              ...latest,
              companyId: company.id,
              companyName: company.name,
            })
          }
        } catch {
          // fall through to status-only row
        }

        try {
          const status = await getSubscriptionStatus(company.id)
          if (status.currentPeriod) {
            return normalizeSubscription({
              ...status.currentPeriod,
              companyId: company.id,
              companyName: company.name,
              status: status.currentPeriod.status ?? status.subscriptionStatus,
            })
          }
          return normalizeSubscription({
            id: `status-${company.id}`,
            companyId: company.id,
            companyName: company.name,
            status: status.subscriptionStatus,
            startsAt: company.createdAt ?? company.registeredAt,
            endsAt: company.createdAt ?? company.registeredAt,
          })
        } catch {
          return normalizeSubscription({
            id: `status-${company.id}`,
            companyId: company.id,
            companyName: company.name,
            status: company.subscriptionStatus ?? 'TRIAL',
            startsAt: company.createdAt ?? company.registeredAt,
            endsAt: company.createdAt ?? company.registeredAt,
          })
        }
      }),
    )
  ).filter(Boolean)

  return {
    items,
    page: companies.page,
    pageSize: companies.pageSize,
    total: companies.total,
    totalPages: companies.totalPages,
  }
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
    return data.map((item) => normalizeSubscription({ ...item, companyId: item.companyId ?? companyId }))
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
      const current = Array.isArray(subs) ? subs[0] : undefined
      return {
        companyId,
        subscriptionStatus: current?.status?.toUpperCase?.() ?? 'TRIAL',
        currentPeriod: current
          ? normalizeSubscription({ ...current, planName: current.planName ?? current.planCode })
          : null,
      }
    })
  }
  const { data } = await apiClient.get<SubscriptionStatusPayload>(
    `/admin/companies/${companyId}/subscription-status`,
  )
  return data
}

export async function getSubscription(id: string, companyId?: string): Promise<Subscription> {
  if (env.useMock) {
    const sub = await callMock(() => mockHandlers.getSubscription(id))
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  if (!companyId) {
    throw new Error('companyId is required to load a subscription from the live admin API')
  }
  if (id.startsWith('status-')) {
    const status = await getSubscriptionStatus(companyId)
    return normalizeSubscription({
      id,
      companyId,
      companyName: status.currentPeriod?.companyName ?? 'Company',
      status: status.subscriptionStatus,
      planName: status.currentPeriod?.planName,
      planCode: status.currentPeriod?.planCode,
      startsAt: status.currentPeriod?.startsAt,
      endsAt: status.currentPeriod?.endsAt,
      renewedAt: status.currentPeriod?.renewedAt ?? null,
      suspendedAt: status.currentPeriod?.suspendedAt ?? null,
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
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  const { data } = await apiClient.post<Subscription>(
    `/admin/companies/${payload.companyId}/subscriptions`,
    {
      planName: payload.planName,
      status: payload.status,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
    },
  )
  return normalizeSubscription({
    ...data,
    companyId: payload.companyId,
    id: data.id,
  })
}

export async function renewSubscription(
  companyId: string,
  payload: {
    planName: string
    status?: string
    startsAt: string
    endsAt: string
  },
  _id?: string,
): Promise<Subscription> {
  if (env.useMock) {
    const id = _id
    if (!id) throw new Error('subscription id required in mock mode')
    const sub = await callMock(() => mockHandlers.renewSubscription(id))
    sub.planName = payload.planName
    sub.planCode = payload.planName
    sub.startsAt = payload.startsAt
    sub.endsAt = payload.endsAt
    if (payload.status) sub.status = payload.status
    return normalizeSubscription({ ...sub, planName: sub.planName ?? sub.planCode })
  }
  // Renew creates a new period — same required fields as create (planName + dates).
  const { data } = await apiClient.post<Subscription>(
    `/admin/companies/${companyId}/subscriptions/renew`,
    {
      planName: payload.planName,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      ...(payload.status ? { status: payload.status } : {}),
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
