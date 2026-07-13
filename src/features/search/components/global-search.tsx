import { Building2, CreditCard, FileText, Search, Shield, StickyNote, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/features/search/hooks/use-search'
import type { SearchResult } from '@/features/search/types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

const entityIcons = {
  company: Building2,
  user: User,
  subscription: CreditCard,
  administrator: Shield,
  note: StickyNote,
  activity: Search,
  report: FileText,
} as const

interface GlobalSearchProps {
  className?: string
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const { data, isFetching } = useSearch(query)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    navigate(result.deepLink)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn('max-w-md flex-1 justify-start text-[var(--muted)]', className)}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" aria-hidden />
        Search…
        <kbd className="ml-auto hidden rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-elevated"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-label="Global search"
          >
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <Search className="h-4 w-4 text-[var(--muted)]" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search companies, subscriptions, admins…"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {query.trim().length < 2 ? (
                <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                  Type at least 2 characters to search
                </p>
              ) : isFetching ? (
                <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">Searching…</p>
              ) : data?.length ? (
                <ul>
                  {data.map((result) => {
                    const Icon = entityIcons[result.entityType]
                    return (
                      <li key={`${result.entityType}-${result.entityId}`}>
                        <button
                          type="button"
                          onClick={() => handleSelect(result)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{result.title}</p>
                            {result.subtitle ? (
                              <p className="truncate text-xs text-[var(--muted)]">{result.subtitle}</p>
                            ) : null}
                          </div>
                          <span className="ml-auto shrink-0 text-xs capitalize text-[var(--muted)]">
                            {result.entityType}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">No results found</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
