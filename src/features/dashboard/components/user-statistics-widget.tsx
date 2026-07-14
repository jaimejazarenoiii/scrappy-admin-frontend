import { usePlatformStatistics } from '@/features/dashboard/hooks/use-platform-statistics'
import { CompactStat } from '@/shared/ui/widgets/compact-stat'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

export function UserStatisticsWidget() {
  const { data, isLoading, error, refetch } = usePlatformStatistics()
  const users = data?.users

  return (
    <WidgetFrame
      title="Users"
      description="Role mix and account health"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <CompactStat label="Total" value={users?.totalUsers ?? '—'} />
        <CompactStat label="Owners" value={users?.owners ?? '—'} />
        <CompactStat label="Managers" value={users?.managers ?? '—'} />
        <CompactStat label="Employees" value={users?.employees ?? '—'} />
        <CompactStat label="Active" value={users?.activeUsers ?? '—'} tone="success" />
        <CompactStat label="Inactive" value={users?.inactiveUsers ?? '—'} />
        <CompactStat label="Locked" value={users?.lockedUsers ?? '—'} tone="danger" />
        <CompactStat label="New month" value={users?.newUsersThisMonth ?? '—'} />
      </div>
    </WidgetFrame>
  )
}
