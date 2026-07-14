import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { planLabel, type Subscription } from '@/features/subscriptions/types'
import { Badge } from '@/shared/ui/badge'
import { StatusBadge } from '@/shared/ui/management/status-badge'

function formatDate(value?: string | null): string {
  if (!value) return 'None'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'None'
  return format(date, 'MMM d, yyyy')
}

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'companyName',
    header: 'Company',
    cell: ({ row }) => (
      <Link
        to={`/companies/${row.original.companyId}`}
        className="font-medium text-[var(--primary)] hover:underline"
      >
        {row.original.companyName || 'None'}
      </Link>
    ),
  },
  {
    accessorKey: 'planName',
    header: 'Plan / period',
    cell: ({ row }) => {
      const sub = row.original
      if (sub.isStatusOnly || !sub.id || sub.id.startsWith('status-')) {
        return <span className="text-sm text-[var(--muted)]">None</span>
      }
      const label = planLabel(sub) || 'Untitled'
      return (
        <Link
          to={`/subscriptions/${sub.id}?companyId=${sub.companyId}`}
          className="font-medium text-[var(--primary)] hover:underline"
        >
          <Badge variant="default">{label}</Badge>
        </Link>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={String(row.original.status || 'None')} />,
  },
  {
    accessorKey: 'endsAt',
    header: 'Ends',
    cell: ({ row }) => (
      <span className="text-[var(--muted)]">{formatDate(row.original.endsAt)}</span>
    ),
  },
]
