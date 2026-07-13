import { motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { widgetFade } from '@/shared/motion/variants'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

export interface WidgetFrameProps {
  title: string
  description?: string
  action?: ReactNode
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  children?: ReactNode
  className?: string
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
}: WidgetFrameProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={widgetFade}
      initial={reduceMotion ? false : 'initial'}
      animate="animate"
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
            ) : null}
          </div>
          {action}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 px-4 py-8 text-center">
              <AlertCircle className="h-8 w-8 text-[var(--destructive)]" aria-hidden />
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
