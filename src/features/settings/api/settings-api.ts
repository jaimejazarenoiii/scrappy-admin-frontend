import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import type { MockAppSetting } from '@/shared/mocks/data'
import { mockHandlers } from '@/shared/mocks/handlers'

export type AppSetting = MockAppSetting

export async function listSettings(): Promise<AppSetting[]> {
  if (env.useMock) return callMock(() => mockHandlers.listSettings())
  return []
}

export async function updateSetting(key: string, value: unknown): Promise<AppSetting> {
  if (env.useMock) return callMock(() => mockHandlers.updateSetting(key, value))
  void key
  void value
  throw new Error('Platform settings are not available on the live admin API yet')
}
