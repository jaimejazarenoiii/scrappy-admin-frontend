import { useSearchParams } from 'react-router-dom'
import { resolveGranularity } from '@/features/dashboard/lib/filter-url'
import { useDashboardFilterStore } from '@/features/dashboard/store/filter-store'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const SUBSCRIPTION_STATUSES = [
  { value: '', label: 'All subscriptions' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' },
  { value: 'trial', label: 'Trial' },
]

const COMPANY_STATUSES = [
  { value: '', label: 'All companies' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'grace_period', label: 'Grace period' },
  { value: 'expired', label: 'Expired' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'registered', label: 'Registered' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'deactivated', label: 'Deactivated' },
]

export function DashboardFilterBar() {
  const [, setSearchParams] = useSearchParams()
  const draft = useDashboardFilterStore((state) => state.draft)
  const validationErrors = useDashboardFilterStore((state) => state.validationErrors)
  const setDraft = useDashboardFilterStore((state) => state.setDraft)
  const applyDraft = useDashboardFilterStore((state) => state.applyDraft)
  const reset = useDashboardFilterStore((state) => state.reset)

  const handleApply = () => {
    const result = applyDraft()
    if (result.success && result.searchParams) {
      setSearchParams(result.searchParams, { replace: true })
    }
  }

  const handleReset = () => {
    const { searchParams } = reset()
    setSearchParams(searchParams, { replace: true })
  }

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const nextFrom = field === 'from' ? value || null : draft.from
    const nextTo = field === 'to' ? value || null : draft.to
    setDraft({
      [field]: value || null,
      granularity: resolveGranularity(nextFrom, nextTo),
    })
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Scope
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor="filter-from">From</Label>
          <Input
            id="filter-from"
            type="date"
            value={draft.from ?? ''}
            onChange={(event) => handleDateChange('from', event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-to">To</Label>
          <Input
            id="filter-to"
            type="date"
            value={draft.to ?? ''}
            onChange={(event) => handleDateChange('to', event.target.value)}
            aria-invalid={Boolean(validationErrors.to)}
          />
          {validationErrors.to ? (
            <p className="text-xs text-[var(--destructive)]">{validationErrors.to}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-subscription">Subscription status</Label>
          <select
            id="filter-subscription"
            className="flex h-10 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm"
            value={draft.subscriptionStatus ?? ''}
            onChange={(event) =>
              setDraft({ subscriptionStatus: event.target.value || null })
            }
          >
            {SUBSCRIPTION_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-company-status">Company status</Label>
          <select
            id="filter-company-status"
            className="flex h-10 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm"
            value={draft.companyStatus ?? ''}
            onChange={(event) => setDraft({ companyStatus: event.target.value || null })}
          >
            {COMPANY_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-company-id">Company ID</Label>
          <Input
            id="filter-company-id"
            placeholder="e.g. co-1001"
            value={draft.companyId ?? ''}
            onChange={(event) => setDraft({ companyId: event.target.value || null })}
            aria-invalid={Boolean(validationErrors.companyId)}
          />
          {validationErrors.companyId ? (
            <p className="text-xs text-[var(--destructive)]">{validationErrors.companyId}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
