import { useMemo, useState } from 'react'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { useLoginHistory } from '@/features/auth/hooks/use-login-history'
import type { LoginHistoryEntry, LoginHistoryResult } from '@/features/auth/types'
import { Badge } from '@/shared/ui/badge'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { DataTablePagination } from '@/shared/ui/data-table/data-table-pagination'
import { Input } from '@/shared/ui/input'

const resultVariant: Record<LoginHistoryResult, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  success: 'default',
  failure: 'destructive',
  locked: 'destructive',
  inactive: 'secondary',
}

const columns: ColumnDef<LoginHistoryEntry>[] = [
  {
    accessorKey: 'loginTime',
    header: 'Time',
    cell: ({ row }) => new Date(row.original.loginTime).toLocaleString(),
  },
  {
    accessorKey: 'administratorEmail',
    header: 'Administrator',
  },
  {
    accessorKey: 'result',
    header: 'Result',
    cell: ({ row }) => (
      <Badge variant={resultVariant[row.original.result]}>{row.original.result}</Badge>
    ),
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP address',
    cell: ({ row }) => row.original.ipAddress ?? '—',
  },
  {
    accessorKey: 'browserDevice',
    header: 'Device',
    cell: ({ row }) => row.original.browserDevice ?? '—',
  },
]

export function LoginHistoryPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'loginTime', desc: true }])

  const sort = sorting[0]
  const params = useMemo(
    () => ({
      page,
      pageSize,
      q: search || undefined,
      sort: sort?.id,
      order: sort?.desc ? ('desc' as const) : ('asc' as const),
    }),
    [page, pageSize, search, sort],
  )

  const { data, isLoading } = useLoginHistory(params)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Login history</h1>
        <p className="text-sm text-[var(--muted)]">
          Recent sign-in attempts for administrator accounts
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Filter by email, IP, or device…"
            className="max-w-xs"
            aria-label="Filter login history"
          />
        }
        pagination={
          data ? (
            <DataTablePagination
              page={page}
              pageSize={pageSize}
              total={data.total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          ) : null
        }
      />
    </div>
  )
}
