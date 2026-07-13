import { Link } from 'react-router-dom'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { OwnerSupportActions } from '@/features/companies/components/owner-support-actions'
import { useCompanyOwners, useOwnerMutations } from '@/features/companies/hooks/use-owners'
import { ownerSchema, type OwnerFormValues } from '@/features/companies/validation/owner-schema'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { showError, showSuccess } from '@/shared/ui/toast'

interface CompanyOwnersPanelProps {
  companyId: string
}

export function CompanyOwnersPanel({ companyId }: CompanyOwnersPanelProps) {
  const { data, isLoading } = useCompanyOwners(companyId)
  const { create } = useOwnerMutations(companyId)
  const [showForm, setShowForm] = useState(false)
  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { name: '', email: '' },
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Owners</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add owner'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm ? (
          <Form {...form}>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  await create.mutateAsync(values)
                  showSuccess('Owner created')
                  form.reset()
                  setShowForm(false)
                } catch (error) {
                  showError(error instanceof Error ? error.message : 'Create failed')
                }
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="sm:col-span-2" disabled={create.isPending}>
                Create owner
              </Button>
            </form>
          </Form>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : data?.length ? (
          <ul className="divide-y divide-[var(--border)]">
            {data.map((owner) => (
              <li
                key={owner.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <Link
                    to={`/owners/${owner.id}`}
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    {owner.name}
                  </Link>
                  <p className="text-sm text-[var(--muted)]">{owner.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={owner.status} />
                  {owner.locked ? <Badge variant="destructive">locked</Badge> : null}
                  <OwnerSupportActions owner={owner} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted)]">No owners on record.</p>
        )}
      </CardContent>
    </Card>
  )
}
