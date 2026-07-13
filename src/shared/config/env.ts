function readEnv(key: keyof ImportMetaEnv): string | undefined {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export const env = {
  /** Scrappy API root including version prefix, e.g. http://localhost:3000/api/v1 */
  apiBaseUrl: readEnv('VITE_API_BASE_URL') ?? 'http://localhost:3000/api/v1',
  useMock: readEnv('VITE_USE_MOCK') === 'true',
} as const
