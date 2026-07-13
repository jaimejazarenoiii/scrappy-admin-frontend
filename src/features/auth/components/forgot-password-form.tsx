import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '@/features/auth/api/auth-api'
import { getAuthErrorMessage } from '@/features/auth/lib/auth-errors'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/validation/forgot-password-schema'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { showError } from '@/shared/ui/toast'

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await requestPasswordReset(values)
      setSubmitted(true)
    } catch (error) {
      showError(getAuthErrorMessage(error, 'Unable to process request'))
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-[var(--foreground)]">
          If an account exists for that email, you will receive reset instructions shortly.
        </p>
        <Link to="/login" className="text-sm font-medium text-[var(--primary)] hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="h-11 rounded-xl"
                  placeholder="you@scrappy.io"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-[15px] font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
        <p className="text-center text-sm text-[var(--muted)]">
          <Link to="/login" className="font-medium text-[var(--primary)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </Form>
  )
}
