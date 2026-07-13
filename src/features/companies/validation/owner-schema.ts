import { z } from 'zod'

export const ownerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email'),
})

export type OwnerFormValues = z.infer<typeof ownerSchema>
