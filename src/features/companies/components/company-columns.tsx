import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import type { Company } from '@/features/companies/types'
import { StatusBadge } from '@/shared/ui/management/status-badge'

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: 'Company',
    cell: ({ row }) => (
      <Link to={`/companies/${row.original.id}`} className="font-medium text-[var(--primary)] hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={String(row.original.status)} />,
  },
  {
    id: 'subscriptionStatus',
    header: 'Subscription',
    cell: ({ row }) =>
      row.original.subscriptionStatus ? (
        <StatusBadge status={String(row.original.subscriptionStatus)} />
      ) : (
        <span className="text-[var(--muted)]">—</span>
      ),
  },
  {
    accessorKey: 'userCount',
    header: 'Users',
    cell: ({ row }) => <span className="font-mono-value">{row.original.userCount ?? '—'}</span>,
  },
  {
    accessorKey: 'registeredAt',
    header: 'Registered',
    cell: ({ row }) => {
      const at = row.original.registeredAt ?? row.original.createdAt
      return (
        <span className="text-[var(--muted)]">
          {at ? formatDistanceToNow(new Date(at), { addSuffix: true }) : '—'}
        </span>
      )
    },
  },
]
