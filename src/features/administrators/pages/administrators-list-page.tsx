import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SortingState } from '@tanstack/react-table'
import { administratorColumns } from '@/features/administrators/components/administrator-columns'
import { useAdministrators } from '@/features/administrators/hooks/use-administrators'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { hasRole } from '@/shared/lib/rbac'
import { Button } from '@/shared/ui/button'
import { DataTable } from '@/shared/ui/data-table/data-table'
import { DataTablePagination } from '@/shared/ui/data-table/data-table-pagination'
import { Input } from '@/shared/ui/input'

export function AdministratorsListPage() {
  const admin = useAuthStore((state) => state.admin)
  const canCreate = admin ? hasRole(admin.roles, 'super_admin') : false
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])

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

  const { data, isLoading } = useAdministrators(params)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Administrators</h1>
          <p className="text-sm text-[var(--muted)]">Manage internal admin accounts and RBAC</p>
        </div>
        {canCreate ? (
          <Link to="/administrators/new">
            <Button>Add administrator</Button>
          </Link>
        ) : null}
      </div>

      <DataTable
        columns={administratorColumns}
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
            placeholder="Search administrators…"
            className="max-w-xs"
            aria-label="Search administrators"
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
