import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export interface SummaryCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon?: ReactNode
  loading?: boolean
  className?: string
}

export function SummaryCard({
  label,
  value,
  delta,
  deltaPositive,
  icon,
  loading,
  className,
}: SummaryCardProps) {
  const reduceMotion = useReducedMotion()

  if (loading) {
    return (
      <Card className={cn('p-5', className)}>
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="h-8 w-20" />
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <Card
        className={cn(
          'p-5 transition-shadow duration-200 hover:shadow-elevated',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
            <p className="mt-2 font-mono-value text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {value}
            </p>
            {delta ? (
              <p
                className={cn(
                  'mt-1 text-xs font-medium',
                  deltaPositive ? 'text-[var(--success)]' : 'text-[var(--destructive)]',
                )}
              >
                {delta}
              </p>
            ) : null}
          </div>
          {icon ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)]">
              {icon}
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  )
}
