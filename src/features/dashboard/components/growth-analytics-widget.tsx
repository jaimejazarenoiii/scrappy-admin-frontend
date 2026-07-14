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
      title="Growth"
      description={
        latestValue != null
          ? `${activeSeries?.label} · latest ${latestValue.toLocaleString()}`
          : 'Trend over the selected period'
      }
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div
        className="mb-4 flex flex-wrap gap-1 border-b border-[var(--border)]"
        role="tablist"
        aria-label="Growth metric"
      >
        {METRIC_FAMILIES.map((family) => (
          <button
            key={family.key}
            type="button"
            role="tab"
            aria-selected={activeKey === family.key}
            onClick={() => setActiveKey(family.key)}
            className={cn(
              'cursor-pointer px-3 py-2 text-xs font-medium transition-colors duration-200',
              activeKey === family.key
                ? '-mb-px border-b-2 border-[var(--primary)] text-[var(--foreground)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]',
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
