import { Link } from 'react-router-dom'
import { useAttentionCompanies } from '@/features/dashboard/hooks/use-attention-companies'
import type { AttentionReason } from '@/features/dashboard/types'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/shared/ui/empty-state'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

const REASON_LABELS: Record<AttentionReason, string> = {
  expired_subscription: 'Expired subscription',
  suspended_subscription: 'Suspended subscription',
  grace_ending_soon: 'Grace ending soon',
  no_recent_activity: 'No recent activity',
  locked_owner: 'Locked owner',
}

const REASON_VARIANTS: Record<AttentionReason, 'destructive' | 'warning' | 'default'> = {
  expired_subscription: 'destructive',
  suspended_subscription: 'destructive',
  grace_ending_soon: 'warning',
  no_recent_activity: 'warning',
  locked_owner: 'destructive',
}

export function AttentionCompaniesWidget() {
  const { data, isLoading, error, refetch } = useAttentionCompanies()
  const items = data?.items ?? []

  return (
    <WidgetFrame
      title="Needs attention"
      description="Companies flagged for follow-up"
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
        <EmptyState
          title="All clear"
          description="No companies require attention right now."
          className="border-none bg-transparent shadow-none"
        />
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {items.map((company) => (
            <li key={company.companyId}>
              <Link
                to={`/companies/${company.companyId}`}
                className="block cursor-pointer py-3 transition-colors first:pt-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <p className="text-sm font-medium">{company.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {company.reasons.map((reason) => (
                    <Badge key={reason} variant={REASON_VARIANTS[reason]}>
                      {REASON_LABELS[reason]}
                    </Badge>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetFrame>
  )
}
