import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchReport } from '@/features/reports/api/reports-api'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

const AVAILABLE_REPORTS = [
  { key: 'monthly-growth', title: 'Monthly Growth Report', description: 'Company and user growth summary' },
  { key: 'subscription-health', title: 'Subscription Health', description: 'Renewals, suspensions, and expirations' },
  { key: 'platform-usage', title: 'Platform Usage', description: 'API volume and performance overview' },
]

export function ReportsPage() {
  const { reportKey } = useParams()

  if (reportKey) {
    return <ReportDetail reportKey={reportKey} />
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-[var(--muted)]">Generated operational and executive summaries</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AVAILABLE_REPORTS.map((report) => (
          <Link key={report.key} to={`/reports/${report.key}`}>
            <Card className="h-full transition-shadow hover:shadow-elevated">
              <CardHeader>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ReportDetail({ reportKey }: { reportKey: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reports', reportKey],
    queryFn: () => fetchReport(reportKey),
  })

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />
  }

  if (error || !data) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[var(--muted)]">Report not found.</p>
        <Link to="/reports">
          <Button variant="outline">Back to reports</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link to="/reports" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Reports
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{data.title}</h1>
        <p className="text-sm text-[var(--muted)]">
          Generated {format(new Date(data.generatedAt), 'PPP p')}
        </p>
      </div>

      {data.sections.map((section) => (
        <Card key={section.heading}>
          <CardHeader>
            <CardTitle>{section.heading}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">{section.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
