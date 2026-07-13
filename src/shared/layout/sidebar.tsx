import {
  Activity,
  Building2,
  CreditCard,
  Download,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  Shield,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { env } from '@/shared/config/env'
import { isMockOnlyPath } from '@/shared/config/live-admin-features'
import { useSidebarStore } from '@/shared/stores/sidebar-store'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/administrators', label: 'Administrators', icon: Shield },
  { to: '/security/login-history', label: 'Login History', icon: History },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/exports', label: 'Exports', icon: Download },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  const collapsed = useSidebarStore((state) => state.collapsed)
  const toggle = useSidebarStore((state) => state.toggle)
  const items = env.useMock ? navItems : navItems.filter((item) => !isMockOnlyPath(item.to))

  return (
    <aside
      className={cn(
        'glass-sidebar sticky top-0 flex h-screen shrink-0 flex-col transition-[width] duration-300',
        collapsed ? 'w-[72px]' : 'w-60',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
        {!collapsed ? (
          <div>
            <p className="text-sm font-semibold tracking-tight">Scrappy Admin</p>
            <p className="text-xs text-[var(--muted)]">Console</p>
          </div>
        ) : (
          <span className="mx-auto text-sm font-bold text-[var(--primary)]">S</span>
        )}
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/8"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-xs font-medium">{collapsed ? '»' : '«'}</span>
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'text-[var(--muted)] hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.06]',
                collapsed && 'justify-center px-2',
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
