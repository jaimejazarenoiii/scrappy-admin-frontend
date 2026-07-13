import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { triggerPasswordReset, unlockUser } from '@/features/support/api/support-api'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { hasRole } from '@/shared/lib/rbac'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'

interface UserSupportActionsProps {
  userId: string
  userName: string
}

export function UserSupportActions({ userId, userName }: UserSupportActionsProps) {
  const admin = useAuthStore((state) => state.admin)
  const canSupport = admin ? hasRole(admin.roles, ['super_admin', 'admin', 'support']) : false
  const [resetOpen, setResetOpen] = useState(false)
  const [unlockOpen, setUnlockOpen] = useState(false)

  const resetMutation = useMutation({
    mutationFn: () => triggerPasswordReset(userId),
    onSuccess: () => {
      showSuccess(`Password reset email sent to ${userName}`)
      setResetOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Reset failed'),
  })

  const unlockMutation = useMutation({
    mutationFn: () => unlockUser(userId),
    onSuccess: () => {
      showSuccess(`${userName}'s account has been unlocked`)
      setUnlockOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Unlock failed'),
  })

  if (!canSupport) return null

  return (
    <div className="flex gap-1">
      <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
        Reset password
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setUnlockOpen(true)}>
        Unlock
      </Button>

      <ConfirmationDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Send password reset"
        description={`Send a password reset email to ${userName}. No credentials will be displayed.`}
        confirmLabel="Send reset email"
        loading={resetMutation.isPending}
        onConfirm={async () => {
          await resetMutation.mutateAsync()
        }}
      />

      <ConfirmationDialog
        open={unlockOpen}
        onOpenChange={setUnlockOpen}
        title="Unlock account"
        description={`Unlock ${userName}'s account so they can sign in again.`}
        confirmLabel="Unlock account"
        loading={unlockMutation.isPending}
        onConfirm={async () => {
          await unlockMutation.mutateAsync()
        }}
      />
    </div>
  )
}
