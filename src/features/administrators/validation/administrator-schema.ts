import { z } from 'zod'

export const administratorSchema = z.object({
  email: z.string().email('Enter a valid email'),
  name: z.string().min(1, 'Name is required'),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
  status: z.enum(['active', 'inactive', 'locked']).optional(),
})

export type AdministratorFormValues = z.infer<typeof administratorSchema>
