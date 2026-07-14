import type { AuthAdmin } from '@/features/auth/types'

const REFRESH_KEY = 'scrappy-refresh-token'
const ACCESS_KEY = 'scrappy-access-token'
const ADMIN_KEY = 'scrappy-admin-profile'

let accessTokenMemory: string | null = null

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

export function getAccessToken(): string | null {
  if (accessTokenMemory) return accessTokenMemory
  if (!canUseStorage()) return null
  const stored = sessionStorage.getItem(ACCESS_KEY) ?? localStorage.getItem(ACCESS_KEY)
  if (stored) accessTokenMemory = stored
  return accessTokenMemory
}

export function setAccessToken(token: string | null): void {
  accessTokenMemory = token
  if (!canUseStorage()) return
  if (!token) {
    sessionStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(ACCESS_KEY)
    return
  }
  // Survive soft refresh within the tab; also keep a local copy for reload restore.
  sessionStorage.setItem(ACCESS_KEY, token)
  localStorage.setItem(ACCESS_KEY, token)
}

export function getRefreshToken(): string | null {
  if (!canUseStorage()) return null
  return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY)
}

/**
 * Admin console always persists the refresh token in localStorage so reload
 * does not sign the user out (sessionStorage alone is too easy to lose).
 */
export function setRefreshToken(token: string, _rememberMe = true): void {
  if (!canUseStorage()) return
  clearRefreshToken()
  localStorage.setItem(REFRESH_KEY, token)
  // Keep a session copy for same-tab code paths that read session first.
  sessionStorage.setItem(REFRESH_KEY, token)
}

export function clearRefreshToken(): void {
  if (!canUseStorage()) return
  localStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function getPersistedAdmin(): AuthAdmin | null {
  if (!canUseStorage()) return null
  const raw = localStorage.getItem(ADMIN_KEY) ?? sessionStorage.getItem(ADMIN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthAdmin
  } catch {
    return null
  }
}

export function setPersistedAdmin(admin: AuthAdmin | null): void {
  if (!canUseStorage()) return
  if (!admin) {
    localStorage.removeItem(ADMIN_KEY)
    sessionStorage.removeItem(ADMIN_KEY)
    return
  }
  const serialized = JSON.stringify(admin)
  localStorage.setItem(ADMIN_KEY, serialized)
  sessionStorage.setItem(ADMIN_KEY, serialized)
}

export function clearAllTokens(): void {
  accessTokenMemory = null
  if (!canUseStorage()) return
  clearRefreshToken()
  sessionStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(ADMIN_KEY)
  sessionStorage.removeItem(ADMIN_KEY)
}

export function hasPersistedRefreshToken(): boolean {
  return Boolean(getRefreshToken())
}

export function isRememberMeActive(): boolean {
  return Boolean(getRefreshToken())
}

/** True when JWT `exp` is more than `skewSeconds` in the future. */
export function isAccessTokenFresh(token: string | null, skewSeconds = 30): boolean {
  if (!token) return false
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return false
    const json = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json) as { exp?: number }
    if (typeof payload.exp !== 'number') return false
    return payload.exp * 1000 > Date.now() + skewSeconds * 1000
  } catch {
    return false
  }
}
