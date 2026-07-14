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

function subscriptionHref(sub: Subscription): string {
  return `/subscriptions/${sub.id}?companyId=${sub.companyId}`
}

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'planName',
    header: 'Plan',
    cell: ({ row }) => {
      const sub = row.original
      const label = planLabel(sub) || 'Untitled'
      return (
        <Link
          to={subscriptionHref(sub)}
          className="font-medium text-[var(--primary)] hover:underline"
        >
          <Badge variant="default">{label}</Badge>
        </Link>
      )
    },
  },
  {
    accessorKey: 'companyName',
    header: 'Company',
    cell: ({ row }) => (
      <span className="font-medium text-[var(--foreground)]">
        {row.original.companyName || 'None'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={String(row.original.status || 'None')} />,
  },
  {
    accessorKey: 'startsAt',
    header: 'Starts',
    cell: ({ row }) => (
      <span className="text-[var(--muted)]">{formatDate(row.original.startsAt)}</span>
    ),
  },
  {
    accessorKey: 'endsAt',
    header: 'Ends',
    cell: ({ row }) => (
      <span className="text-[var(--muted)]">{formatDate(row.original.endsAt)}</span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to={subscriptionHref(row.original)}
        className="text-sm font-medium text-[var(--primary)] hover:underline"
      >
        View / edit
      </Link>
    ),
  },
]
