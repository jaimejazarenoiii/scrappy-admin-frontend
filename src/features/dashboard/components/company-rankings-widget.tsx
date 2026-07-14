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
      title="Rankings"
      description="Top companies by activity signals"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
      action={
        <Link
          to="/companies"
          className="cursor-pointer text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View all
        </Link>
      }
    >
      <div className="space-y-5">
        {RANKING_SECTIONS.slice(0, 3).map((section) => {
          const items = (data?.[section.key] ?? []) as CompanyRankItem[]
          const chartData = items.map((item) => ({ name: item.name, score: item.value }))

          return (
            <div key={section.key} className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                {section.title}
              </p>
              {items.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No data</p>
              ) : (
                <>
                  <RankingsBarChart data={chartData} className="!h-[140px]" />
                  <ul className="divide-y divide-[var(--border)]">
                    {items.slice(0, 5).map((item) => (
                      <li key={item.companyId}>
                        <Link
                          to={`/companies/${item.companyId}`}
                          className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm transition-colors hover:text-[var(--primary)]"
                        >
                          <span className="truncate font-medium">{item.name}</span>
                          <span className="font-mono-value text-xs tabular-nums text-[var(--muted)]">
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
