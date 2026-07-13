import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'

export function SessionExpiredDialog() {
  const sessionExpired = useAuthStore((state) => state.sessionExpired)
  const acknowledgeSessionExpired = useAuthStore((state) => state.acknowledgeSessionExpired)
  const navigate = useNavigate()

  const handleSignIn = () => {
    acknowledgeSessionExpired()
    navigate('/login', { replace: true })
  }

  return (
    <ConfirmationDialog
      open={sessionExpired}
      onOpenChange={(open) => {
        if (!open) acknowledgeSessionExpired()
      }}
      title="Session expired"
      description="Your session has ended. Sign in again to continue."
      confirmLabel="Sign in"
      cancelLabel="Dismiss"
      onConfirm={handleSignIn}
    />
  )
}
