import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createSubscription } from '@/features/subscriptions/api/subscriptions-api'
import { SubscriptionForm } from '@/features/subscriptions/components/subscription-form'
import { listCompanies } from '@/features/companies/api/companies-api'
import { useCompany } from '@/features/companies/hooks/use-company-detail'
import {
  toApiDateTime,
  type SubscriptionFormValues,
} from '@/features/subscriptions/validation/subscription-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/management/page-header'
import { Select } from '@/shared/ui/select'
import { showError, showSuccess } from '@/shared/ui/toast'

export function SubscriptionCreatePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const companyIdFromQuery = params.get('companyId') ?? ''
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyIdFromQuery)
  const companyId = selectedCompanyId || companyIdFromQuery

  const { data: company } = useCompany(companyId)
  const companiesQuery = useQuery({
    queryKey: ['pm', 'companies', 'picker'],
    queryFn: () => listCompanies({ page: 1, pageSize: 100 }),
    enabled: !companyIdFromQuery,
  })

  const mutation = useMutation({
    mutationFn: (values: SubscriptionFormValues) =>
      createSubscription({
        companyId,
        planName: values.planName,
        status: values.status,
        startsAt: toApiDateTime(values.startsAt),
        endsAt: toApiDateTime(values.endsAt, true),
        notes: values.notes?.trim() || undefined,
      }),
    onSuccess: (sub) => {
      void queryClient.invalidateQueries({ queryKey: ['pm', 'subscriptions'] })
      void queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      void queryClient.invalidateQueries({ queryKey: ['pm', 'companies'] })
      showSuccess('Subscription period created')
      navigate(`/subscriptions/${sub.id}?companyId=${companyId}`, { replace: true })
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Create failed'),
  })

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <PageHeader
        title="Create subscription"
        description="Create a subscription period for a company (POST …/subscriptions)."
        breadcrumbs={
          <Link
            to="/subscriptions"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Subscriptions
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Subscription period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!companyIdFromQuery ? (
            <div className="space-y-1.5">
              <label htmlFor="subscription-company" className="text-sm font-medium">
                Company
              </label>
              <Select
                id="subscription-company"
                value={selectedCompanyId}
                onChange={(event) => setSelectedCompanyId(event.target.value)}
              >
                <option value="">Select a company…</option>
                {(companiesQuery.data?.items ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Company
              </p>
              <p className="mt-1 text-sm font-medium">{company?.name ?? 'Loading…'}</p>
            </div>
          )}

          {companyId ? (
            <SubscriptionForm
              companyName={company?.name}
              submitLabel="Create subscription"
              loading={mutation.isPending}
              onCancel={() => navigate('/subscriptions')}
              onSubmit={async (values) => {
                await mutation.mutateAsync(values)
              }}
            />
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Select a company to create a subscription period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
