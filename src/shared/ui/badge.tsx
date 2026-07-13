import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]',
        secondary:
          'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]',
        success:
          'border-transparent bg-[var(--success)]/12 text-[var(--success)]',
        warning:
          'border-transparent bg-[var(--warning)]/12 text-[var(--warning)]',
        destructive:
          'border-transparent bg-[var(--destructive)]/12 text-[var(--destructive)]',
        outline: 'border-[var(--border)] text-[var(--foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
