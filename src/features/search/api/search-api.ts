import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type { SearchResult } from '@/features/search/types'
import { mockHandlers } from '@/shared/mocks/handlers'

export async function search(q: string, types?: string[]): Promise<SearchResult[]> {
  if (env.useMock) return callMock(() => mockHandlers.search(q, types))
  void q
  void types
  return []
}
