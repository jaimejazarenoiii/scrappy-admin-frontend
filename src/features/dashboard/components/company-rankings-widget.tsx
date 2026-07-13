import { Link } from 'react-router-dom'
import { useCompanyRankings } from '@/features/dashboard/hooks/use-company-rankings'
import type { CompanyRankItem } from '@/features/dashboard/types'
import { RankingsBarChart } from '@/shared/ui/charts'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'

const RANKING_SECTIONS = [
  { key: 'mostActive', title: 'Most active' },
  { key: 'leastActive', title: 'Least active' },
  { key: 'newest', title: 'Newest' },
  { key: 'mostUsers', title: 'Most users' },
  { key: 'highestTransactionVolume', title: 'Highest transaction volume' },
] as const

export function CompanyRankingsWidget() {
  const { data, isLoading, error, refetch } = useCompanyRankings()

  return (
    <WidgetFrame
      title="Company rankings"
      description="Five ranking lists with admin deep-links"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link to="/companies" className="text-sm font-medium text-[var(--primary)] hover:underline">
          View all
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {RANKING_SECTIONS.map((section) => {
          const items = (data?.[section.key] ?? []) as CompanyRankItem[]
          const chartData = items.map((item) => ({ name: item.name, score: item.value }))

          return (
            <div key={section.key} className="space-y-3">
              <p className="text-sm font-semibold">{section.title}</p>
              {items.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No data</p>
              ) : (
                <>
                  <RankingsBarChart data={chartData} className="!h-[180px]" />
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.companyId}>
                        <Link
                          to={`/companies/${item.companyId}`}
                          className="flex items-center justify-between rounded-lg px-2 py-1 text-sm transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                        >
                          <span className="truncate font-medium">{item.name}</span>
                          <span className="font-mono-value text-xs text-[var(--muted)]">
                            {item.value.toLocaleString()}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )
        })}
      </div>
    </WidgetFrame>
  )
}
