import { z } from 'zod'

/** Matches live `POST /admin/companies` body (admin create company only). */
export const companySchema = z.object({
  name: z.string().trim().min(2, 'Company name must be at least 2 characters').max(120),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  contactNumber: z.string().trim().max(40).optional().or(z.literal('')),
  address: z.string().trim().max(500).optional().or(z.literal('')),
})

export type CompanyFormValues = z.infer<typeof companySchema>
