import { useState } from 'react'
import { useGrowthAnalytics } from '@/features/dashboard/hooks/use-growth-analytics'
import type { GrowthMetricFamily } from '@/features/dashboard/types'
import { MultiSeriesGrowthChart } from '@/shared/ui/charts'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'
import { cn } from '@/shared/lib/utils'

const METRIC_FAMILIES: Array<{ key: GrowthMetricFamily; label: string }> = [
  { key: 'companies', label: 'Companies' },
  { key: 'users', label: 'Users' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'trips', label: 'Trips' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'subscriptions', label: 'Subscriptions' },
]

export function GrowthAnalyticsWidget() {
  const { data, isLoading, error, refetch } = useGrowthAnalytics()
  const [activeKey, setActiveKey] = useState<GrowthMetricFamily>('companies')

  const series = METRIC_FAMILIES.map((family) => ({
    key: family.key,
    label: family.label,
    data: (data?.[family.key] ?? []).map((point) => ({
      label: point.period,
      value: point.value,
    })),
  }))

  const activeSeries = series.find((item) => item.key === activeKey)
  const latestValue = activeSeries?.data.at(-1)?.value

  return (
    <WidgetFrame
      title="Growth analytics"
      description={
        latestValue != null
          ? `${activeSeries?.label}: ${latestValue.toLocaleString()} (latest period)`
          : 'Trend series across six metric families'
      }
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {METRIC_FAMILIES.map((family) => (
          <button
            key={family.key}
            type="button"
            onClick={() => setActiveKey(family.key)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeKey === family.key
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-80',
            )}
          >
            {family.label}
          </button>
        ))}
      </div>
      <MultiSeriesGrowthChart series={series} activeKey={activeKey} />
    </WidgetFrame>
  )
}
