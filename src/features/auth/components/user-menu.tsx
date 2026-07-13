import { ChevronDown, History, KeyRound } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { cn } from '@/shared/lib/utils'

export function UserMenu() {
  const admin = useAuthStore((state) => state.admin)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!admin) return null

  const displayName = admin.fullName ?? admin.name
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-semibold text-[var(--accent-foreground)]">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate font-medium md:inline">{displayName}</span>
        <ChevronDown className={cn('h-4 w-4 text-[var(--muted)] transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-elevated"
        >
          <div className="border-b border-[var(--border)] px-3 py-2">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-[var(--muted)]">{admin.email}</p>
          </div>
          <div className="space-y-0.5 p-1">
            <Link
              to="/account/change-password"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--foreground)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              onClick={() => setOpen(false)}
            >
              <KeyRound className="h-4 w-4 text-[var(--muted)]" aria-hidden />
              Change password
            </Link>
            <Link
              to="/security/login-history"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--foreground)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              onClick={() => setOpen(false)}
            >
              <History className="h-4 w-4 text-[var(--muted)]" aria-hidden />
              Login history
            </Link>
            <LogoutButton variant="ghost" className="w-full justify-start" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
