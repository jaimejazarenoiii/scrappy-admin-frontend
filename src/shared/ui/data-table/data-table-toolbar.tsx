import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { ColumnVisibility } from '@/shared/ui/data-table/column-visibility'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
  className?: string
}

export function DataTableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters,
  actions,
  className,
}: DataTableToolbarProps<TData>) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {onSearchChange ? (
          <Input
            value={searchValue ?? ''}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 max-w-xs"
            aria-label="Search table"
          />
        ) : null}
        {filters}
      </div>
      <div className="flex items-center gap-2">
        <ColumnVisibility table={table} />
        {actions}
      </div>
    </div>
  )
}
