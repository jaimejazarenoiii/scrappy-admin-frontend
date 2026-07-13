import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  activateAdministrator,
  deactivateAdministrator,
  lockAdministrator,
  resetAdministratorPassword,
  unlockAdministrator,
} from '@/features/administrators/api/administrators-api'
import type { Administrator } from '@/features/administrators/types'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'
import { pmQueryKeys } from '@/shared/lib/pm-query-keys'

interface AdministratorLifecycleActionsProps {
  administrator: Administrator
}

export function AdministratorLifecycleActions({ administrator }: AdministratorLifecycleActionsProps) {
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<null | 'activate' | 'deactivate' | 'lock' | 'unlock' | 'reset'>(
    null,
  )

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['administrators'] })
    void queryClient.invalidateQueries({ queryKey: pmQueryKeys.administrators.all })
    void queryClient.invalidateQueries({ queryKey: pmQueryKeys.activity.all })
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (dialog === 'activate') return activateAdministrator(administrator.id)
      if (dialog === 'deactivate') return deactivateAdministrator(administrator.id)
      if (dialog === 'lock') return lockAdministrator(administrator.id)
      if (dialog === 'unlock') return unlockAdministrator(administrator.id)
      if (dialog === 'reset') return resetAdministratorPassword(administrator.id)
      throw new Error('No action')
    },
    onSuccess: (result) => {
      invalidate()
      if (dialog === 'reset') {
        const msg =
          result && typeof result === 'object' && 'message' in result
            ? String((result as { message?: string }).message ?? 'Password reset initiated')
            : 'Password reset initiated'
        showSuccess(msg)
      } else {
        showSuccess('Administrator updated')
      }
      setDialog(null)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Action failed'),
  })

  return (
    <div className="flex flex-wrap gap-2">
      {administrator.status === 'active' ? (
        <Button size="sm" variant="outline" onClick={() => setDialog('deactivate')}>
          Deactivate
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setDialog('activate')}>
          Activate
        </Button>
      )}
      {administrator.status === 'locked' ? (
        <Button size="sm" variant="outline" onClick={() => setDialog('unlock')}>
          Unlock
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setDialog('lock')}>
          Lock
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => setDialog('reset')}>
        Reset password
      </Button>

      <ConfirmationDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Confirm administrator action"
        description={
          dialog === 'reset'
            ? 'A secure reset will be sent. Credentials are never shown in the console.'
            : `Apply ${dialog} to ${administrator.name}?`
        }
        confirmLabel="Confirm"
        variant={dialog === 'deactivate' || dialog === 'lock' ? 'destructive' : 'default'}
        loading={mutation.isPending}
        onConfirm={async () => {
          await mutation.mutateAsync()
        }}
      />
    </div>
  )
}
