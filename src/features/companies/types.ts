export type CompanyStatus = 'ACTIVE' | 'INACTIVE' | 'registered' | 'active' | 'inactive' | 'deactivated'

export type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'GRACE_PERIOD'
  | 'EXPIRED'
  | 'SUSPENDED'
  | string

/** Live Scrappy admin company (`GET/POST /admin/companies`). */
export interface Company {
  id: string
  name: string
  logoUrl?: string | null
  contactNumber?: string | null
  email?: string | null
  address?: string | null
  status: CompanyStatus
  subscriptionStatus?: SubscriptionStatus | null
  registeredAt?: string
  activatedAt?: string | null
  deactivatedAt?: string | null
  createdAt?: string
  updatedAt?: string
  /** Legacy mock monitoring fields (optional when live). */
  ownerCount?: number
  userCount?: number
  branchCount?: number
  warehouseCount?: number
  vehicleCount?: number
  subscriptionId?: string | null
  subscriptionSummary?: string | null
  metadata?: {
    contactEmail?: string
    locale?: string
  }
}

export interface CompanyOwner {
  id: string
  companyId: string
  name: string
  email: string
  status: 'active' | 'inactive' | string
  locked: boolean
  lastLoginAt: string | null
  role?: string
}

export interface CompanyAccountCreateInput {
  firstName: string
  lastName: string
  weeklySalary?: number
  employeeNumber?: string
  contactNumber?: string
  account: {
    email: string
    password: string
    confirmPassword: string
    role: 'OWNER' | 'MANAGER' | 'EMPLOYEE'
  }
}

export interface CompanyAccount {
  userId: string
  employeeId: string | null
  email: string
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE' | string
  status: 'ACTIVE' | 'INACTIVE' | string
  firstName: string | null
  lastName: string | null
  passwordChangeRequired: boolean
  lastLoginAt: string | null
}

export interface CompanyAccountPasswordResetResult {
  userId: string
  employeeId: string | null
  passwordChangeRequired: true
}

export interface CompanyStatistics {
  companyId: string
  transactionVolume: number
  tripVolume: number
  expenseVolume: number
  activeUsers: number
  lastActivityAt: string | null
}

export interface AdministrativeNote {
  id: string
  targetType: 'company'
  targetId: string
  companyId: string
  body: string
  createdAt: string
  updatedAt?: string
  createdBy: { id: string; label: string }
}

export interface AdministrativeTimelineEvent {
  id: string
  companyId: string
  type: string
  summary: string
  at: string
  actorLabel: string | null
}

export interface CompanyCreateInput {
  name: string
  contactNumber?: string
  email?: string
  address?: string
  /** Legacy form fields mapped into create when present. */
  contactEmail?: string
  locale?: string
}

export type CompanyUpdateInput = Partial<CompanyCreateInput>

export function normalizeCompanyStatus(status: string): string {
  return status.toLowerCase()
}
