import { z } from 'zod'

const subscriptionStatuses = ['active', 'suspended', 'expired', 'pending', 'trial'] as const
const companyStatuses = [
  'active',
  'trial',
  'grace_period',
  'expired',
  'suspended',
  'registered',
  'inactive',
  'deactivated',
] as const
const granularities = ['day', 'week', 'month'] as const

export const dashboardFilterSchema = z
  .object({
    from: z.string().nullable(),
    to: z.string().nullable(),
    subscriptionStatus: z.enum(subscriptionStatuses).nullable().or(z.literal('')),
    companyStatus: z.enum(companyStatuses).nullable().or(z.literal('')),
    companyId: z
      .string()
      .nullable()
      .refine((value) => !value || /^[a-zA-Z0-9_-]+$/.test(value), {
        message: 'Company ID must be alphanumeric',
      }),
    granularity: z.enum(granularities),
    expiringWithinDays: z.number().int().positive().max(365),
  })
  .superRefine((data, ctx) => {
    if (data.from && data.to) {
      const fromDate = new Date(data.from)
      const toDate = new Date(data.to)
      if (fromDate > toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date must be on or before end date',
          path: ['to'],
        })
      }
    }
  })

export type DashboardFilterInput = z.infer<typeof dashboardFilterSchema>

export function validateDashboardFilters(filters: unknown) {
  return dashboardFilterSchema.safeParse(filters)
}
