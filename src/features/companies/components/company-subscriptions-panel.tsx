import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  getSubscriptionStatus,
  listCompanySubscriptions,
} from '@/features/subscriptions/api/subscriptions-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import type { Subscription } from '@/features/subscriptions/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'

interface CompanySubscriptionsPanelProps {
  companyId: string
}

function asList(data: PaginatedResponseOrArray | undefined): Subscription[] {
  if (!data) return []
  return Array.isArray(data) ? data : data.items
}

type PaginatedResponseOrArray = Subscription[] | { items: Subscription[] }

export function CompanySubscriptionsPanel({ companyId }: CompanySubscriptionsPanelProps) {
  const statusQuery = useQuery({
    queryKey: ['pm', 'companies', companyId, 'subscription-status'],
    queryFn: () => getSubscriptionStatus(companyId),
  })

  const { data, isLoading } = useQuery({
    queryKey: companyQueryKeys.subscriptions(companyId),
    queryFn: () => listCompanySubscriptions(companyId),
  })

  const items = asList(data as PaginatedResponseOrArray)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscriptions</CardTitle>
          {statusQuery.data?.subscriptionStatus ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              Operational status:{' '}
              <StatusBadge status={String(statusQuery.data.subscriptionStatus)} />
            </p>
          ) : null}
        </div>
        <Link to={`/subscriptions/new?companyId=${companyId}`}>
          <Button size="sm" variant="outline">
            Create period
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-20 w-full" /> : null}
        {!isLoading && items.length ? (
          <ul className="divide-y divide-[var(--border)]">
            {items.map((sub) => (
              <li key={sub.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <Link
                    to={`/subscriptions/${sub.id}?companyId=${companyId}`}
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    {sub.planName || sub.planCode}
                  </Link>
                  <p className="text-xs text-[var(--muted)]">
                    Ends {new Date(sub.endsAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={String(sub.status)} />
              </li>
            ))}
          </ul>
        ) : null}
        {!isLoading && !items.length ? (
          <p className="text-sm text-[var(--muted)]">No subscription periods for this company.</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
