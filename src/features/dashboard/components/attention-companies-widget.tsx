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
      title="Companies requiring attention"
      description="Flagged companies with reason badges"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link to="/companies" className="text-sm font-medium text-[var(--primary)] hover:underline">
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
        <ul className="space-y-3">
          {items.map((company) => (
            <li key={company.companyId}>
              <Link
                to={`/companies/${company.companyId}`}
                className="block rounded-xl border border-[var(--border)] px-3 py-2.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                <p className="text-sm font-medium">{company.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
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
