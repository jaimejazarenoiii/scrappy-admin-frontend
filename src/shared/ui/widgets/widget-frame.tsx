import { motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { widgetFade } from '@/shared/motion/variants'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export interface WidgetFrameProps {
  title: string
  description?: string
  action?: ReactNode
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  children?: ReactNode
  className?: string
  /** `panel` = light bordered surface; `flush` = section header only (no nested card). */
  variant?: 'panel' | 'flush'
}

export function WidgetFrame({
  title,
  description,
  action,
  loading = false,
  error,
  onRetry,
  children,
  className,
  variant = 'panel',
}: WidgetFrameProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      variants={widgetFade}
      initial={reduceMotion ? false : 'initial'}
      animate="animate"
      className={cn(
        variant === 'panel' &&
          'rounded-xl border border-[var(--border)] bg-[var(--surface)]',
        variant === 'flush' && 'border-b border-[var(--border)] pb-6 last:border-b-0 last:pb-0',
        className,
      )}
      aria-labelledby={`widget-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <header
        className={cn(
          'flex flex-row items-start justify-between gap-3',
          variant === 'panel' ? 'px-5 pt-4 pb-2' : 'pb-3',
        )}
      >
        <div>
          <h2
            id={`widget-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-sm font-semibold tracking-tight text-[var(--foreground)]"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      <div className={cn(variant === 'panel' ? 'px-5 pb-5' : undefined)}>
        {loading ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 px-4 py-8 text-center">
            <AlertCircle className="h-7 w-7 text-[var(--destructive)]" aria-hidden />
            <p className="text-sm text-[var(--foreground)]">{error}</p>
            {onRetry ? (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                Retry
              </Button>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
    </motion.section>
  )
}
