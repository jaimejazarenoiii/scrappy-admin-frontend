import { z } from 'zod'
import { SUBSCRIPTION_PERIOD_STATUS_OPTIONS } from '@/features/subscriptions/types'

export const subscriptionFormSchema = z
  .object({
    planName: z.string().trim().min(1, 'Plan name is required').max(120),
    status: z.enum(SUBSCRIPTION_PERIOD_STATUS_OPTIONS),
    startsAt: z.string().min(1, 'Start date is required'),
    endsAt: z.string().min(1, 'End date is required'),
  })
  .refine((values) => !Number.isNaN(Date.parse(values.startsAt)), {
    message: 'Enter a valid start date',
    path: ['startsAt'],
  })
  .refine((values) => !Number.isNaN(Date.parse(values.endsAt)), {
    message: 'Enter a valid end date',
    path: ['endsAt'],
  })
  .refine((values) => new Date(values.endsAt) > new Date(values.startsAt), {
    message: 'End date must be after start date',
    path: ['endsAt'],
  })

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>

/** Convert `YYYY-MM-DD` (date input) or datetime-local to ISO-8601 for the API. */
export function toApiDateTime(value: string, endOfDay = false): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const suffix = endOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z'
    return `${value}${suffix}`
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date')
  }
  return parsed.toISOString()
}

export function toDateInputValue(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function defaultSubscriptionFormValues(
  overrides?: Partial<SubscriptionFormValues>,
): SubscriptionFormValues {
  const start = new Date()
  const end = new Date()
  end.setMonth(end.getMonth() + 1)
  return {
    planName: 'Standard',
    status: 'ACTIVE',
    startsAt: start.toISOString().slice(0, 10),
    endsAt: end.toISOString().slice(0, 10),
    ...overrides,
  }
}
