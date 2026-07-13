import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type { AuditEvent } from '@/features/activity/types'
import { mockHandlers } from '@/shared/mocks/handlers'
import type { ListQueryParams, PaginatedResponse } from '@/shared/types/api'

export async function listActivity(params?: ListQueryParams): Promise<PaginatedResponse<AuditEvent>> {
  if (env.useMock) return callMock(() => mockHandlers.listActivity(params))
  // Tenant activity logs exist at GET /activity-logs but are company-scoped for OWNER/MANAGER,
  // not a Super Admin portfolio feed.
  void params
  return { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 }
}
