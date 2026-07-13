import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { useSubscriptionAnalytics } from '@/features/dashboard/hooks/use-subscription-analytics'
import { Badge } from '@/shared/ui/badge'
import { DistributionPieChart } from '@/shared/ui/charts'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'
import { SummaryCard } from '@/shared/ui/widgets/summary-card'

export function SubscriptionOverviewWidget() {
  const { data, isLoading, error, refetch } = useSubscriptionAnalytics()

  const pieData = (data?.distribution ?? []).map((item) => ({
    name: item.status,
    value: item.count,
  }))

  return (
    <WidgetFrame
      title="Subscription overview"
      description="Distribution, duration, and lifecycle lists"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link to="/subscriptions" className="text-sm font-medium text-[var(--primary)] hover:underline">
          View all
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <DistributionPieChart data={pieData} />
        <div className="space-y-3">
          <SummaryCard
            label="Avg. duration"
            value={data ? `${data.averageDurationDays} days` : '—'}
          />
          {data?.statusBreakdown
            ? Object.entries(data.statusBreakdown).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
                >
                  <span className="capitalize">{status}</span>
                  <span className="font-mono-value font-medium">{count}</span>
                </div>
              ))
            : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 border-t border-[var(--border)] pt-4 lg:grid-cols-3">
        <SubscriptionList title="Expiring soon" items={data?.expiringSoon} />
        <SubscriptionList title="Recently expired" items={data?.recentlyExpired} />
        <SubscriptionList title="Recently renewed" items={data?.recentlyRenewed} />
      </div>
    </WidgetFrame>
  )
}

function SubscriptionList({
  title,
  items,
}: {
  title: string
  items?: Array<{
    companyId: string
    companyName: string
    subscriptionId: string
    date: string
  }>
}) {
  if (!items?.length) {
    return (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {title}
        </p>
        <p className="text-sm text-[var(--muted)]">None</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.subscriptionId}>
            <Link
              to={`/subscriptions/${item.subscriptionId}`}
              className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            >
              <span className="min-w-0 truncate font-medium">{item.companyName}</span>
              <Badge variant="outline">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
