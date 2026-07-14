import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/shared/ui/empty-state'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

const statusVariant = {
  active: 'success',
  registered: 'default',
  inactive: 'warning',
  deactivated: 'destructive',
  trial: 'default',
  grace_period: 'warning',
  expired: 'destructive',
  suspended: 'destructive',
} as const

export function RecentCompaniesWidget() {
  const { data, isLoading, error, refetch } = useDashboardSummary()
  const items = data?.recentCompanies ?? []

  return (
    <WidgetFrame
      title="New companies"
      description="Recent registrations"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link
          to="/companies"
          className="cursor-pointer text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View all
        </Link>
      }
    >
      {items.length === 0 ? (
        <EmptyState title="No recent companies" className="border-none bg-transparent shadow-none" />
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {items.map((company) => (
            <li key={company.companyId}>
              <Link
                to={`/companies/${company.companyId}`}
                className="flex cursor-pointer items-center justify-between gap-3 py-2.5 transition-colors first:pt-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{company.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {formatDistanceToNow(new Date(company.registeredAt), { addSuffix: true })}
                  </p>
                </div>
                <Badge
                  variant={
                    statusVariant[company.status as keyof typeof statusVariant] ?? 'default'
                  }
                >
                  {company.status}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetFrame>
  )
}
