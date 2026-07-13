import { useCompanyNotes } from '@/features/companies/hooks/use-company-detail'
import { useCompanyMutations } from '@/features/companies/hooks/use-company-mutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { NotesComposer } from '@/shared/ui/management/notes-composer'
import { Skeleton } from '@/shared/ui/skeleton'
import { showSuccess } from '@/shared/ui/toast'
import { formatDistanceToNow } from 'date-fns'

interface CompanyNotesPanelProps {
  companyId: string
}

export function CompanyNotesPanel({ companyId }: CompanyNotesPanelProps) {
  const { data, isLoading } = useCompanyNotes(companyId)
  const { addNote } = useCompanyMutations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotesComposer
          onSubmit={async (body) => {
            await addNote.mutateAsync({ id: companyId, body })
            showSuccess('Note added')
          }}
        />
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : data?.length ? (
          <ul className="space-y-3">
            {data.map((note) => (
              <li key={note.id} className="rounded-xl border border-[var(--border)] p-4">
                <p className="text-sm">{note.body}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {note.createdBy.label} ·{' '}
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted)]">No notes yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
