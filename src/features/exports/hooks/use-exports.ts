import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createExport, getExport } from '@/features/exports/api/exports-api'
import type { ExportDataset } from '@/features/exports/types'
import { pmQueryKeys } from '@/shared/lib/pm-query-keys'

export function useExportJob(id: string | null) {
  return useQuery({
    queryKey: id ? pmQueryKeys.exports.detail(id) : ['pm', 'exports', 'none'],
    queryFn: () => getExport(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'pending' || status === 'running' ? 1500 : false
    },
  })
}

export function useCreateExport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { dataset: ExportDataset; scope?: Record<string, unknown> }) =>
      createExport(payload),
    onSuccess: (job) => {
      void queryClient.invalidateQueries({ queryKey: pmQueryKeys.exports.all })
      void queryClient.invalidateQueries({ queryKey: pmQueryKeys.activity.all })
      void queryClient.setQueryData(pmQueryKeys.exports.detail(job.id), job)
    },
  })
}
