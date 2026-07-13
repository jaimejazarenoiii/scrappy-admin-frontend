import { Lock, UserCheck, UserMinus, Users, UserX } from 'lucide-react'
import { usePlatformStatistics } from '@/features/dashboard/hooks/use-platform-statistics'
import { SummaryCard } from '@/shared/ui/widgets/summary-card'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

export function UserStatisticsWidget() {
  const { data, isLoading, error, refetch } = usePlatformStatistics()
  const users = data?.users

  return (
    <WidgetFrame
      title="User statistics"
      description="Platform user counts and role distribution"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total users" value={users?.totalUsers ?? '—'} icon={<Users className="h-5 w-5" />} />
        <SummaryCard label="Owners" value={users?.owners ?? '—'} icon={<UserCheck className="h-5 w-5" />} />
        <SummaryCard label="Managers" value={users?.managers ?? '—'} icon={<Users className="h-5 w-5" />} />
        <SummaryCard label="Employees" value={users?.employees ?? '—'} icon={<Users className="h-5 w-5" />} />
        <SummaryCard label="Active" value={users?.activeUsers ?? '—'} icon={<UserCheck className="h-5 w-5" />} />
        <SummaryCard label="Inactive" value={users?.inactiveUsers ?? '—'} icon={<UserMinus className="h-5 w-5" />} />
        <SummaryCard label="Locked" value={users?.lockedUsers ?? '—'} icon={<Lock className="h-5 w-5" />} />
        <SummaryCard
          label="New this month"
          value={users?.newUsersThisMonth ?? '—'}
          icon={<UserX className="h-5 w-5" />}
        />
      </div>
    </WidgetFrame>
  )
}
