import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  activateCompany,
  addCompanyNote,
  createCompany,
  deactivateCompany,
  updateCompany,
} from '@/features/companies/api/companies-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import type { CompanyCreateInput, CompanyUpdateInput } from '@/features/companies/types'

export function useCompanyMutations() {
  const queryClient = useQueryClient()
  const invalidate = (id?: string) => {
    void queryClient.invalidateQueries({ queryKey: companyQueryKeys.all })
    if (id) {
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.timeline(id) })
      void queryClient.invalidateQueries({ queryKey: companyQueryKeys.notes(id) })
    }
  }

  return {
    create: useMutation({ mutationFn: (input: CompanyCreateInput) => createCompany(input), onSuccess: () => invalidate() }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: CompanyUpdateInput }) => updateCompany(id, input),
      onSuccess: (_, { id }) => invalidate(id),
    }),
    activate: useMutation({ mutationFn: activateCompany, onSuccess: (_, id) => invalidate(id) }),
    deactivate: useMutation({ mutationFn: deactivateCompany, onSuccess: (_, id) => invalidate(id) }),
    addNote: useMutation({
      mutationFn: ({ id, body }: { id: string; body: string }) => addCompanyNote(id, body),
      onSuccess: (_, { id }) => invalidate(id),
    }),
  }
}
