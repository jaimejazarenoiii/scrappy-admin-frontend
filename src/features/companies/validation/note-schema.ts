import { z } from 'zod'

export const noteSchema = z.object({
  body: z.string().min(1, 'Note cannot be empty').max(2000, 'Note is too long'),
})

export type NoteFormValues = z.infer<typeof noteSchema>
