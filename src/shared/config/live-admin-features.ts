/** Nav / route features that exist in the mock console but have no live `/admin/*` endpoint yet. */
export const MOCK_ONLY_NAV = [
  '/reports',
  '/administrators',
  '/security/login-history',
  '/activity',
  '/exports',
  '/settings',
  '/analytics',
  '/search',
] as const

export type MockOnlyNavPath = (typeof MOCK_ONLY_NAV)[number]

export function isMockOnlyPath(path: string): boolean {
  return MOCK_ONLY_NAV.some((item) => path === item || path.startsWith(`${item}/`))
}
