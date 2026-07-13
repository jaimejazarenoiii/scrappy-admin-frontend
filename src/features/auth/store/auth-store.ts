import { create } from 'zustand'
import * as authApi from '@/features/auth/api/auth-api'
import * as tokenStorage from '@/features/auth/lib/token-storage'
import type { AuthAdmin } from '@/features/auth/types'
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

function applyTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
  tokenStorage.setAccessToken(accessToken)
  tokenStorage.setRefreshToken(refreshToken, rememberMe)
}

export const useAuthStore = create<AuthStoreState>()((set, get) => ({
  admin: null,
  isAuthenticated: false,
  hydrated: false,
  rememberMe: false,
  sessionExpired: false,

  login: async (email, password, rememberMe = false) => {
    const response = await authApi.signIn({ email, password, rememberMe })
    applyTokens(response.accessToken, response.refreshToken, rememberMe)
    set({
      admin: response.administrator,
      isAuthenticated: true,
      rememberMe,
      sessionExpired: false,
    })
  },

  logout: async () => {
    try {
      if (get().isAuthenticated) {
        await authApi.signOut()
      }
    } finally {
      get().clearSession()
      useSidebarStore.getState().setCollapsed(false)
    }
  },

  hydrateSession: async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    const rememberMe = tokenStorage.isRememberMeActive()

    if (!refreshToken) {
      set({ hydrated: true, rememberMe })
      return
    }

    try {
      const refreshed = await authApi.refresh(refreshToken)
      applyTokens(refreshed.accessToken, refreshed.refreshToken, rememberMe)

      const session = await authApi.getSession()
      if (!session.session.valid) {
        get().clearSession()
        set({ hydrated: true })
        return
      }

      set({
        admin: session.administrator,
        isAuthenticated: true,
        rememberMe,
        sessionExpired: false,
        hydrated: true,
      })
    } catch {
      get().clearSession()
      set({ hydrated: true })
    }
  },

  refreshSession: async () => {
    const { rememberMe } = get()
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      get().clearSession()
      set({ sessionExpired: true })
      return null
    }

    try {
      const response = await authApi.refresh(refreshToken)
      applyTokens(response.accessToken, response.refreshToken, rememberMe)
      set({ isAuthenticated: true, sessionExpired: false })
      return response.accessToken
    } catch {
      get().clearSession()
      set({ sessionExpired: true })
      return null
    }
  },

  clearSession: () => {
    tokenStorage.clearAllTokens()
    set({
      admin: null,
      isAuthenticated: false,
      rememberMe: false,
    })
  },

  acknowledgeSessionExpired: () => {
    set({ sessionExpired: false })
  },

  setAdmin: (admin) => {
    set({ admin })
  },
}))
