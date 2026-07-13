import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listSettings, updateSetting } from '@/features/settings/api/settings-api'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { hasRole } from '@/shared/lib/rbac'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { showError, showSuccess } from '@/shared/ui/toast'
import { Link } from 'react-router-dom'

export function SettingsPage() {
  const admin = useAuthStore((state) => state.admin)
  const canAccess = admin ? hasRole(admin.roles, ['super_admin', 'admin']) : false
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: listSettings,
    enabled: canAccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => updateSetting(key, value),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] })
      showSuccess('Setting updated')
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Update failed'),
  })

  if (!canAccess) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-[var(--muted)]">Settings are restricted to admin roles.</p>
        <Link to="/dashboard" className="mt-4">
          <Button variant="outline">Go to dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--muted)]">Platform configuration for the admin console</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="space-y-4">
          {(data ?? []).map((setting) => (
            <Card key={setting.key}>
              <CardHeader>
                <CardTitle className="font-mono-value text-base">{setting.key}</CardTitle>
                <CardDescription>Last updated {new Date(setting.updatedAt).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {typeof setting.value === 'boolean' ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={setting.value}
                      onChange={(event) =>
                        updateMutation.mutate({ key: setting.key, value: event.target.checked })
                      }
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                ) : typeof setting.value === 'number' ? (
                  <form
                    className="flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault()
                      const formData = new FormData(event.currentTarget)
                      updateMutation.mutate({
                        key: setting.key,
                        value: Number(formData.get('value')),
                      })
                    }}
                  >
                    <Input name="value" type="number" defaultValue={setting.value} />
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm">{String(setting.value)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
