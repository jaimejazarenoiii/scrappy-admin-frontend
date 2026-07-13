import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  activateOwner,
  createOwner,
  deactivateOwner,
  getOwner,
  getOwnerActivitySummary,
  getOwnerLoginHistory,
  lockOwner,
  listCompanyOwners,
  resetOwnerPassword,
  unlockOwner,
  updateOwner,
  type OwnerCreateInput,
  type OwnerUpdateInput,
} from '@/features/companies/api/owners-api'
import { companyQueryKeys } from '@/features/companies/lib/query-keys'
import { pmQueryKeys } from '@/shared/lib/pm-query-keys'
import type { CompanyOwner } from '@/features/companies/types'

function normalizeOwners(data: PaginatedOrList): CompanyOwner[] {
  return Array.isArray(data) ? data : data.items
}

type PaginatedOrList = CompanyOwner[] | { items: CompanyOwner[] }

export function useCompanyOwners(companyId: string) {
  return useQuery({
    queryKey: companyQueryKeys.owners(companyId),
    queryFn: async () => normalizeOwners(await listCompanyOwners(companyId)),
    enabled: Boolean(companyId),
  })
}

export function useOwner(id: string) {
  return useQuery({
    queryKey: pmQueryKeys.owners.detail(id),
    queryFn: () => getOwner(id),
    enabled: Boolean(id),
  })
}

export function useOwnerLoginHistory(id: string) {
  return useQuery({
    queryKey: pmQueryKeys.owners.loginHistory(id),
    queryFn: () => getOwnerLoginHistory(id),
    enabled: Boolean(id),
  })
}

export function useOwnerActivitySummary(id: string) {
  return useQuery({
    queryKey: pmQueryKeys.owners.activity(id),
    queryFn: () => getOwnerActivitySummary(id),
    enabled: Boolean(id),
  })
}

export function useOwnerMutations(companyId?: string) {
  const queryClient = useQueryClient()
  const invalidate = (ownerId?: string) => {
    if (companyId) void queryClient.invalidateQueries({ queryKey: companyQueryKeys.owners(companyId) })
    void queryClient.invalidateQueries({ queryKey: pmQueryKeys.owners.all })
    void queryClient.invalidateQueries({ queryKey: pmQueryKeys.activity.all })
    if (ownerId) void queryClient.invalidateQueries({ queryKey: pmQueryKeys.owners.detail(ownerId) })
  }

  return {
    create: useMutation({
      mutationFn: (input: OwnerCreateInput) => createOwner(companyId!, input),
      onSuccess: () => invalidate(),
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: OwnerUpdateInput }) => updateOwner(id, input),
      onSuccess: (_, { id }) => invalidate(id),
    }),
    activate: useMutation({ mutationFn: activateOwner, onSuccess: (o) => invalidate(o.id) }),
    deactivate: useMutation({ mutationFn: deactivateOwner, onSuccess: (o) => invalidate(o.id) }),
    lock: useMutation({ mutationFn: lockOwner, onSuccess: (o) => invalidate(o.id) }),
    unlock: useMutation({ mutationFn: unlockOwner, onSuccess: (o) => invalidate(o.id) }),
    resetPassword: useMutation({
      mutationFn: resetOwnerPassword,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: pmQueryKeys.activity.all })
      },
    }),
  }
}
