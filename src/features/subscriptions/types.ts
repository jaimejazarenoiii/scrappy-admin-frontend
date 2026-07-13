export type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'GRACE_PERIOD'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'active'
  | 'suspended'
  | 'expired'
  | 'pending'
  | string

export const SUBSCRIPTION_STATUS_OPTIONS = [
  'TRIAL',
  'ACTIVE',
  'GRACE_PERIOD',
  'EXPIRED',
  'SUSPENDED',
] as const

export type SubscriptionStatusOption = (typeof SUBSCRIPTION_STATUS_OPTIONS)[number]

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
}

export interface SubscriptionCreateInput {
  companyId: string
  planName: string
  status: SubscriptionStatusOption
  startsAt: string
  endsAt: string
}

export function planLabel(subscription: Pick<Subscription, 'planName' | 'planCode'>): string {
  return subscription.planName || subscription.planCode || '—'
}

export function normalizeSubscriptionStatus(status: string): string {
  return status.toLowerCase()
}
