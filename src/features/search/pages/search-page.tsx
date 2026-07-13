import { useState } from 'react'
import { GlobalSearch } from '@/features/search/components/global-search'
import { useSearch } from '@/features/search/hooks/use-search'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const { data, isFetching } = useSearch(query)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="text-sm text-[var(--muted)]">Find companies, subscriptions, administrators, and more</p>
      </div>

      <GlobalSearch className="max-w-none" />

      <Card>
        <CardHeader>
          <CardTitle>Advanced search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter search query…"
          />
          {query.trim().length >= 2 ? (
            isFetching ? (
              <p className="text-sm text-[var(--muted)]">Searching…</p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {(data ?? []).map((result) => (
                  <li key={`${result.entityType}-${result.entityId}`} className="py-3">
                    <a href={result.deepLink} className="font-medium text-[var(--primary)] hover:underline">
                      {result.title}
                    </a>
                    {result.subtitle ? (
                      <p className="text-sm text-[var(--muted)]">{result.subtitle}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-sm text-[var(--muted)]">Type at least 2 characters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
