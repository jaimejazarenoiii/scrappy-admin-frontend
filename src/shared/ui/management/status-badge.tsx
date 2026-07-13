import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'

const VARIANT_MAP: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  registered: 'default',
  inactive: 'warning',
  deactivated: 'destructive',
  locked: 'destructive',
  suspended: 'warning',
  expired: 'destructive',
  pending: 'secondary',
  grace: 'warning',
  ready: 'success',
  failed: 'destructive',
  running: 'default',
  pending_job: 'secondary',
}

export interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase()
  const variant = VARIANT_MAP[key] ?? 'default'
  return (
    <Badge variant={variant} className={cn('capitalize', className)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  )
}
