import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { showError } from '@/shared/ui/toast'

export interface NotesComposerProps {
  onSubmit: (body: string) => Promise<void> | void
  placeholder?: string
  disabled?: boolean
  label?: string
}

export function NotesComposer({
  onSubmit,
  placeholder = 'Add an internal note…',
  disabled,
  label = 'Internal note (private to Scrappy administrators)',
}: NotesComposerProps) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <form
      className="space-y-2"
      onSubmit={async (event) => {
        event.preventDefault()
        const trimmed = body.trim()
        if (!trimmed) return
        setLoading(true)
        try {
          await onSubmit(trimmed)
          setBody('')
        } catch (error) {
          showError(error instanceof Error ? error.message : 'Failed to save note')
        } finally {
          setLoading(false)
        }
      }}
    >
      <label className="block text-xs font-medium text-[var(--muted)]" htmlFor="notes-composer">
        {label}
      </label>
      <textarea
        id="notes-composer"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={3}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      />
      <Button type="submit" size="sm" disabled={disabled || loading || !body.trim()}>
        {loading ? 'Saving…' : 'Add note'}
      </Button>
    </form>
  )
}
