import {
  AlertTriangle,
  Building2,
  Clock,
  PauseCircle,
  Sparkles,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'
import { SummaryCard } from '@/shared/ui/widgets/summary-card'

export function PlatformOverviewWidget() {
  const { data, isLoading, error, refetch } = useDashboardSummary()

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-6 text-center">
        <p className="text-sm">{error instanceof Error ? error.message : 'Failed to load overview'}</p>
        <button
          type="button"
          className="mt-2 text-sm font-medium text-[var(--primary)]"
          onClick={() => void refetch()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      <SummaryCard
        label="Total companies"
        value={data?.total ?? '—'}
        icon={<Building2 className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="Active"
        value={data?.active ?? '—'}
        icon={<TrendingUp className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="Trial"
        value={data?.trial ?? '—'}
        icon={<Sparkles className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="Grace period"
        value={data?.gracePeriod ?? '—'}
        icon={<Clock className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="Expired"
        value={data?.expired ?? '—'}
        icon={<XCircle className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="Suspended"
        value={data?.suspended ?? '—'}
        icon={<PauseCircle className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="New today"
        value={data?.newCompaniesToday ?? '—'}
        icon={<Sparkles className="h-5 w-5" />}
        loading={isLoading}
      />
      <SummaryCard
        label="New this month"
        value={data?.newCompaniesThisMonth ?? '—'}
        delta="Company registrations"
        icon={<AlertTriangle className="h-5 w-5" />}
        loading={isLoading}
      />
    </div>
  )
}
