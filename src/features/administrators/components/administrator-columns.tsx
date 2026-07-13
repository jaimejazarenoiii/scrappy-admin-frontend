import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import type { Administrator } from '@/features/administrators/types'
import { Badge } from '@/shared/ui/badge'

export const administratorColumns: ColumnDef<Administrator>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        to={`/administrators/${row.original.id}`}
        className="font-medium text-[var(--primary)] hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles.map((role) => (
          <Badge key={role} variant="secondary">
            {role.replace(/_/g, ' ')}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last login',
    cell: ({ row }) => (
      <span className="text-[var(--muted)]">
        {row.original.lastLoginAt
          ? formatDistanceToNow(new Date(row.original.lastLoginAt), { addSuffix: true })
          : 'Never'}
      </span>
    ),
  },
]
