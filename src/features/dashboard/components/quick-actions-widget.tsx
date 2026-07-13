import type { ReactNode } from 'react'
import {
  Activity,
  Building2,
  CreditCard,
  FileText,
  Plus,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuickActions } from '@/features/dashboard/hooks/use-quick-actions'
import { getQuickActionRoute } from '@/features/dashboard/lib/quick-action-routes'
import { WidgetFrame } from '@/shared/ui/widgets/widget-frame'
import { cn } from '@/shared/lib/utils'

const ICON_MAP: Record<string, ReactNode> = {
  building: <Building2 className="h-5 w-5" />,
  'credit-card': <CreditCard className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  'file-text': <FileText className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
  plus: <Plus className="h-5 w-5" />,
}

export function QuickActionsWidget() {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch } = useQuickActions()

  return (
    <WidgetFrame
      title="Quick actions"
      description="Navigate to admin modules — no writes from dashboard"
      loading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => void refetch()}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => navigate(getQuickActionRoute(action.key, `/${action.destination}`))}
            className={cn(
              'flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 text-left',
              'transition-colors hover:border-[var(--primary)]/30 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)]">
              {ICON_MAP[action.iconKey ?? 'building'] ?? <Building2 className="h-5 w-5" />}
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </WidgetFrame>
  )
}
