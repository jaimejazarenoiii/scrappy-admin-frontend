import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SortingState } from '@tanstack/react-table'
import { subscriptionColumns } from '@/features/subscriptions/components/subscription-columns'
import { useSubscriptions } from '@/features/subscriptions/hooks/use-subscriptions'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { DataTablePagination } from '@/shared/ui/data-table/data-table-pagination'
import { Input } from '@/shared/ui/input'

export function SubscriptionsListPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'endsAt', desc: true }])

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

  const { data, isLoading } = useSubscriptions(params)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-[var(--muted)]">
            All subscription periods across companies. Open a row to view or edit (PATCH), renew,
            expire, or suspend.
          </p>
        </div>
        <Link to="/subscriptions/new">
          <Button size="sm">Create subscription</Button>
        </Link>
      </div>

      <DataTable
        columns={subscriptionColumns}
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
            placeholder="Search plan, company, status…"
            className="max-w-xs"
            aria-label="Search subscriptions"
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
