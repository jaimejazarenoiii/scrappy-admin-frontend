import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  getSubscription,
  updateSubscription,
} from '@/features/subscriptions/api/subscriptions-api'
import { SubscriptionForm } from '@/features/subscriptions/components/subscription-form'
import { SubscriptionLifecycleActions } from '@/features/subscriptions/components/subscription-lifecycle-actions'
import { planLabel } from '@/features/subscriptions/types'
import {
  toApiDateTime,
  type SubscriptionFormValues,
} from '@/features/subscriptions/validation/subscription-schema'
import { useCompany } from '@/features/companies/hooks/use-company-detail'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/management/page-header'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { showError, showSuccess } from '@/shared/ui/toast'
import { useState } from 'react'

function displayText(value?: string | null): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : 'None'
}

function displayDate(value?: string | null): string {
  if (!value?.trim()) return 'None'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'None'
  return format(date, 'PPP p')
}

function toDateInput(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function SubscriptionDetailPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const companyIdParam = params.get('companyId') ?? ''
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const isStatusOnly = id.startsWith('status-')

  const { data: sub, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pm', 'subscriptions', 'detail', id, companyIdParam],
    queryFn: () => getSubscription(id, companyIdParam || undefined),
    enabled: Boolean(id) && !isStatusOnly,
  })

  const companyId = sub?.companyId || companyIdParam
  const { data: company } = useCompany(companyId)

  const updateMutation = useMutation({
    mutationFn: (values: SubscriptionFormValues) =>
      updateSubscription(companyId, id, {
        planName: values.planName,
        status: values.status,
        startsAt: toApiDateTime(values.startsAt),
        endsAt: toApiDateTime(values.endsAt, true),
        notes: values.notes?.trim() ? values.notes.trim() : null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pm', 'subscriptions'] })
      void queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      void queryClient.invalidateQueries({ queryKey: ['pm', 'companies'] })
      setEditing(false)
      showSuccess('Subscription updated')
    },
    onError: (err) => showError(err instanceof Error ? err.message : 'Update failed'),
  })

  if (isStatusOnly) {
    const inferredCompanyId = id.replace(/^status-/, '') || companyIdParam
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <PageHeader
          title="No subscription period"
          description="This company has entitlement status only — there is no period record to view."
          breadcrumbs={
            <Link
              to={inferredCompanyId ? `/companies/${inferredCompanyId}` : '/subscriptions'}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              ← Back
            </Link>
          }
        />
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm text-[var(--muted)]">
            <p>Plan: None</p>
            <p>Period: None</p>
            <p>Notes: None</p>
            {inferredCompanyId ? (
              <Link
                to={`/companies/${inferredCompanyId}`}
                className="inline-flex text-[var(--primary)] hover:underline"
              >
                Open company → create a subscription period
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--muted)]">Loading subscription…</p>
  }

  if (isError || !sub) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-700">
          {error instanceof Error ? error.message : 'Subscription not found'}
        </p>
        <button type="button" className="text-sm text-[var(--primary)]" onClick={() => void refetch()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title={planLabel(sub) || 'Subscription period'}
        description="Period details, notes, and lifecycle actions for this company."
        breadcrumbs={
          <Link
            to={companyId ? `/companies/${companyId}` : '/subscriptions'}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← {company?.name ?? sub.companyName ?? 'Company'}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle>Details</CardTitle>
          {!editing ? (
            <button
              type="button"
              className="text-sm font-medium text-[var(--primary)] hover:underline"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          ) : null}
        </CardHeader>
        <CardContent>
          {editing ? (
            <SubscriptionForm
              companyName={company?.name ?? sub.companyName}
              submitLabel="Save changes"
              loading={updateMutation.isPending}
              defaultValues={{
                planName: planLabel(sub) || '',
                status: (sub.status === 'PENDING' || sub.status === 'ACTIVE'
                  ? sub.status
                  : 'PENDING') as 'PENDING' | 'ACTIVE',
                startsAt: toDateInput(sub.startsAt),
                endsAt: toDateInput(sub.endsAt),
                notes: sub.notes ?? '',
              }}
              onCancel={() => setEditing(false)}
              onSubmit={async (values) => {
                await updateMutation.mutateAsync(values)
              }}
            />
          ) : (
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">Company</dt>
                <dd className="mt-0.5 font-medium">
                  {companyId ? (
                    <Link to={`/companies/${companyId}`} className="text-[var(--primary)] hover:underline">
                      {displayText(company?.name ?? sub.companyName)}
                    </Link>
                  ) : (
                    displayText(sub.companyName)
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Plan</dt>
                <dd className="mt-0.5 font-medium">{displayText(planLabel(sub))}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Status</dt>
                <dd className="mt-0.5">
                  <StatusBadge status={String(sub.status || 'None')} />
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Subscription ID</dt>
                <dd className="mt-0.5 font-mono text-xs">{displayText(sub.id)}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Starts at</dt>
                <dd className="mt-0.5 font-medium">{displayDate(sub.startsAt)}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Ends at</dt>
                <dd className="mt-0.5 font-medium">{displayDate(sub.endsAt)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--muted)]">Notes</dt>
                <dd className="mt-0.5 whitespace-pre-wrap font-medium">{displayText(sub.notes)}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      {!editing && companyId ? (
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionLifecycleActions subscription={sub} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
