import { ApiClientError, isApiClientError } from '@/shared/api/errors'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_INACTIVE:
    'Your account is inactive. Contact a Super Admin to restore access.',
  ACCOUNT_LOCKED:
    'Your account is locked due to too many failed attempts. Contact a Super Admin.',
  FORBIDDEN_ROLE: 'You do not have permission to access the Admin Console.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  RATE_LIMITED: 'Too many attempts. Please wait a moment and try again.',
  INVALID_CURRENT_PASSWORD: 'Current password is incorrect.',
  PASSWORD_POLICY_VIOLATION:
    'New password does not meet security requirements.',
  INVALID_RESET_PROOF: 'This reset link is invalid or has expired.',
  NETWORK_ERROR: 'Unable to reach the server. Check your connection and try again.',
}

export function getAuthErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isApiClientError(error)) {
    if (AUTH_ERROR_MESSAGES[error.code]) {
      return AUTH_ERROR_MESSAGES[error.code]
    }
    if (error.status === 429) {
      return AUTH_ERROR_MESSAGES.RATE_LIMITED
    }
    if (error.status === 401) {
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
    }
    return error.message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function createAuthError(
  code: keyof typeof AUTH_ERROR_MESSAGES | string,
  status?: number,
): ApiClientError {
  const message = AUTH_ERROR_MESSAGES[code] ?? 'An unexpected error occurred.'
  return new ApiClientError(message, { code, status })
}

export function showAuthError(error: unknown, fallback?: string): string {
  return getAuthErrorMessage(error, fallback)
}
