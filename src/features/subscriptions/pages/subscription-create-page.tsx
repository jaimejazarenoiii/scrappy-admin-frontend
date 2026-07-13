import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubscription } from '@/features/subscriptions/api/subscriptions-api'
import { SubscriptionForm } from '@/features/subscriptions/components/subscription-form'
import { useCompany } from '@/features/companies/hooks/use-company-detail'
import {
  toApiDateTime,
  type SubscriptionFormValues,
} from '@/features/subscriptions/validation/subscription-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/management/page-header'
import { showError, showSuccess } from '@/shared/ui/toast'

export function SubscriptionCreatePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const companyId = params.get('companyId') ?? ''
  const { data: company } = useCompany(companyId)

  const mutation = useMutation({
    mutationFn: (values: SubscriptionFormValues) =>
      createSubscription({
        companyId,
        planName: values.planName,
        status: values.status,
        startsAt: toApiDateTime(values.startsAt),
        endsAt: toApiDateTime(values.endsAt, true),
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

  if (!companyId) {
    return (
      <div className="mx-auto max-w-xl space-y-5">
        <PageHeader
          title="Create subscription"
          description="Open this form from a company to create a subscription period."
          breadcrumbs={
            <Link to="/companies" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              ← Companies
            </Link>
          }
        />
        <p className="text-sm text-[var(--muted)]">
          Company context is missing. Go to a company → Subscriptions → Create period.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <PageHeader
        title="Create subscription"
        description="Set plan, entitlement status, and period dates for this company."
        breadcrumbs={
          <Link
            to={`/companies/${companyId}`}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← {company?.name ?? 'Company'}
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Subscription period</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionForm
            companyName={company?.name}
            submitLabel="Create subscription"
            loading={mutation.isPending}
            onCancel={() => navigate(`/companies/${companyId}`)}
            onSubmit={async (values) => {
              await mutation.mutateAsync(values)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
