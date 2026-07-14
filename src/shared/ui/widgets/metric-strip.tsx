import type { ReactNode } from 'react'
import { CompactStat } from '@/shared/ui/widgets/compact-stat'
import { cn } from '@/shared/lib/utils'

export interface MetricStripItem {
  key: string
  label: string
  value: ReactNode
  hint?: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

export interface MetricStripProps {
  items: MetricStripItem[]
  loading?: boolean
  className?: string
}

/** Single continuous KPI ribbon — replaces grids of separate summary cards. */
export function MetricStrip({ items, loading, className }: MetricStripProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]',
        className,
      )}
      role="list"
      aria-label="Platform metrics"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
        {items.map((item, index) => (
          <div
            key={item.key}
            role="listitem"
            className={cn(
              'px-4 py-3.5 sm:px-5 sm:py-4',
              index % 2 === 1 && 'border-l border-[var(--border)]',
              'sm:border-l sm:border-[var(--border)] sm:[&:nth-child(4n+1)]:border-l-0',
              'xl:[&:nth-child(4n+1)]:border-l xl:[&:nth-child(8n+1)]:border-l-0',
              index >= 2 && 'border-t border-[var(--border)] sm:border-t-0',
              index >= 4 && 'sm:border-t xl:border-t-0',
            )}
          >
            <CompactStat
              label={item.label}
              value={item.value}
              hint={item.hint}
              tone={item.tone}
              loading={loading}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
