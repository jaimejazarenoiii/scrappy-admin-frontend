import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getCompanyStatistics } from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

interface CompanyStatisticsPanelProps {
  companyId: string
}

const pesos = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 2,
})

const PERIOD_LABELS: Record<string, string> = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  THIS_WEEK: 'This week',
  THIS_MONTH: 'This month',
  THIS_YEAR: 'This year',
  CUSTOM: 'Custom range',
}

function periodCaption(
  period: string | null,
  from: string | null,
  to: string | null,
): string {
  const label = period ? (PERIOD_LABELS[period] ?? period) : 'This month'
  const fromDate = from ? new Date(from) : null
  const toDate = to ? new Date(to) : null
  if (fromDate && toDate && !Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())) {
    return `${label} · ${format(fromDate, 'MMM d')} – ${format(toDate, 'MMM d, yyyy')}`
  }
  return label
}

export function CompanyStatisticsPanel({ companyId }: CompanyStatisticsPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: companyQueryKeys.statistics(companyId),
    queryFn: () => getCompanyStatistics(companyId),
  })

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const totalTransactions = data.totalInboundTransactions + data.totalOutboundTransactions

  const stats: { label: string; value: string; hint?: string }[] = [
    {
      label: 'Transactions',
      value: String(totalTransactions),
      hint: `${data.totalInboundTransactions} buy · ${data.totalOutboundTransactions} sell`,
    },
    {
      label: 'Transaction amount',
      value: pesos.format(data.totalTransactionAmount),
      hint: `In ${pesos.format(data.inboundAmount)} · Out ${pesos.format(data.outboundAmount)}`,
    },
    { label: 'Expenses', value: pesos.format(data.totalExpenses) },
    { label: 'Payroll', value: pesos.format(data.totalPayroll) },
    { label: 'Net operational', value: pesos.format(data.netOperationalAmount) },
    { label: 'Active employees', value: String(data.activeEmployees) },
    { label: 'Active trips', value: String(data.activeTrips), hint: 'Currently started' },
    { label: 'Active vehicles', value: String(data.activeVehicles) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <p className="text-sm text-[var(--muted)]">
          {periodCaption(data.period, data.periodFrom, data.periodTo)}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-1 font-mono-value text-xl font-semibold">{stat.value}</p>
            {stat.hint ? <p className="mt-0.5 text-xs text-[var(--muted)]">{stat.hint}</p> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
