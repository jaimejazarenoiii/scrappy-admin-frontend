export type SubscriptionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'TRIAL'
  | 'GRACE_PERIOD'
  | 'EXPIRED'
  | 'SUSPENDED'
  | string

/**
 * Period create/renew body statuses accepted by the live admin API.
 * Operational company entitlement (TRIAL / EXPIRED / …) is separate from period status.
 */
export const SUBSCRIPTION_PERIOD_STATUS_OPTIONS = ['PENDING', 'ACTIVE'] as const

export type SubscriptionPeriodStatus = (typeof SUBSCRIPTION_PERIOD_STATUS_OPTIONS)[number]

/** @deprecated Use SUBSCRIPTION_PERIOD_STATUS_OPTIONS */
export const SUBSCRIPTION_STATUS_OPTIONS = SUBSCRIPTION_PERIOD_STATUS_OPTIONS

export type SubscriptionStatusOption = SubscriptionPeriodStatus

export interface Subscription {
  id: string
  companyId: string
  companyName: string
  /** Display name — prefer `planName` from live API. */
  planName: string
  /** @deprecated Prefer planName; kept for mock compatibility. */
  planCode: string
  status: SubscriptionStatus
  startsAt: string
  endsAt: string
  renewedAt: string | null
  suspendedAt: string | null
  notes?: string | null
  companyStatus?: string | null
  /** True when this row is entitlement-only (no real subscription period id). */
  isStatusOnly?: boolean
}

export interface SubscriptionUpdateInput {
  planName?: string
  startsAt?: string
  endsAt?: string
  status?: SubscriptionPeriodStatus
  notes?: string | null
  companyStatus?: string
}

export interface SubscriptionCreateInput {
  companyId: string
  planName: string
  status: SubscriptionPeriodStatus
  startsAt: string
  endsAt: string
  notes?: string
}

export function planLabel(subscription: Pick<Subscription, 'planName' | 'planCode'>): string {
  return subscription.planName || subscription.planCode || '—'
}

export function normalizeSubscriptionStatus(status: string): string {
  return status.toLowerCase()
}

/**
 * Map current entitlement / prior period into the create/renew status enum.
 * Expired / suspended / grace / pending → PENDING; otherwise ACTIVE.
 */
export function suggestedPeriodStatus(current?: string | null): SubscriptionPeriodStatus {
  const key = (current ?? '').toUpperCase().replace(/-/g, '_')
  if (
    key === 'EXPIRED' ||
    key === 'SUSPENDED' ||
    key === 'GRACE_PERIOD' ||
    key === 'PENDING' ||
    key === 'INACTIVE'
  ) {
    return 'PENDING'
  }
  return 'ACTIVE'
}

export const PERIOD_STATUS_LABELS: Record<SubscriptionPeriodStatus, string> = {
  PENDING: 'Pending — awaiting activation',
  ACTIVE: 'Active — entitlement live',
}
