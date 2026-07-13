import { z } from 'zod'

export const exportSchema = z.object({
  dataset: z.enum(['companies', 'users', 'subscriptions', 'reports', 'activity']),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type ExportFormValues = z.infer<typeof exportSchema>
