export type ExportDataset = 'companies' | 'users' | 'subscriptions' | 'reports' | 'activity'

export interface ExportJob {
  id: string
  dataset: ExportDataset | string
  scope: Record<string, unknown>
  status: 'pending' | 'running' | 'ready' | 'failed'
  downloadRef: string | null
  createdAt: string
  completedAt: string | null
}
