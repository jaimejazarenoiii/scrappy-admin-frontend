import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { useSubscriptionAnalytics } from '@/features/dashboard/hooks/use-subscription-analytics'
import { Badge } from '@/shared/ui/badge'
import { DistributionPieChart } from '@/shared/ui/charts'
import { CompactStat } from '@/shared/ui/widgets/compact-stat'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

export function SubscriptionOverviewWidget() {
  const { data, isLoading, error, refetch } = useSubscriptionAnalytics()

  const pieData = (data?.distribution ?? []).map((item) => ({
    name: item.status,
    value: item.count,
  }))

  return (
    <WidgetFrame
      title="Subscriptions"
      description="Entitlement mix and lifecycle signals"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link
          to="/subscriptions"
          className="cursor-pointer text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View all
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <DistributionPieChart data={pieData} />
        <div className="space-y-4">
          <CompactStat
            label="Avg. duration"
            value={data ? `${data.averageDurationDays}d` : '—'}
          />
          <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {(data?.distribution ?? []).map((item) => (
              <li
                key={item.status}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <span className="text-[var(--muted)]">{item.status.replace(/_/g, ' ')}</span>
                <span className="font-mono-value font-semibold tabular-nums">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-5 border-t border-[var(--border)] pt-5 lg:grid-cols-3">
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
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        {title}
      </p>
      {!items?.length ? (
        <p className="text-sm text-[var(--muted)]">None</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.subscriptionId}>
              <Link
                to={`/subscriptions/${item.subscriptionId}?companyId=${item.companyId}`}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-sm transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                <span className="min-w-0 truncate font-medium">{item.companyName}</span>
                <Badge variant="outline">
                  {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
