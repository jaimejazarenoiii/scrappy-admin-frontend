import { forwardRef, type CSSProperties, type SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236e6e73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

/** Native select styled to match `Input` (same height, border, focus ring). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, style, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-9 w-full cursor-pointer appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1 pr-9 text-sm text-[var(--foreground)] shadow-sm transition-colors',
        'bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={
        {
          backgroundImage: CHEVRON,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </select>
  ),
)

Select.displayName = 'Select'
