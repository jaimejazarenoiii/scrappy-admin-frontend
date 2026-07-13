import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type { ExportDataset, ExportJob } from '@/features/exports/types'
import { mockHandlers } from '@/shared/mocks/handlers'

export async function createExport(payload: {
  dataset: ExportDataset
  scope?: Record<string, unknown>
}): Promise<ExportJob> {
  if (env.useMock) return callMock(() => mockHandlers.createExport(payload))
  void payload
  throw new Error('Exports hub is not available on the live admin API yet')
}

export async function getExport(id: string): Promise<ExportJob> {
  if (env.useMock) return callMock(() => mockHandlers.getExport(id))
  void id
  throw new Error('Exports hub is not available on the live admin API yet')
}
