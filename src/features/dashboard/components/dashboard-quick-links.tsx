import { useNavigate } from 'react-router-dom'
import { useQuickActions } from '@/features/dashboard/hooks/use-quick-actions'
import { getQuickActionRoute } from '@/features/dashboard/lib/quick-action-routes'
import { Skeleton } from '@/shared/ui/skeleton'

/** Inline quick links for the dashboard header — not a card grid. */
export function DashboardQuickLinks() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuickActions()

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  const actions = data ?? []
  if (!actions.length) return null

  return (
    <nav aria-label="Quick actions" className="flex flex-wrap items-center gap-1.5">
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={() => navigate(getQuickActionRoute(action.key, action.destination))}
          className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors duration-200 hover:border-[var(--primary)]/35 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          {action.label}
        </button>
      ))}
    </nav>
  )
}
