import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { useRecentActivities } from '@/features/dashboard/hooks/use-recent-activities'
import { EmptyState } from '@/shared/ui/empty-state'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

export function RecentActivityWidget() {
  const { data, isLoading, error, refetch } = useRecentActivities()
  const items = data?.items ?? []

  return (
    <WidgetFrame
      title="Activity"
      description="Latest admin events"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link
          to="/activity"
          className="cursor-pointer text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View all
        </Link>
      }
    >
      {items.length === 0 ? (
        <EmptyState title="No recent activity" className="border-none bg-transparent shadow-none" />
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {items.map((event) => {
            const href =
              event.href ??
              (event.targetType === 'company' && event.targetId
                ? `/companies/${event.targetId}`
                : event.targetType === 'subscription' && event.targetId
                  ? `/subscriptions/${event.targetId}`
                  : '/activity')

            return (
              <li key={event.id}>
                <Link
                  to={href}
                  className="flex cursor-pointer items-start justify-between gap-3 py-2.5 transition-colors first:pt-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-[var(--muted)]">{event.actorLabel ?? 'System'}</p>
                  </div>
                  <time className="shrink-0 text-[11px] text-[var(--muted)]">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </time>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </WidgetFrame>
  )
}
