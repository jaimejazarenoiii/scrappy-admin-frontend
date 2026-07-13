import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdministratorLifecycleActions } from '@/features/administrators/components/administrator-lifecycle-actions'
import {
  createAdministrator,
  deactivateAdministrator,
  updateAdministrator,
} from '@/features/administrators/api/administrators-api'
import {
  administratorSchema,
  type AdministratorFormValues,
} from '@/features/administrators/validation/administrator-schema'
import { useAdministrator } from '@/features/administrators/hooks/use-administrators'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { hasRole } from '@/shared/lib/rbac'
import type { Role } from '@/shared/types/api'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { showError, showSuccess } from '@/shared/ui/toast'
import { useState } from 'react'

const ALL_ROLES: Role[] = [
  'super_admin',
  'admin',
  'support',
  'finance',
  'sales',
  'read_only_analyst',
]

export function AdministratorDetailPage() {
  const { id = '' } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentAdmin = useAuthStore((state) => state.admin)
  const canManage = currentAdmin ? hasRole(currentAdmin.roles, 'super_admin') : false
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const { data: administrator, isLoading } = useAdministrator(isNew ? '' : id)

  const form = useForm<AdministratorFormValues>({
    resolver: zodResolver(administratorSchema),
    values: isNew
      ? { email: '', name: '', roles: ['read_only_analyst'] }
      : {
          email: administrator?.email ?? '',
          name: administrator?.name ?? '',
          roles: administrator?.roles ?? [],
          status: administrator?.status,
        },
  })

  const saveMutation = useMutation({
    mutationFn: async (values: AdministratorFormValues) => {
      if (isNew) {
        return createAdministrator({
          email: values.email,
          name: values.name,
          roles: values.roles as Role[],
        })
      }
      return updateAdministrator(id, {
        name: values.name,
        roles: values.roles as Role[],
        status: values.status,
      })
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['administrators'] })
      showSuccess(isNew ? 'Administrator created' : 'Administrator updated')
      if (isNew) navigate(`/administrators/${result.id}`, { replace: true })
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Save failed'),
  })

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateAdministrator(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['administrators'] })
      showSuccess('Administrator deactivated')
      setDeactivateOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Deactivation failed'),
  })

  if (!canManage) {
    return (
      <div className="text-center">
        <p className="text-[var(--muted)]">Only super admins can manage administrators.</p>
        <Link to="/administrators">
          <Button variant="outline" className="mt-4">
            Back
          </Button>
        </Link>
      </div>
    )
  }

  if (!isNew && isLoading) {
    return <Skeleton className="h-64 w-full" />
  }

  if (!isNew && !administrator) {
    return (
      <div className="text-center">
        <p className="text-[var(--muted)]">Administrator not found.</p>
        <Link to="/administrators">
          <Button variant="outline" className="mt-4">
            Back
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <Link to="/administrators" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Administrators
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {isNew ? 'New administrator' : administrator?.name}
        </h1>
      </div>

      {!isNew && administrator ? <AdministratorLifecycleActions administrator={administrator} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Create account' : 'Edit account'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))} className="space-y-4">
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
                      <Input type="email" disabled={!isNew} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {ALL_ROLES.map((role) => {
                        const selected = field.value.includes(role)
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              field.onChange(
                                selected
                                  ? field.value.filter((r) => r !== role)
                                  : [...field.value, role],
                              )
                            }}
                          >
                            <Badge variant={selected ? 'default' : 'outline'}>
                              {role.replace(/_/g, ' ')}
                            </Badge>
                          </button>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {isNew ? 'Create' : 'Save changes'}
                </Button>
                {!isNew && administrator?.status === 'active' ? (
                  <Button type="button" variant="destructive" onClick={() => setDeactivateOpen(true)}>
                    Deactivate
                  </Button>
                ) : null}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate administrator"
        description="This account will no longer be able to sign in."
        confirmLabel="Deactivate"
        variant="destructive"
        loading={deactivateMutation.isPending}
        onConfirm={async () => {
          await deactivateMutation.mutateAsync()
        }}
      />
    </div>
  )
}
