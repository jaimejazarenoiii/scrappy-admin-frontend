import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  createCompanyAccount,
  listCompanyAccounts,
  resetCompanyAccountPassword,
} from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import type { CompanyAccount } from '@/features/companies/types'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Skeleton } from '@/shared/ui/skeleton'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { showError, showSuccess } from '@/shared/ui/toast'

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

const resetSchema = z.object({
  temporaryPassword: z.string().min(8, 'At least 8 characters'),
})

type ResetFormValues = z.infer<typeof resetSchema>

interface CompanyAccountsPanelProps {
  companyId: string
}

function displayName(account: CompanyAccount): string {
  const name = [account.firstName, account.lastName].filter(Boolean).join(' ').trim()
  return name || 'None'
}

function displayDate(value?: string | null): string {
  if (!value) return 'None'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'None'
  return date.toLocaleString()
}

function ResetPasswordForm({
  companyId,
  userId,
  onDone,
}: {
  companyId: string
  userId: string
  onDone: () => void
}) {
  const queryClient = useQueryClient()
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { temporaryPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ResetFormValues) =>
      resetCompanyAccountPassword(companyId, userId, values.temporaryPassword),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.accounts(companyId) })
      showSuccess('Temporary password set — user must change it after sign-in')
      form.reset({ temporaryPassword: '' })
      onDone()
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Reset failed'),
  })

  return (
    <Form {...form}>
      <form
        className="mt-3 flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)]/20 p-3 sm:flex-row sm:items-end"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <FormField
          control={form.control}
          name="temporaryPassword"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Temporary password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="TempPass123!"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Set temporary password'}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function CompanyAccountsPanel({ companyId }: CompanyAccountsPanelProps) {
  const queryClient = useQueryClient()
  const [resetUserId, setResetUserId] = useState<string | null>(null)

  const accountsQuery = useQuery({
    queryKey: companyQueryKeys.accounts(companyId),
    queryFn: () => listCompanyAccounts(companyId),
  })

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

  const createMutation = useMutation({
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
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.accounts(companyId) })
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) })
      showSuccess('Account created')
      form.reset({
        firstName: '',
        lastName: '',
        weeklySalary: 0,
        email: '',
        password: '',
        confirmPassword: '',
        role: 'OWNER',
      })
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Create failed'),
  })

  const accounts = accountsQuery.data ?? []

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <p className="text-sm text-[var(--muted)]">
            Create Employee + User via{' '}
            <code className="text-xs">POST /admin/companies/{'{id}'}/accounts</code>
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
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
                      <Input type="password" autoComplete="new-password" {...field} />
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
                      <Input type="password" autoComplete="new-password" {...field} />
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
                      <Select {...field}>
                        <option value="OWNER">OWNER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="EMPLOYEE">EMPLOYEE</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="sm:col-span-2" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create account'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All accounts</CardTitle>
          <p className="text-sm text-[var(--muted)]">
            From <code className="text-xs">GET /admin/companies/{'{id}'}/accounts</code>. Reset with
            a temporary password — the user signs in and must change it.
          </p>
        </CardHeader>
        <CardContent>
          {accountsQuery.isLoading ? <Skeleton className="h-24 w-full" /> : null}

          {accountsQuery.isError ? (
            <div className="space-y-2">
              <p className="text-sm text-red-700">
                {accountsQuery.error instanceof Error
                  ? accountsQuery.error.message
                  : 'Failed to load accounts'}
              </p>
              <Button type="button" size="sm" variant="outline" onClick={() => void accountsQuery.refetch()}>
                Retry
              </Button>
            </div>
          ) : null}

          {!accountsQuery.isLoading && !accountsQuery.isError && accounts.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">None</p>
          ) : null}

          {!accountsQuery.isLoading && accounts.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {accounts.map((account) => (
                <li key={account.userId} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium">{displayName(account)}</p>
                      <p className="text-sm text-[var(--muted)]">{account.email || 'None'}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--muted)]">
                        <StatusBadge status={String(account.role || 'None')} />
                        <StatusBadge status={String(account.status || 'None')} />
                        {account.passwordChangeRequired ? (
                          <span className="font-medium text-amber-700">Password change required</span>
                        ) : null}
                        <span>Last login: {displayDate(account.lastLoginAt)}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setResetUserId((id) => (id === account.userId ? null : account.userId))
                      }
                    >
                      {resetUserId === account.userId ? 'Cancel reset' : 'Reset password'}
                    </Button>
                  </div>
                  {resetUserId === account.userId ? (
                    <ResetPasswordForm
                      companyId={companyId}
                      userId={account.userId}
                      onDone={() => setResetUserId(null)}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
