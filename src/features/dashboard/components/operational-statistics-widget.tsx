import { usePlatformStatistics } from '@/features/dashboard/hooks/use-platform-statistics'
import { SummaryCard } from '@/shared/ui/widgets/summary-card'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

export function OperationalStatisticsWidget() {
  const { data, isLoading, error, refetch } = usePlatformStatistics()
  const ops = data?.operations

  return (
    <WidgetFrame
      title="Operational statistics"
      description="Aggregate platform activity — monitoring only"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Transactions
          </p>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <SummaryCard label="Total" value={ops?.transactions.total ?? '—'} />
            <SummaryCard label="Today" value={ops?.transactions.today ?? '—'} />
            <SummaryCard label="This week" value={ops?.transactions.week ?? '—'} />
            <SummaryCard label="This month" value={ops?.transactions.month ?? '—'} />
            <SummaryCard label="Inbound" value={ops?.transactions.inbound ?? '—'} />
            <SummaryCard label="Outbound" value={ops?.transactions.outbound ?? '—'} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Trips
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Total" value={ops?.trips.total ?? '—'} />
            <SummaryCard label="Completed" value={ops?.trips.completed ?? '—'} />
            <SummaryCard label="Active" value={ops?.trips.active ?? '—'} />
            <SummaryCard label="Cancelled" value={ops?.trips.cancelled ?? '—'} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total expenses"
            value={ops?.totalExpenses?.toLocaleString() ?? '—'}
          />
          <SummaryCard label="Branches" value={ops?.totalBranches ?? '—'} />
          <SummaryCard label="Warehouses" value={ops?.totalWarehouses ?? '—'} />
          <SummaryCard label="Vehicles" value={ops?.totalVehicles ?? '—'} />
        </div>
      </div>
    </WidgetFrame>
  )
}
