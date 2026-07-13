import { useMemo, useState } from 'react'
import type { SortingState } from '@tanstack/react-table'
import { activityColumns } from '@/features/activity/components/activity-columns'
import { useActivity } from '@/features/activity/hooks/use-activity'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { DataTablePagination } from '@/shared/ui/data-table/data-table-pagination'
import { Input } from '@/shared/ui/input'

export function ActivityListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }])

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

  const { data, isLoading } = useActivity(params)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-[var(--muted)]">Immutable audit log of administrative actions</p>
      </div>

      <DataTable
        columns={activityColumns}
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
            placeholder="Filter by action, actor, target…"
            className="max-w-xs"
            aria-label="Filter activity"
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
