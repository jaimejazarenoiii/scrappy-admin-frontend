import { Link } from 'react-router-dom'
import type { SortingState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { companyColumns } from '@/features/companies/components/company-columns'
import { useCompaniesList } from '@/features/companies/hooks/use-companies'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { DataTablePagination } from '@/shared/ui/data-table/data-table-pagination'
import { Input } from '@/shared/ui/input'
import { PageHeader } from '@/shared/ui/management/page-header'
import { EmptyState } from '@/shared/ui/empty-state'

export function CompaniesListPage() {
  const { data, isLoading, isError, refetch, query, setQuery } = useCompaniesList()
  const [sorting, setSorting] = useState<SortingState>([
    { id: query.sort ?? 'registeredAt', desc: query.order !== 'asc' },
  ])

  const syncSort = (next: SortingState) => {
    setSorting(next)
    const s = next[0]
    setQuery({
      sort: s?.id,
      order: s?.desc ? 'desc' : 'asc',
      page: 1,
    })
  }

  const toolbar = useMemo(
    () => (
      <div className="flex flex-wrap gap-2">
        <Input
          value={query.q ?? ''}
          onChange={(event) => setQuery({ q: event.target.value || undefined, page: 1 })}
          placeholder="Search companies…"
          className="max-w-xs"
          aria-label="Search companies"
        />
        <select
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          value={query.status ?? ''}
          onChange={(e) => setQuery({ status: e.target.value || undefined, page: 1 })}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="registered">Registered</option>
          <option value="inactive">Inactive</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>
    ),
    [query.q, query.status, setQuery],
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Companies"
        description="Browse and manage customer organizations"
        actions={
          <Link to="/companies/new">
            <Button>New company</Button>
          </Link>
        }
      />

      {isError ? (
        <EmptyState
          title="Could not load companies"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={companyColumns}
          data={data?.items ?? []}
          loading={isLoading}
          sorting={sorting}
          onSortingChange={(updater) => {
            const next = typeof updater === 'function' ? updater(sorting) : updater
            syncSort(next)
          }}
          toolbar={toolbar}
          pagination={
            data ? (
              <DataTablePagination
                page={query.page ?? 1}
                pageSize={query.pageSize ?? 20}
                total={data.total}
                onPageChange={(page) => setQuery({ page })}
                onPageSizeChange={(pageSize) => setQuery({ pageSize, page: 1 })}
              />
            ) : null
          }
        />
      )}
    </div>
  )
}
