import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { planLabel, type Subscription } from '@/features/subscriptions/types'
import { Badge } from '@/shared/ui/badge'
import { StatusBadge } from '@/shared/ui/management/status-badge'

function subscriptionHref(row: Subscription): string {
  if (row.id.startsWith('status-')) {
    return `/companies/${row.companyId}`
  }
  return `/subscriptions/${row.id}?companyId=${row.companyId}`
}

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'companyName',
    header: 'Company',
    cell: ({ row }) => (
      <Link
        to={subscriptionHref(row.original)}
        className="font-medium text-[var(--primary)] hover:underline"
      >
        {row.original.companyName}
      </Link>
    ),
  },
  {
    accessorKey: 'planName',
    header: 'Plan',
    cell: ({ row }) => <Badge variant="default">{planLabel(row.original)}</Badge>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={String(row.original.status)} />,
  },
  {
    accessorKey: 'endsAt',
    header: 'Ends',
    cell: ({ row }) => {
      const endsAt = row.original.endsAt
      const invalid = !endsAt || endsAt === new Date(0).toISOString()
      return (
        <span className="text-[var(--muted)]">
          {invalid ? '—' : format(new Date(endsAt), 'MMM d, yyyy')}
        </span>
      )
    },
  },
]
