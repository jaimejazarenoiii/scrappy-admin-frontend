import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'
import { MetricStrip } from '@/shared/ui/widgets/metric-strip'

export function PlatformOverviewWidget() {
  const { data, isLoading, error, refetch } = useDashboardSummary()

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 px-5 py-4 text-center">
        <p className="text-sm">{error instanceof Error ? error.message : 'Failed to load overview'}</p>
        <button
          type="button"
          className="mt-2 cursor-pointer text-sm font-medium text-[var(--primary)] hover:underline"
          onClick={() => void refetch()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <MetricStrip
      loading={isLoading}
      items={[
        { key: 'total', label: 'Companies', value: data?.total ?? '—' },
        {
          key: 'active',
          label: 'Active',
          value: data?.active ?? '—',
          tone: 'success',
        },
        { key: 'trial', label: 'Trial', value: data?.trial ?? '—' },
        {
          key: 'grace',
          label: 'Grace',
          value: data?.gracePeriod ?? '—',
          tone: 'warning',
        },
        {
          key: 'expired',
          label: 'Expired',
          value: data?.expired ?? '—',
          tone: 'danger',
        },
        {
          key: 'suspended',
          label: 'Suspended',
          value: data?.suspended ?? '—',
          tone: 'danger',
        },
        {
          key: 'today',
          label: 'New today',
          value: data?.newCompaniesToday ?? '—',
        },
        {
          key: 'month',
          label: 'New this month',
          value: data?.newCompaniesThisMonth ?? '—',
        },
      ]}
    />
  )
}
