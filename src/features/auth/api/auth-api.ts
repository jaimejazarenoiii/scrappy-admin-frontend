import { apiClient } from '@/shared/api/client'
import { callMock } from '@/shared/api/mock'
import { env } from '@/shared/config/env'
import { mockHandlers } from '@/shared/mocks/handlers'
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginHistoryQueryParams,
  LoginHistoryResponse,
  RefreshResponse,
  ResetPasswordRequest,
  ScrappyAuthResponse,
  ScrappyAuthUser,
  SessionResponse,
  SignInRequest,
  SignInResponse,
} from '@/features/auth/types'
import {
  authUserToAdmin,
  expiresAtFromExpiresIn,
  mapScrappyAuthResponse,
  normalizeAuthAdmin,
} from '@/features/auth/types'

function mapSignInResponse(
  data: SignInResponse & { admin?: SignInResponse['administrator'] },
): SignInResponse {
  const administrator = normalizeAuthAdmin(data.administrator ?? data.admin!)
  return { ...data, administrator }
}

export async function signIn(payload: SignInRequest): Promise<SignInResponse> {
  if (env.useMock) {
    const data = await callMock(() =>
      mockHandlers.signIn({
        email: payload.email,
        password: payload.password,
        rememberMe: payload.rememberMe,
      }),
    )
    return mapSignInResponse(data)
  }

  const { data } = await apiClient.post<ScrappyAuthResponse>('/admin/auth/login', {
    identifier: payload.email,
    password: payload.password,
  })
  return mapScrappyAuthResponse(data)
}

/** @deprecated Use signIn */
export async function login(payload: SignInRequest): Promise<SignInResponse> {
  return signIn(payload)
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  if (env.useMock) {
    return callMock(() => mockHandlers.refresh(refreshToken))
  }
  const { data } = await apiClient.post<ScrappyAuthResponse>('/auth/refresh', { refreshToken })
  const mapped = mapScrappyAuthResponse(data)
  return {
    accessToken: mapped.accessToken,
    refreshToken: mapped.refreshToken,
    expiresAt: mapped.expiresAt,
    expiresIn: mapped.expiresIn,
    administrator: mapped.administrator,
  }
}

export async function signOut(): Promise<void> {
  if (env.useMock) {
    await callMock(() => mockHandlers.signOut())
    return
  }
  await apiClient.post('/auth/logout')
}

/** @deprecated Use signOut */
export async function logout(): Promise<void> {
  return signOut()
}

export async function getSession(): Promise<SessionResponse> {
  if (env.useMock) {
    const data = await callMock(() => mockHandlers.getSession())
    return {
      ...data,
      administrator: normalizeAuthAdmin(data.administrator),
    }
  }

  const { data } = await apiClient.get<ScrappyAuthUser>('/users/me')
  return {
    administrator: authUserToAdmin(data),
    session: { valid: true },
  }
}

/** @deprecated Use getSession */
export async function getMe(): Promise<SessionResponse['administrator']> {
  const session = await getSession()
  return session.administrator
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  if (env.useMock) {
    await callMock(() => mockHandlers.changePassword(payload))
    return
  }
  await apiClient.post('/users/me/password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword ?? payload.newPassword,
  })
}

export async function requestPasswordReset(payload: ForgotPasswordRequest): Promise<void> {
  if (env.useMock) {
    await callMock(() => mockHandlers.requestPasswordReset(payload))
    return
  }
  await apiClient.post('/auth/forgot-password', { identifier: payload.email })
}

export async function completePasswordReset(payload: ResetPasswordRequest): Promise<void> {
  if (env.useMock) {
    await callMock(() => mockHandlers.completePasswordReset(payload))
    return
  }
  // Live API placeholder — no complete-reset contract in admin reference yet.
  await apiClient.post('/auth/forgot-password', { identifier: payload.resetProof })
}

export async function listLoginHistory(
  params: LoginHistoryQueryParams = {},
): Promise<LoginHistoryResponse> {
  if (env.useMock) {
    return callMock(() => mockHandlers.listLoginHistory(params))
  }
  // Not exposed as admin endpoint in current API reference — empty page when live.
  void params
  return { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 }
}

export { expiresAtFromExpiresIn }
