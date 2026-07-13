import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateExport, useExportJob } from '@/features/exports/hooks/use-exports'
import { exportSchema, type ExportFormValues } from '@/features/exports/validation/export-schema'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { PageHeader } from '@/shared/ui/management/page-header'
import { StatusBadge } from '@/shared/ui/management/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { showError, showSuccess } from '@/shared/ui/toast'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'

export function ExportsPage() {
  const create = useCreateExport()
  const [jobId, setJobId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingValues, setPendingValues] = useState<ExportFormValues | null>(null)
  const job = useExportJob(jobId)

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportSchema),
    defaultValues: { dataset: 'companies', from: '', to: '' },
  })

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="Exports"
        description="Request platform data exports (companies, users, subscriptions, reports, activity)"
      />

      <Card>
        <CardHeader>
          <CardTitle>Request export</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => {
                setPendingValues(values)
                setConfirmOpen(true)
              })}
            >
              <FormField
                control={form.control}
                name="dataset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dataset</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                        {...field}
                      >
                        <option value="companies">Companies</option>
                        <option value="users">Users</option>
                        <option value="subscriptions">Subscriptions</option>
                        <option value="reports">Reports</option>
                        <option value="activity">Activity Logs</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={create.isPending}>
                Request export
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {job.data ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Job {job.data.id} <StatusBadge status={job.data.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Dataset: {job.data.dataset}</p>
            {job.data.status === 'ready' && job.data.downloadRef ? (
              <a
                className="font-medium text-[var(--primary)] hover:underline"
                href={job.data.downloadRef}
                onClick={(e) => {
                  e.preventDefault()
                  showSuccess('Mock download ready (no file binary in mock mode)')
                }}
              >
                Download export
              </a>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Start export?"
        description="Large exports may take a moment. The initiation will be audited."
        confirmLabel="Export"
        loading={create.isPending}
        onConfirm={async () => {
          if (!pendingValues) return
          try {
            const result = await create.mutateAsync({
              dataset: pendingValues.dataset,
              scope: { from: pendingValues.from, to: pendingValues.to },
            })
            setJobId(result.id)
            showSuccess('Export job accepted')
            setConfirmOpen(false)
          } catch (error) {
            showError(error instanceof Error ? error.message : 'Export failed')
          }
        }}
      />
    </div>
  )
}
