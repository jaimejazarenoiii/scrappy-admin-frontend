import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createCompanyAccount } from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { showError, showSuccess } from '@/shared/ui/toast'
import { env } from '@/shared/config/env'

const accountSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    weeklySalary: z.number().min(0),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.enum(['OWNER', 'MANAGER', 'EMPLOYEE']),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

type AccountFormValues = z.infer<typeof accountSchema>

interface CompanyAccountsPanelProps {
  companyId: string
}

export function CompanyAccountsPanel({ companyId }: CompanyAccountsPanelProps) {
  const queryClient = useQueryClient()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      weeklySalary: 0,
      email: '',
      password: '',
      confirmPassword: '',
      role: 'OWNER',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: AccountFormValues) =>
      createCompanyAccount(companyId, {
        firstName: values.firstName,
        lastName: values.lastName,
        weeklySalary: values.weeklySalary,
        account: {
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.role,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) })
      showSuccess('Account created (Employee + User)')
      form.reset({ ...form.getValues(), email: '', password: '', confirmPassword: '' })
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Create failed'),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company accounts</CardTitle>
        <p className="text-sm text-[var(--muted)]">
          Create Employee + User via{' '}
          <code className="text-xs">POST /admin/companies/{'{id}'}/accounts</code>
          {!env.useMock ? null : ' (mock enabled)'}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Login email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      {...field}
                    >
                      <option value="OWNER">OWNER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="EMPLOYEE">EMPLOYEE</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="sm:col-span-2" disabled={mutation.isPending}>
              Create account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
