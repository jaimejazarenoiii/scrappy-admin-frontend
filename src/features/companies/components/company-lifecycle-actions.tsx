import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { activateCompany, deactivateCompany } from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import type { Company } from '@/features/companies/types'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { canWrite } from '@/shared/lib/rbac'
import { pmQueryKeys } from '@/shared/lib/pm-query-keys'
import { Button } from '@/shared/ui/button'
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog'
import { showError, showSuccess } from '@/shared/ui/toast'

interface CompanyLifecycleActionsProps {
  company: Company
}

export function CompanyLifecycleActions({ company }: CompanyLifecycleActionsProps) {
  const queryClient = useQueryClient()
  const admin = useAuthStore((state) => state.admin)
  const canMutate = admin ? canWrite(admin.roles) : false
  const [activateOpen, setActivateOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: companyQueryKeys.all })
    void queryClient.invalidateQueries({ queryKey: pmQueryKeys.activity.all })
  }

  const activateMutation = useMutation({
    mutationFn: () => activateCompany(company.id),
    onSuccess: () => {
      invalidate()
      showSuccess('Company activated')
      setActivateOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Activation failed'),
  })

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateCompany(company.id),
    onSuccess: () => {
      invalidate()
      showSuccess('Company deactivated')
      setDeactivateOpen(false)
    },
    onError: (error) => showError(error instanceof Error ? error.message : 'Deactivation failed'),
  })

  if (!canMutate) return null

  const isActive = String(company.status).toLowerCase() === 'active'

  return (
    <div className="flex flex-wrap gap-2">
      {!isActive ? (
        <>
          <Button onClick={() => setActivateOpen(true)}>Activate</Button>
          <ConfirmationDialog
            open={activateOpen}
            onOpenChange={setActivateOpen}
            title="Activate company"
            description={`Activate ${company.name}? Prefer subscription renew when using the live admin API.`}
            confirmLabel="Activate"
            loading={activateMutation.isPending}
            onConfirm={async () => {
              await activateMutation.mutateAsync()
            }}
          />
        </>
      ) : null}
      {isActive ? (
        <>
          <Button variant="destructive" onClick={() => setDeactivateOpen(true)}>
            Deactivate
          </Button>
          <ConfirmationDialog
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            title="Deactivate company"
            description={`Deactivate ${company.name}? On live API, use subscription suspend/expire for entitlement control.`}
            confirmLabel="Deactivate"
            variant="destructive"
            loading={deactivateMutation.isPending}
            onConfirm={async () => {
              await deactivateMutation.mutateAsync()
            }}
          />
        </>
      ) : null}
    </div>
  )
}
