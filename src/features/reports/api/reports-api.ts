import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { mockHandlers } from '@/shared/mocks/handlers'

export interface ReportPayload {
  reportKey: string
  title: string
  generatedAt: string
  sections: Array<{ heading: string; body: string }>
}

export async function fetchReport(reportKey: string): Promise<ReportPayload> {
  if (env.useMock) return callMock(() => mockHandlers.report(reportKey))
  return {
    reportKey,
    title: reportKey,
    generatedAt: new Date().toISOString(),
    sections: [
      {
        heading: 'Not available',
        body: 'Admin report keys are mock-only. Use tenant /reports/* or /admin/analytics/* for live data.',
      },
    ],
  }
}
