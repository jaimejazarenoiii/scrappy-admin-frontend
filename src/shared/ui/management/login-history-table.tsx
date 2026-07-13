import { DataTable } from '@/shared/ui/data-table/data-table'
import type { ColumnDef } from '@tanstack/react-table'

export interface LoginHistoryRow {
  id: string
  at: string
  success: boolean
  result?: string
  ip?: string | null
  userAgent?: string | null
}

const columns: ColumnDef<LoginHistoryRow>[] = [
  {
    accessorKey: 'at',
    header: 'Time',
    cell: ({ row }) => new Date(row.original.at).toLocaleString(),
  },
  {
    id: 'result',
    header: 'Result',
    cell: ({ row }) =>
      row.original.result ?? (row.original.success ? 'success' : 'failure'),
  },
  {
    accessorKey: 'ip',
    header: 'IP',
    cell: ({ row }) => row.original.ip ?? '—',
  },
  {
    accessorKey: 'userAgent',
    header: 'Device',
    cell: ({ row }) => row.original.userAgent ?? '—',
  },
]

export interface LoginHistoryTableProps {
  rows: LoginHistoryRow[]
  loading?: boolean
}

export function LoginHistoryTable({ rows, loading }: LoginHistoryTableProps) {
  return <DataTable columns={columns} data={rows} loading={loading} />
}
