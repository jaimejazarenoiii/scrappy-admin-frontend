import { useQuery } from '@tanstack/react-query'
import { fetchAnalytics } from '@/features/analytics/api/analytics-api'
import { DistributionPieChart, GrowthLineChart } from '@/shared/ui/charts'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

const REPORT_KEYS = ['platform-growth', 'subscription-mix', 'usage-trends'] as const

export function AnalyticsPage() {
  const reportKey = REPORT_KEYS[0]
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', reportKey],
    queryFn: () => fetchAnalytics(reportKey),
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--muted)]">Platform trends and subscription insights</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WidgetFrame
          title="Growth trend"
          loading={isLoading}
          error={error instanceof Error ? error.message : null}
          onRetry={() => void refetch()}
        >
          <GrowthLineChart data={data?.series ?? []} />
        </WidgetFrame>
        <WidgetFrame
          title="Plan distribution"
          loading={isLoading}
          error={error instanceof Error ? error.message : null}
          onRetry={() => void refetch()}
        >
          <DistributionPieChart data={data?.breakdown ?? []} />
        </WidgetFrame>
      </div>
    </div>
  )
}
