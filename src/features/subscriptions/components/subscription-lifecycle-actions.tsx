import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'
import {
  expireSubscription,
  renewSubscription,
  suspendSubscription,
} from '@/features/subscriptions/api/subscriptions-api'
import { SubscriptionForm } from '@/features/subscriptions/components/subscription-form'
import { planLabel, suggestedPeriodStatus, type Subscription } from '@/features/subscriptions/types'
import {
  toApiDateTime,
  toDateInputValue,
  type SubscriptionFormValues,
} from '@/features/subscriptions/validation/subscription-schema'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { canWrite } from '@/shared/lib/rbac'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'
import { cn } from '@/shared/lib/utils'

interface SubscriptionLifecycleActionsProps {
  subscription: Subscription
}

function statusKey(status: string): string {
  return status.toLowerCase()
}

function renewDefaults(subscription: Subscription): Partial<SubscriptionFormValues> {
  const start = new Date()
  const end = new Date()
  end.setMonth(end.getMonth() + 1)
  return {
    planName: planLabel(subscription),
    status: suggestedPeriodStatus(subscription.status),
    startsAt: start.toISOString().slice(0, 10),
    endsAt: end.toISOString().slice(0, 10),
  }
}

export function SubscriptionLifecycleActions({ subscription }: SubscriptionLifecycleActionsProps) {
  const queryClient = useQueryClient()
  const admin = useAuthStore((state) => state.admin)
  const canMutate = admin ? canWrite(admin.roles) : false
  const [renewOpen, setRenewOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [expireOpen, setExpireOpen] = useState(false)
  const renewDialogRef = useRef<HTMLDialogElement>(null)
  const renewTitleId = useId()
  const key = statusKey(subscription.status)

  useEffect(() => {
    const dialog = renewDialogRef.current
    if (!dialog) return
    if (renewOpen && !dialog.open) dialog.showModal()
    else if (!renewOpen && dialog.open) dialog.close()
  }, [renewOpen])

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    void queryClient.invalidateQueries({ queryKey: ['pm', 'subscriptions'] })
    void queryClient.invalidateQueries({ queryKey: ['pm', 'companies'] })
  }

  const renewMutation = useMutation({
    mutationFn: (values: SubscriptionFormValues) =>
      renewSubscription(
        subscription.companyId,
        {
          planName: values.planName,
          status: values.status,
          startsAt: toApiDateTime(values.startsAt),
          endsAt: toApiDateTime(values.endsAt, true),
        },
        subscription.id,
      ),
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
      <dialog
        ref={renewDialogRef}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--foreground)] shadow-elevated backdrop:bg-black/40',
        )}
        aria-labelledby={renewTitleId}
        onCancel={(event) => {
          event.preventDefault()
          setRenewOpen(false)
        }}
        onClose={() => setRenewOpen(false)}
      >
        <div className="p-6">
          <h2 id={renewTitleId} className="text-lg font-semibold tracking-tight">
            Renew subscription
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Create a new period for {subscription.companyName}. The previous ACTIVE period becomes
            EXPIRED.
            {subscription.endsAt && toDateInputValue(subscription.endsAt)
              ? ` Current period ends ${toDateInputValue(subscription.endsAt)}.`
              : ''}
          </p>
          {renewOpen ? (
            <div className="mt-4">
              <SubscriptionForm
                key={`${subscription.id}-renew`}
                companyName={subscription.companyName}
                defaultValues={renewDefaults(subscription)}
                submitLabel="Renew period"
                loading={renewMutation.isPending}
                onCancel={() => setRenewOpen(false)}
                onSubmit={async (values) => {
                  await renewMutation.mutateAsync(values)
                }}
              />
            </div>
          ) : null}
        </div>
      </dialog>

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
