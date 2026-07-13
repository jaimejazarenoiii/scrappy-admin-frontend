import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-black/6 dark:bg-white/8', className)}
      {...props}
    />
  )
}
