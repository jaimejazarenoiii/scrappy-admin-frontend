import { Moon, Search, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { useThemeStore } from '@/shared/stores/theme-store'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

export interface TopBarProps {
  searchSlot?: ReactNode
  userMenuSlot?: ReactNode
  className?: string
}

export function TopBar({ searchSlot, userMenuSlot, className }: TopBarProps) {
  const { mode, resolved, setMode } = useThemeStore()

  const toggleTheme = () => {
    if (mode === 'system') {
      setMode(resolved === 'dark' ? 'light' : 'dark')
      return
    }
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)]/80 px-5 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {searchSlot ?? (
          <Button variant="outline" size="sm" className="max-w-md flex-1 justify-start text-[var(--muted)]">
            <Search className="mr-2 h-4 w-4" aria-hidden />
            Search companies, users, subscriptions…
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {resolved === 'dark' ? (
            <Sun className="h-4 w-4" aria-hidden />
          ) : (
            <Moon className="h-4 w-4" aria-hidden />
          )}
        </Button>
        {userMenuSlot}
      </div>
    </header>
  )
}
