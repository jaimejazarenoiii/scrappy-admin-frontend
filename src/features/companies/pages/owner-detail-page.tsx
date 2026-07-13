import { Link, useParams } from 'react-router-dom'
import { OwnerSupportActions } from '@/features/companies/components/owner-support-actions'
import {
  useOwner,
  useOwnerActivitySummary,
  useOwnerLoginHistory,
} from '@/features/companies/hooks/use-owners'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { LoginHistoryTable } from '@/shared/ui/management/login-history-table'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { Skeleton } from '@/shared/ui/skeleton'
import { Badge } from '@/shared/ui/badge'

export function OwnerDetailPage() {
  const { id = '' } = useParams()
  const { data: owner, isLoading, error } = useOwner(id)
  const history = useOwnerLoginHistory(id)
  const activity = useOwnerActivitySummary(id)

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (error || !owner) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[var(--muted)]">Owner not found.</p>
        <Link to="/companies">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to={`/companies/${owner.companyId}`}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Company
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{owner.name}</h1>
          <StatusBadge status={owner.status} />
          {owner.locked ? <Badge variant="destructive">locked</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">{owner.email}</p>
      </div>

      <OwnerSupportActions owner={owner} />

      <Card>
        <CardHeader>
          <CardTitle>Login history</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginHistoryTable rows={history.data?.items ?? []} loading={history.isLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity summary</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.data?.recentActions?.length ? (
            <ul className="space-y-2 text-sm">
              {activity.data.recentActions.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
                  <span>{item.summary}</span>
                  <span className="text-[var(--muted)]">{new Date(item.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted)]">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
