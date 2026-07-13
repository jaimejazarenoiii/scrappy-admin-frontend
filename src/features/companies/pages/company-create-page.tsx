import { Link, useNavigate } from 'react-router-dom'
import { CompanyForm } from '@/features/companies/components/company-form'
import { useCompanyMutations } from '@/features/companies/hooks/use-company-mutations'
import { PageHeader } from '@/shared/ui/management/page-header'
import { showError, showSuccess } from '@/shared/ui/toast'

export function CompanyCreatePage() {
  const navigate = useNavigate()
  const { create } = useCompanyMutations()

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <PageHeader
        title="Create company"
        description="Register a customer organization (POST /admin/companies). Add OWNER accounts after create."
        breadcrumbs={
          <Link to="/companies" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Companies
          </Link>
        }
      />
      <CompanyForm
        submitLabel="Create company"
        loading={create.isPending}
        onCancel={() => navigate('/companies')}
        onSubmit={async (values) => {
          try {
            const company = await create.mutateAsync({
              name: values.name,
              email: values.email || undefined,
              contactNumber: values.contactNumber || undefined,
              address: values.address || undefined,
            })
            showSuccess('Company created')
            navigate(`/companies/${company.id}`, { replace: true })
          } catch (error) {
            showError(error instanceof Error ? error.message : 'Create failed')
          }
        }}
      />
    </div>
  )
}
