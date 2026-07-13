import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { SubscriptionLifecycleActions } from '@/features/subscriptions/components/subscription-lifecycle-actions'
import { useSubscription } from '@/features/subscriptions/hooks/use-subscriptions'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { StatusBadge } from '@/shared/ui/management/status-badge'

export function SubscriptionDetailPage() {
  const { id = '' } = useParams()
  const { data: subscription, isLoading, error } = useSubscription(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !subscription) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[var(--muted)]">Subscription not found.</p>
        <Link to="/subscriptions">
          <Button variant="outline">Back to subscriptions</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/subscriptions" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Subscriptions
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{subscription.companyName}</h1>
            <StatusBadge status={String(subscription.status)} />
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">{subscription.planName || subscription.planCode}</p>
        </div>
        <SubscriptionLifecycleActions subscription={subscription} />
      </div>

      <Link
        to={`/companies/${subscription.companyId}`}
        className="inline-flex text-sm font-medium text-[var(--primary)] hover:underline"
      >
        View company →
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Subscription details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Starts</p>
            <p className="mt-1 font-medium">{format(new Date(subscription.startsAt), 'PPP')}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Ends</p>
            <p className="mt-1 font-medium">{format(new Date(subscription.endsAt), 'PPP')}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Renewed</p>
            <p className="mt-1 font-medium">
              {subscription.renewedAt ? format(new Date(subscription.renewedAt), 'PPP') : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Suspended</p>
            <p className="mt-1 font-medium">
              {subscription.suspendedAt ? format(new Date(subscription.suspendedAt), 'PPP') : '—'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
