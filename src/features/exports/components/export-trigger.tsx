import { useState } from 'react'
import { useCreateExport } from '@/features/exports/hooks/use-exports'
import type { ExportDataset } from '@/features/exports/types'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'

interface ExportTriggerProps {
  dataset: ExportDataset
  scope?: Record<string, unknown>
  label?: string
}

export function ExportTrigger({ dataset, scope, label = 'Export' }: ExportTriggerProps) {
  const create = useCreateExport()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title={`Export ${dataset}?`}
        description="Starts an audited export job."
        confirmLabel="Export"
        loading={create.isPending}
        onConfirm={async () => {
          try {
            await create.mutateAsync({ dataset, scope })
            showSuccess('Export started')
            setOpen(false)
          } catch (error) {
            showError(error instanceof Error ? error.message : 'Export failed')
          }
        }}
      />
    </>
  )
}
