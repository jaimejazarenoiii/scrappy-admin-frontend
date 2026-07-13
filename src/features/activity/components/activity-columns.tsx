import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import type { AuditEvent } from '@/features/activity/types'
import { Badge } from '@/shared/ui/badge'

export const activityColumns: ColumnDef<AuditEvent>[] = [
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.action.replace(/\./g, ' · ')}</span>
    ),
  },
  {
    accessorKey: 'actorName',
    header: 'Actor',
  },
  {
    accessorKey: 'targetType',
    header: 'Target',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.targetType} · {row.original.targetId}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'When',
    cell: ({ row }) => (
      <span className="text-[var(--muted)]">
        {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
      </span>
    ),
  },
]
