export interface TimelineItem {
  id: string
  at: string
  summary: string
  type?: string
  actorLabel?: string | null
}

export interface TimelineListProps {
  items: TimelineItem[]
  emptyMessage?: string
}

export function TimelineList({ items, emptyMessage = 'No timeline events yet.' }: TimelineListProps) {
  if (!items.length) {
    return <p className="text-sm text-[var(--muted)]">{emptyMessage}</p>
  }

  return (
    <ol className="relative space-y-4 border-l border-[var(--border)] pl-4">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[1.15rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
          <p className="text-sm font-medium">{item.summary}</p>
          <p className="text-xs text-[var(--muted)]">
            {new Date(item.at).toLocaleString()}
            {item.actorLabel ? ` · ${item.actorLabel}` : ''}
            {item.type ? ` · ${item.type}` : ''}
          </p>
        </li>
      ))}
    </ol>
  )
}
