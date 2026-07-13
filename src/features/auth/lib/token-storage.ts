const REFRESH_KEY = 'scrappy-refresh-token'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY)
}

export function setRefreshToken(token: string, rememberMe: boolean): void {
  clearRefreshToken()
  if (rememberMe) {
    localStorage.setItem(REFRESH_KEY, token)
  } else {
    sessionStorage.setItem(REFRESH_KEY, token)
  }
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export function clearAllTokens(): void {
  accessToken = null
  clearRefreshToken()
}

export function hasPersistedRefreshToken(): boolean {
  return Boolean(getRefreshToken())
}

export function isRememberMeActive(): boolean {
  return localStorage.getItem(REFRESH_KEY) !== null
}
