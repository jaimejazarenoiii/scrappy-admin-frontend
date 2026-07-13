import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { getCompanyStatistics } from '@/features/companies/api/companies-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

interface CompanyStatisticsPanelProps {
  companyId: string
}

export function CompanyStatisticsPanel({ companyId }: CompanyStatisticsPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['companies', companyId, 'statistics'],
    queryFn: () => getCompanyStatistics(companyId),
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const stats = [
    { label: 'Transactions', value: data?.transactionVolume ?? 0 },
    { label: 'Trips', value: data?.tripVolume ?? 0 },
    { label: 'Expenses', value: data?.expenseVolume ?? 0 },
    { label: 'Active users', value: data?.activeUsers ?? 0 },
    {
      label: 'Last activity',
      value: data?.lastActivityAt
        ? formatDistanceToNow(new Date(data.lastActivityAt), { addSuffix: true })
        : 'No activity',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{stat.label}</p>
            <p className="mt-1 font-mono-value text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
