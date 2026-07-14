import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getAuthErrorMessage } from '@/features/auth/lib/auth-errors'
import { PasswordInput } from '@/features/auth/components/password-input'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { loginSchema, type LoginFormValues } from '@/features/auth/validation/login-schema'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { showError } from '@/shared/ui/toast'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password, values.rememberMe)
      onSuccess()
    } catch (error) {
      showError(getAuthErrorMessage(error, 'Sign in failed'))
    }
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
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
                    aria-hidden
                  />
                  <Input
                    className="h-11 rounded-xl pl-10"
                    placeholder="you@scrappy.io"
                    autoComplete="email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
                />
              </FormControl>
              <FormLabel htmlFor="rememberMe" className="cursor-pointer font-normal">
                Remember me on this device
              </FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-[15px] font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Signing in…' : 'Continue'}
        </Button>
      </form>
    </Form>
  )
}
