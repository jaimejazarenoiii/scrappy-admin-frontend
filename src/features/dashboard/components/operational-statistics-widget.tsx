import { usePlatformStatistics } from '@/features/dashboard/hooks/use-platform-statistics'
import { CompactStat } from '@/shared/ui/widgets/compact-stat'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

export function OperationalStatisticsWidget() {
  const { data, isLoading, error, refetch } = usePlatformStatistics()
  const ops = data?.operations

  return (
    <WidgetFrame
      title="Operations"
      description="Transactions, trips, and org footprint"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Transactions
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            <CompactStat label="Total" value={ops?.transactions.total ?? '—'} />
            <CompactStat label="Today" value={ops?.transactions.today ?? '—'} />
            <CompactStat label="Week" value={ops?.transactions.week ?? '—'} />
            <CompactStat label="Month" value={ops?.transactions.month ?? '—'} />
            <CompactStat label="Inbound" value={ops?.transactions.inbound ?? '—'} />
            <CompactStat label="Outbound" value={ops?.transactions.outbound ?? '—'} />
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Fleet & presence
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <CompactStat label="Trips" value={ops?.trips.total ?? '—'} />
            <CompactStat label="Active trips" value={ops?.trips.active ?? '—'} tone="success" />
            <CompactStat label="Branches" value={ops?.totalBranches ?? '—'} />
            <CompactStat label="Vehicles" value={ops?.totalVehicles ?? '—'} />
          </div>
        </div>
      </div>
    </WidgetFrame>
  )
}
