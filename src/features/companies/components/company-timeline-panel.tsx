import { useCompanyTimeline } from '@/features/companies/hooks/use-company-detail'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { TimelineList } from '@/shared/ui/management/timeline-list'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'

interface CompanyTimelinePanelProps {
  companyId: string
}

export function CompanyTimelinePanel({ companyId }: CompanyTimelinePanelProps) {
  const { data, isLoading, isError, refetch } = useCompanyTimeline(companyId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-32 w-full" /> : null}
        {isError ? (
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted)]">Failed to load timeline.</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : null}
        {!isLoading && !isError ? <TimelineList items={data ?? []} /> : null}
      </CardContent>
    </Card>
  )
}
