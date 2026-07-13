import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '@/shared/types/api'
import { hasRole } from '@/shared/lib/rbac'
import { useAuthStore } from '@/features/auth/store/auth-store'

interface RequireRoleProps {
  roles: Role | Role[]
  userRoles?: Role[]
  children?: ReactNode
  unauthorizedPath?: string
  fallback?: ReactNode
}

export function RequireRole({
  roles,
  userRoles,
  children,
  unauthorizedPath = '/unauthorized',
  fallback,
}: RequireRoleProps) {
  const adminRoles = useAuthStore((state) => state.admin?.roles ?? [])
  const effectiveRoles = userRoles ?? adminRoles

  if (!hasRole(effectiveRoles, roles)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to={unauthorizedPath} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
