import type { ListQueryParams, PaginatedResponse, Role } from '@/shared/types/api'

export type AdministratorStatus = 'active' | 'inactive' | 'locked'

export interface AuthAdmin {
  id: string
  email: string
  fullName: string
  name: string
  roles: Role[]
  status: AdministratorStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  companyId?: string | null
}

/** Live Scrappy login body (`POST /admin/auth/login`). */
export interface ScrappyLoginRequest {
  identifier: string
  password: string
}

export interface SignInRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ScrappyAuthUser {
  id: string
  email: string
  role: string
  passwordChangeRequired?: boolean
  status?: string
  companyId?: string
  lastLoginAt?: string | null
}

export interface ScrappyAuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  company?: { id: string; name: string; status: string } | null
  user: ScrappyAuthUser
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  expiresIn?: number
  administrator: AuthAdmin
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  expiresIn?: number
  administrator?: AuthAdmin
}

export interface SessionResponse {
  administrator: AuthAdmin
  session: {
    valid: boolean
    expiresAt?: string
  }
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  resetProof: string
  newPassword: string
}

export type LoginHistoryResult = 'success' | 'failure' | 'locked' | 'inactive'

export interface LoginHistoryEntry {
  id: string
  administratorId: string
  administratorEmail: string
  loginTime: string
  logoutTime: string | null
  ipAddress: string | null
  browserDevice: string | null
  result: LoginHistoryResult
}

export interface LoginHistoryQueryParams extends ListQueryParams {
  administratorId?: string
  from?: string
  to?: string
  result?: LoginHistoryResult
}

export type LoginHistoryResponse = PaginatedResponse<LoginHistoryEntry>

/** @deprecated Use SignInRequest */
export type LoginRequest = SignInRequest

/** @deprecated Use SignInResponse */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  admin: AuthAdmin
}

export function mapApiRoleToConsoleRole(role: string): Role {
  const normalized = role.toUpperCase().replace(/-/g, '_')
  if (normalized === 'SUPER_ADMIN') return 'super_admin'
  if (normalized === 'ADMIN') return 'admin'
  return 'super_admin'
}

export function authUserToAdmin(user: ScrappyAuthUser): AuthAdmin {
  const statusRaw = (user.status ?? 'ACTIVE').toLowerCase()
  const status: AdministratorStatus =
    statusRaw === 'inactive' ? 'inactive' : statusRaw === 'locked' ? 'locked' : 'active'
  const fullName = user.email || 'Super Admin'
  return {
    id: user.id || 'unknown',
    email: user.email || 'admin@scrappy.local',
    fullName,
    name: fullName,
    roles: [mapApiRoleToConsoleRole(user.role || 'SUPER_ADMIN')],
    status,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    companyId: user.companyId ?? null,
  }
}

export function expiresAtFromExpiresIn(expiresInSeconds: number): string {
  const seconds = Number.isFinite(expiresInSeconds) ? expiresInSeconds : 900
  return new Date(Date.now() + seconds * 1000).toISOString()
}

export function mapScrappyAuthResponse(data: ScrappyAuthResponse): SignInResponse {
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Auth response is missing tokens')
  }

  const user = data.user ?? ({
    id: 'unknown',
    email: 'admin@scrappy.local',
    role: 'SUPER_ADMIN',
  } satisfies ScrappyAuthUser)

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn ?? 900,
    expiresAt: expiresAtFromExpiresIn(data.expiresIn ?? 900),
    administrator: authUserToAdmin(user),
  }
}

export function normalizeAuthAdmin(
  admin: Omit<AuthAdmin, 'fullName' | 'name'> & { fullName?: string; name?: string },
): AuthAdmin {
  const fullName = admin.fullName ?? admin.name ?? admin.email
  return {
    ...admin,
    fullName,
    name: fullName,
  }
}
