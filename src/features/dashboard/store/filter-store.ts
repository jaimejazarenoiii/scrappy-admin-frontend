import { create } from 'zustand'
import {
  getDefaultDashboardFilters,
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
} from '@/features/dashboard/lib/filter-url'
import type { DashboardFilterSet } from '@/features/dashboard/types'
import { validateDashboardFilters } from '@/features/dashboard/validation/filter-schema'

interface DashboardFilterStore {
  draft: DashboardFilterSet
  applied: DashboardFilterSet
  validationErrors: Record<string, string>
  setDraft: (partial: Partial<DashboardFilterSet>) => void
  applyFromUrl: (params: URLSearchParams) => void
  applyDraft: () => { success: boolean; searchParams?: URLSearchParams }
  reset: () => { searchParams: URLSearchParams }
}

export const useDashboardFilterStore = create<DashboardFilterStore>()((set, get) => ({
  draft: getDefaultDashboardFilters(),
  applied: getDefaultDashboardFilters(),
  validationErrors: {},

  setDraft: (partial) => {
    set((state) => ({
      draft: { ...state.draft, ...partial },
      validationErrors: {},
    }))
  },

  applyFromUrl: (params) => {
    const parsed = parseFiltersFromSearchParams(params)
    set({
      draft: parsed,
      applied: parsed,
      validationErrors: {},
    })
  },

  applyDraft: () => {
    const { draft } = get()
    const result = validateDashboardFilters({
      ...draft,
      subscriptionStatus: draft.subscriptionStatus || null,
      companyStatus: draft.companyStatus || null,
    })

    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0]
        if (typeof path === 'string') errors[path] = issue.message
      }
      set({ validationErrors: errors })
      return { success: false }
    }

    const applied = result.data as DashboardFilterSet
    const searchParams = serializeFiltersToSearchParams(applied)
    set({ draft: applied, applied, validationErrors: {} })
    return { success: true, searchParams }
  },

  reset: () => {
    const defaults = getDefaultDashboardFilters()
    const searchParams = serializeFiltersToSearchParams(defaults)
    set({ draft: defaults, applied: defaults, validationErrors: {} })
    return { searchParams }
  },
}))
