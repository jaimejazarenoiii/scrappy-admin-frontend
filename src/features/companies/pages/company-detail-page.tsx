import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CompanyAccountsPanel } from '@/features/companies/components/company-accounts-panel'
import { CompanyForm } from '@/features/companies/components/company-form'
import { CompanyLifecycleActions } from '@/features/companies/components/company-lifecycle-actions'
import { CompanyNotesPanel } from '@/features/companies/components/company-notes-panel'
import { CompanyOwnersPanel } from '@/features/companies/components/company-owners-panel'
import { CompanyStatisticsPanel } from '@/features/companies/components/company-statistics-panel'
import { CompanySubscriptionsPanel } from '@/features/companies/components/company-subscriptions-panel'
import { CompanyTimelinePanel } from '@/features/companies/components/company-timeline-panel'
import { useCompany } from '@/features/companies/hooks/use-company-detail'
import { useCompanyMutations } from '@/features/companies/hooks/use-company-mutations'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { Skeleton } from '@/shared/ui/skeleton'
import { showError, showSuccess } from '@/shared/ui/toast'
import { cn } from '@/shared/lib/utils'
import { env } from '@/shared/config/env'

const LIVE_TABS = ['overview', 'statistics', 'accounts', 'subscriptions'] as const
const MOCK_TABS = [
  'overview',
  'statistics',
  'accounts',
  'owners',
  'subscriptions',
  'notes',
  'timeline',
] as const

type Tab = (typeof MOCK_TABS)[number]

export function CompanyDetailPage() {
  const { id = '' } = useParams()
  const { data: company, isLoading, error } = useCompany(id)
  const { update } = useCompanyMutations()
  const tabs = env.useMock ? MOCK_TABS : LIVE_TABS
  const [tab, setTab] = useState<Tab>('overview')
  const [editing, setEditing] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[var(--muted)]">Company not found.</p>
        <Link to="/companies">
          <Button variant="outline">Back to companies</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/companies" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Companies
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
            <StatusBadge status={String(company.status)} />
            {company.subscriptionStatus ? (
              <StatusBadge status={String(company.subscriptionStatus)} />
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {company.email ?? 'No email'}
            {company.contactNumber ? ` · ${company.contactNumber}` : ''}
            {!env.useMock ? ' · live admin API' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {env.useMock ? (
            <>
              <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                {editing ? 'Close editor' : 'Edit'}
              </Button>
              <CompanyLifecycleActions company={company} />
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[var(--border)] pb-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm capitalize',
              tab === item
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5',
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing && env.useMock ? (
              <CompanyForm
                defaultValues={{
                  name: company.name,
                  email: company.email ?? company.metadata?.contactEmail ?? '',
                  contactNumber: company.contactNumber ?? '',
                  address: company.address ?? '',
                }}
                loading={update.isPending}
                submitLabel="Save changes"
                onCancel={() => setEditing(false)}
                onSubmit={async (values) => {
                  try {
                    await update.mutateAsync({
                      id: company.id,
                      input: {
                        name: values.name,
                        email: values.email || undefined,
                        contactNumber: values.contactNumber || undefined,
                        address: values.address || undefined,
                      },
                    })
                    showSuccess('Company updated')
                    setEditing(false)
                  } catch (err) {
                    showError(err instanceof Error ? err.message : 'Update failed')
                  }
                }}
              />
            ) : (
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-[var(--muted)]">Status</dt>
                  <dd className="font-medium capitalize">{company.status}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Subscription status</dt>
                  <dd className="font-medium">{company.subscriptionStatus ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Email</dt>
                  <dd className="font-medium">{company.email ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Contact</dt>
                  <dd className="font-medium">{company.contactNumber ?? '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[var(--muted)]">Address</dt>
                  <dd className="font-medium">{company.address ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Registered</dt>
                  <dd className="font-medium">
                    {new Date(company.registeredAt ?? company.createdAt ?? Date.now()).toLocaleString()}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
      ) : null}

      {tab === 'statistics' ? <CompanyStatisticsPanel companyId={company.id} /> : null}
      {tab === 'accounts' ? <CompanyAccountsPanel companyId={company.id} /> : null}
      {tab === 'owners' && env.useMock ? <CompanyOwnersPanel companyId={company.id} /> : null}
      {tab === 'subscriptions' ? <CompanySubscriptionsPanel companyId={company.id} /> : null}
      {tab === 'notes' && env.useMock ? <CompanyNotesPanel companyId={company.id} /> : null}
      {tab === 'timeline' && env.useMock ? <CompanyTimelinePanel companyId={company.id} /> : null}
    </div>
  )
}
