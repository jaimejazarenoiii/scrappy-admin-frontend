import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  expireSubscription,
  renewSubscription,
  suspendSubscription,
} from '@/features/subscriptions/api/subscriptions-api'
import type { Subscription } from '@/features/subscriptions/types'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { canWrite } from '@/shared/lib/rbac'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'

interface SubscriptionLifecycleActionsProps {
  subscription: Subscription
}

function statusKey(status: string): string {
  return status.toLowerCase()
}

export function SubscriptionLifecycleActions({ subscription }: SubscriptionLifecycleActionsProps) {
  const queryClient = useQueryClient()
  const admin = useAuthStore((state) => state.admin)
  const canMutate = admin ? canWrite(admin.roles) : false
  const [renewOpen, setRenewOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [expireOpen, setExpireOpen] = useState(false)
  const key = statusKey(subscription.status)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    void queryClient.invalidateQueries({ queryKey: ['pm', 'subscriptions'] })
    void queryClient.invalidateQueries({ queryKey: ['pm', 'companies'] })
  }

  const renewMutation = useMutation({
    mutationFn: () => renewSubscription(subscription.companyId, subscription.id),
    onSuccess: () => {
      invalidate()
      showSuccess('Subscription renewed')
      setRenewOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Renewal failed'),
  })

  const suspendMutation = useMutation({
    mutationFn: () => suspendSubscription(subscription.companyId, subscription.id),
    onSuccess: () => {
      invalidate()
      showSuccess('Subscription suspended')
      setSuspendOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Suspension failed'),
  })

  const expireMutation = useMutation({
    mutationFn: () => expireSubscription(subscription.companyId, subscription.id),
    onSuccess: () => {
      invalidate()
      showSuccess('Subscription marked expired')
      setExpireOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Expire failed'),
  })

  if (!canMutate) return null

  const canSuspend = key === 'active' || key === 'trial' || key === 'grace_period'
  const canExpire = key !== 'expired'

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setRenewOpen(true)}>Renew</Button>
      <ConfirmationDialog
        open={renewOpen}
        onOpenChange={setRenewOpen}
        title="Renew subscription"
        description={`Renew entitlement for ${subscription.companyName} (creates a new period; prior ACTIVE becomes EXPIRED).`}
        confirmLabel="Renew"
        loading={renewMutation.isPending}
        onConfirm={async () => {
          await renewMutation.mutateAsync()
        }}
      />
      {canSuspend ? (
        <>
          <Button variant="outline" onClick={() => setSuspendOpen(true)}>
            Suspend
          </Button>
          <ConfirmationDialog
            open={suspendOpen}
            onOpenChange={setSuspendOpen}
            title="Suspend subscription"
            description="Suspend access until the customer resolves billing or support issues. Company users will be inactivated."
            confirmLabel="Suspend"
            variant="destructive"
            loading={suspendMutation.isPending}
            onConfirm={async () => {
              await suspendMutation.mutateAsync()
            }}
          />
        </>
      ) : null}
      {canExpire ? (
        <>
          <Button variant="destructive" onClick={() => setExpireOpen(true)}>
            Mark expired
          </Button>
          <ConfirmationDialog
            open={expireOpen}
            onOpenChange={setExpireOpen}
            title="Mark subscription expired"
            description="This blocks tenant login (EXPIRED). Super Admin can still manage the company."
            confirmLabel="Mark expired"
            variant="destructive"
            loading={expireMutation.isPending}
            onConfirm={async () => {
              await expireMutation.mutateAsync()
            }}
          />
        </>
      ) : null}
    </div>
  )
}
