import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { completePasswordReset } from '@/features/auth/api/auth-api'
import { getAuthErrorMessage } from '@/features/auth/lib/auth-errors'
import { PasswordInput } from '@/features/auth/components/password-input'
import { useAuthStore } from '@/features/auth/store/auth-store'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/validation/reset-password-schema'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { showError, showSuccess } from '@/shared/ui/toast'

interface ResetPasswordFormProps {
  resetProof: string
  onSuccess: () => void
}

export function ResetPasswordForm({ resetProof, onSuccess }: ResetPasswordFormProps) {
  const clearSession = useAuthStore((state) => state.clearSession)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { resetProof, newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await completePasswordReset({
        resetProof: values.resetProof,
        newPassword: values.newPassword,
      })
      clearSession()
      showSuccess('Password updated. Please sign in with your new password.')
      onSuccess()
    } catch (error) {
      showError(getAuthErrorMessage(error, 'Unable to reset password'))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" {...form.register('resetProof')} />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" placeholder="••••••••" {...field} />
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
          {form.formState.isSubmitting ? 'Updating…' : 'Update password'}
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
