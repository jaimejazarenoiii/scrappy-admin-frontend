import { create } from 'zustand'
import * as authApi from '@/features/auth/api/auth-api'
import * as tokenStorage from '@/features/auth/lib/token-storage'
import type { AuthAdmin } from '@/features/auth/types'
import { isApiClientError } from '@/shared/api/errors'
import { useSidebarStore } from '@/shared/stores/sidebar-store'

interface AuthStoreState {
  admin: AuthAdmin | null
  isAuthenticated: boolean
  hydrated: boolean
  rememberMe: boolean
  sessionExpired: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  hydrateSession: () => Promise<void>
  refreshSession: () => Promise<string | null>
  clearSession: () => void
  acknowledgeSessionExpired: () => void
  setAdmin: (admin: AuthAdmin) => void
}

function applySession(
  accessToken: string,
  refreshToken: string,
  admin: AuthAdmin,
  rememberMe = true,
): void {
  tokenStorage.setAccessToken(accessToken)
  tokenStorage.setRefreshToken(refreshToken, rememberMe)
  tokenStorage.setPersistedAdmin(admin)
}

function isUnauthenticatedError(error: unknown): boolean {
  if (!isApiClientError(error)) return false
  return (
    error.status === 401 ||
    error.code === 'UNAUTHENTICATED' ||
    error.code === 'INVALID_CREDENTIALS' ||
    error.code === 'UNAUTHORIZED'
  )
}

let hydratePromise: Promise<void> | null = null

export const useAuthStore = create<AuthStoreState>()((set, get) => ({
  admin: null,
  isAuthenticated: false,
  hydrated: false,
  rememberMe: true,
  sessionExpired: false,

  login: async (email, password, _rememberMe = true) => {
    const response = await authApi.signIn({ email, password, rememberMe: true })
    applySession(response.accessToken, response.refreshToken, response.administrator, true)
    set({
      admin: response.administrator,
      isAuthenticated: true,
      rememberMe: true,
      sessionExpired: false,
    })
  },

  logout: async () => {
    try {
      if (get().isAuthenticated) {
        await authApi.signOut()
      }
    } catch {
      // Always clear local session even if logout API fails.
    } finally {
      get().clearSession()
      useSidebarStore.getState().setCollapsed(false)
    }
  },

  hydrateSession: async () => {
    if (get().hydrated) return
    if (hydratePromise) return hydratePromise

    hydratePromise = (async () => {
      const refreshToken = tokenStorage.getRefreshToken()
      const cachedAdmin = tokenStorage.getPersistedAdmin()
      const existingAccess = tokenStorage.getAccessToken()

      if (!refreshToken) {
        set({ hydrated: true, rememberMe: false, isAuthenticated: false, admin: null })
        return
      }

      // Soft restore if access JWT is still fresh — avoids unnecessary refresh races.
      if (tokenStorage.isAccessTokenFresh(existingAccess) && cachedAdmin) {
        tokenStorage.setAccessToken(existingAccess)
        set({
          admin: cachedAdmin,
          isAuthenticated: true,
          rememberMe: true,
          sessionExpired: false,
          hydrated: true,
        })
        return
      }

      try {
        const refreshed = await authApi.refresh(refreshToken)
        const admin = refreshed.administrator ?? cachedAdmin
        if (!admin) {
          // Tokens valid enough to refresh but no profile — keep tokens, fail soft.
          applySession(
            refreshed.accessToken,
            refreshed.refreshToken,
            {
              id: 'unknown',
              email: 'admin@scrappy.local',
              fullName: 'Super Admin',
              name: 'Super Admin',
              roles: ['super_admin'],
              status: 'active',
              lastLoginAt: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            true,
          )
          set({
            admin: tokenStorage.getPersistedAdmin(),
            isAuthenticated: true,
            rememberMe: true,
            sessionExpired: false,
            hydrated: true,
          })
          return
        }

        applySession(refreshed.accessToken, refreshed.refreshToken, admin, true)

        try {
          const session = await authApi.getSession()
          if (session.session.valid) {
            tokenStorage.setPersistedAdmin(session.administrator)
            set({
              admin: session.administrator,
              isAuthenticated: true,
              rememberMe: true,
              sessionExpired: false,
              hydrated: true,
            })
            return
          }
        } catch {
          // Profile refresh is optional.
        }

        set({
          admin,
          isAuthenticated: true,
          rememberMe: true,
          sessionExpired: false,
          hydrated: true,
        })
      } catch (error) {
        if (isUnauthenticatedError(error)) {
          get().clearSession()
          set({ hydrated: true, sessionExpired: true })
          return
        }

        // Network / 5xx: keep refresh token so the next reload can retry.
        if (cachedAdmin && tokenStorage.getRefreshToken()) {
          set({
            admin: cachedAdmin,
            isAuthenticated: true,
            rememberMe: true,
            sessionExpired: false,
            hydrated: true,
          })
          return
        }

        set({
          hydrated: true,
          isAuthenticated: false,
          admin: null,
          rememberMe: true,
        })
      }
    })().finally(() => {
      hydratePromise = null
    })

    return hydratePromise
  },

  refreshSession: async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      get().clearSession()
      set({ sessionExpired: true })
      return null
    }

    try {
      const response = await authApi.refresh(refreshToken)
      const admin = response.administrator ?? get().admin ?? tokenStorage.getPersistedAdmin()
      if (admin) {
        applySession(response.accessToken, response.refreshToken, admin, true)
        set({
          admin,
          isAuthenticated: true,
          rememberMe: true,
          sessionExpired: false,
        })
      } else {
        tokenStorage.setAccessToken(response.accessToken)
        tokenStorage.setRefreshToken(response.refreshToken, true)
        set({ isAuthenticated: true, rememberMe: true, sessionExpired: false })
      }
      return response.accessToken
    } catch (error) {
      if (isUnauthenticatedError(error)) {
        get().clearSession()
        set({ sessionExpired: true })
      }
      return null
    }
  },

  clearSession: () => {
    tokenStorage.clearAllTokens()
    set({
      admin: null,
      isAuthenticated: false,
      rememberMe: true,
    })
  },

  acknowledgeSessionExpired: () => {
    set({ sessionExpired: false })
  },

  setAdmin: (admin) => {
    tokenStorage.setPersistedAdmin(admin)
    set({ admin })
  },
}))
