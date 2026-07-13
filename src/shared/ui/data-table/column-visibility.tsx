import type { Table } from '@tanstack/react-table'
import { Columns3 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

export interface ColumnVisibilityProps<TData> {
  table: Table<TData>
  className?: string
}

export function ColumnVisibility<TData>({ table, className }: ColumnVisibilityProps<TData>) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <Button variant="outline" size="sm" onClick={() => setOpen((value) => !value)}>
        <Columns3 className="h-4 w-4" aria-hidden />
        Columns
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-elevated">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <label
                key={column.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                <input
                  type="checkbox"
                  className="rounded border-[var(--border)]"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <span className="capitalize">{column.id.replace(/_/g, ' ')}</span>
              </label>
            ))}
        </div>
      ) : null}
    </div>
  )
}
