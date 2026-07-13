import { useState } from 'react'
import type { CompanyOwner } from '@/features/companies/types'
import { useOwnerMutations } from '@/features/companies/hooks/use-owners'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'

interface OwnerSupportActionsProps {
  owner: CompanyOwner
}

export function OwnerSupportActions({ owner }: OwnerSupportActionsProps) {
  const mutations = useOwnerMutations(owner.companyId)
  const [dialog, setDialog] = useState<
    null | 'activate' | 'deactivate' | 'lock' | 'unlock' | 'reset'
  >(null)

  const run = async () => {
    try {
      if (dialog === 'activate') await mutations.activate.mutateAsync(owner.id)
      if (dialog === 'deactivate') await mutations.deactivate.mutateAsync(owner.id)
      if (dialog === 'lock') await mutations.lock.mutateAsync(owner.id)
      if (dialog === 'unlock') await mutations.unlock.mutateAsync(owner.id)
      if (dialog === 'reset') {
        const result = await mutations.resetPassword.mutateAsync(owner.id)
        showSuccess(result.message ?? 'Password reset initiated. Credentials are never shown here.')
        setDialog(null)
        return
      }
      showSuccess('Owner updated')
      setDialog(null)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Action failed')
    }
  }

  const pending =
    mutations.activate.isPending ||
    mutations.deactivate.isPending ||
    mutations.lock.isPending ||
    mutations.unlock.isPending ||
    mutations.resetPassword.isPending

  return (
    <div className="flex flex-wrap gap-2">
      {owner.status === 'active' ? (
        <Button size="sm" variant="outline" onClick={() => setDialog('deactivate')}>
          Deactivate
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setDialog('activate')}>
          Activate
        </Button>
      )}
      {owner.locked ? (
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
        title={
          dialog === 'reset'
            ? 'Reset owner password?'
            : dialog === 'lock'
              ? 'Lock owner account?'
              : dialog === 'unlock'
                ? 'Unlock owner account?'
                : dialog === 'deactivate'
                  ? 'Deactivate owner?'
                  : 'Activate owner?'
        }
        description={
          dialog === 'reset'
            ? 'A secure reset will be sent through the platform channel. You will never see the password.'
            : `Confirm this action for ${owner.name}.`
        }
        confirmLabel="Confirm"
        variant={dialog === 'deactivate' || dialog === 'lock' ? 'destructive' : 'default'}
        loading={pending}
        onConfirm={run}
      />
    </div>
  )
}
