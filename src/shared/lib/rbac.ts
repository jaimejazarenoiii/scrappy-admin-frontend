import type { Role } from '@/shared/types/api'

const WRITE_ROLES: Role[] = [
  'super_admin',
  'admin',
  'support',
  'finance',
  'sales',
]

export function hasRole(userRoles: Role[], required: Role | Role[]): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required]
  return requiredRoles.some((role) => userRoles.includes(role))
}

export function canWrite(userRoles: Role[]): boolean {
  if (userRoles.includes('read_only_analyst') && !userRoles.some((r) => WRITE_ROLES.includes(r))) {
    return false
  }
  return userRoles.some((role) => WRITE_ROLES.includes(role))
}

export function isReadOnlyAnalyst(userRoles: Role[]): boolean {
  return userRoles.includes('read_only_analyst') && !canWrite(userRoles)
}

export const SUPER_ADMIN_ROLE: Role = 'super_admin'

export function canEnterConsole(userRoles: Role[]): boolean {
  return hasRole(userRoles, SUPER_ADMIN_ROLE)
}

/** Future-ready capability map. MVP Super Admin can perform all actions. */
export type Capability =
  | 'companies.read'
  | 'companies.write'
  | 'owners.read'
  | 'owners.write'
  | 'owners.reset_password'
  | 'administrators.read'
  | 'administrators.write'
  | 'administrators.reset_password'
  | 'subscriptions.read'
  | 'subscriptions.write'
  | 'reports.run'
  | 'activity.read'
  | 'search.read'
  | 'settings.read'
  | 'settings.write'
  | 'exports.create'

const SUPER_ADMIN_CAPS: Capability[] = [
  'companies.read',
  'companies.write',
  'owners.read',
  'owners.write',
  'owners.reset_password',
  'administrators.read',
  'administrators.write',
  'administrators.reset_password',
  'subscriptions.read',
  'subscriptions.write',
  'reports.run',
  'activity.read',
  'search.read',
  'settings.read',
  'settings.write',
  'exports.create',
]

export function can(userRoles: Role[], capability: Capability): boolean {
  if (hasRole(userRoles, SUPER_ADMIN_ROLE)) return SUPER_ADMIN_CAPS.includes(capability)
  return false
}
