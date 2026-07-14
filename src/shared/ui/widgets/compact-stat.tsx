import type { ReactNode } from 'react'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export interface CompactStatProps {
  label: string
  value: ReactNode
  hint?: string
  loading?: boolean
  className?: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

const toneClass: Record<NonNullable<CompactStatProps['tone']>, string> = {
  default: 'text-[var(--foreground)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  danger: 'text-[var(--destructive)]',
}

/** Dense label/value cell — no card chrome. */
export function CompactStat({
  label,
  value,
  hint,
  loading,
  className,
  tone = 'default',
}: CompactStatProps) {
  if (loading) {
    return (
      <div className={cn('min-w-0 space-y-2', className)}>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-12" />
      </div>
    )
  }

  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 font-mono-value text-xl font-semibold tabular-nums tracking-tight sm:text-2xl',
          toneClass[tone],
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  )
}
