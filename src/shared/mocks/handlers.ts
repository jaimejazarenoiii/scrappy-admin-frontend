import type { ListQueryParams, PaginatedResponse } from '@/shared/types/api'
import type { AttentionCompaniesResponse } from '@/features/dashboard/types'
import {
  createMockTokens,
  mockActivity,
  mockAdmins,
  mockAttentionCompanies as attentionCompaniesData,
  mockCompanies,
  mockCompanyOwners,
  mockCompanyRankingsData,
  mockCompanyStatistics,
  mockCurrentAdmin,
  mockDashboardRecentActivities as dashboardRecentActivitiesData,
  mockDashboardStatistics as dashboardStatisticsData,
  mockDashboardSummary as dashboardSummaryData,
  mockGrowthAnalytics as growthAnalyticsData,
  mockGrowthSeries,
  mockLoginHistory,
  mockMetricsSummary as metricsSummaryData,
  mockNotes,
  mockPlatformUsage,
  mockQuickActions as quickActionsData,
  mockSearchIndex,
  mockSettings,
  mockSubscriptionAnalytics as subscriptionAnalyticsData,
  mockSubscriptionDistribution,
  mockSubscriptions,
  type MockAdministrativeNote,
  type MockAdministrator,
  type MockAuditEvent,
  type MockCompany,
  type MockLoginHistoryEntry,
  type MockSearchResult,
  type MockSubscription,
} from '@/shared/mocks/data'

const MOCK_PASSWORD = 'admin123'

let activeSessionAdminId: string | null = mockCurrentAdmin.id
const adminPasswords: Record<string, string> = Object.fromEntries(
  mockAdmins.map((admin) => [admin.id, MOCK_PASSWORD]),
)
const resetProofs = new Map<string, { adminId: string; expiresAt: number }>([
  ['mock-reset-super', { adminId: 'adm-001', expiresAt: Number.MAX_SAFE_INTEGER }],
])

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getAdminPassword(adminId: string): string {
  return adminPasswords[adminId] ?? MOCK_PASSWORD
}

function setAdminPassword(adminId: string, password: string): void {
  adminPasswords[adminId] = password
}

function recordLoginHistory(
  entry: Omit<MockLoginHistoryEntry, 'id'>,
): MockLoginHistoryEntry {
  const record: MockLoginHistoryEntry = {
    id: `lh-${Date.now()}`,
    ...entry,
  }
  mockLoginHistory.unshift(record)
  return record
}

function recordCompanyAudit(companyId: string, action: string, summary: string): void {
  const actor = getActiveAdmin()
  mockActivity.unshift({
    id: `evt-${Date.now()}`,
    action,
    actorAdminId: actor.id,
    actorName: actor.name,
    targetType: 'company',
    targetId: companyId,
    metadata: { summary },
    createdAt: new Date().toISOString(),
  })
}

function findAdminByEmail(email: string): MockAdministrator | undefined {
  return mockAdmins.find((item) => item.email.toLowerCase() === email.toLowerCase())
}

function decodeMockJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    return JSON.parse(atob(parts[1]!)) as Record<string, unknown>
  } catch {
    return null
  }
}

function paginate<T>(items: T[], params: ListQueryParams = {}): PaginatedResponse<T> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.max(1, params.pageSize ?? 20)
  let filtered = [...items]

  if (params.q) {
    const query = params.q.toLowerCase()
    filtered = filtered.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query),
    )
  }

  if (params.sort) {
    const order = params.order === 'desc' ? -1 : 1
    filtered.sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[params.sort!]
      const bValue = (b as Record<string, unknown>)[params.sort!]
      if (aValue === bValue) return 0
      if (aValue == null) return -1 * order
      if (bValue == null) return 1 * order
      return aValue > bValue ? order : -order
    })
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const pagedItems = filtered.slice(start, start + pageSize)

  return {
    items: pagedItems,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export interface SignInRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  administrator: MockAdministrator
}

/** @deprecated Use SignInRequest */
export type LoginRequest = SignInRequest

/** @deprecated Use SignInResponse */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  admin: MockAdministrator
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface SessionResponse {
  administrator: MockAdministrator
  session: { valid: boolean; expiresAt?: string }
}

function getActiveAdmin(): MockAdministrator {
  const admin = mockAdmins.find((item) => item.id === activeSessionAdminId)
  if (!admin) {
    throw { code: 'UNAUTHORIZED', message: 'Session is not valid', status: 401 }
  }
  return admin
}

export async function mockSignIn(payload: SignInRequest): Promise<SignInResponse> {
  await delay()
  const admin = findAdminByEmail(payload.email)

  if (!admin) {
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', status: 401 }
  }

  if (payload.password !== getAdminPassword(admin.id)) {
    recordLoginHistory({
      administratorId: admin.id,
      administratorEmail: admin.email,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      ipAddress: '10.0.0.1',
      browserDevice: 'Mock Browser',
      result: 'failure',
    })
    throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', status: 401 }
  }

  if (admin.status === 'inactive') {
    recordLoginHistory({
      administratorId: admin.id,
      administratorEmail: admin.email,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      ipAddress: '10.0.0.1',
      browserDevice: 'Mock Browser',
      result: 'inactive',
    })
    throw {
      code: 'ACCOUNT_INACTIVE',
      message: 'Your account is inactive. Contact a Super Admin to restore access.',
      status: 403,
    }
  }

  if (admin.status === 'locked') {
    recordLoginHistory({
      administratorId: admin.id,
      administratorEmail: admin.email,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      ipAddress: '10.0.0.1',
      browserDevice: 'Mock Browser',
      result: 'locked',
    })
    throw {
      code: 'ACCOUNT_LOCKED',
      message: 'Your account is locked due to too many failed attempts. Contact a Super Admin.',
      status: 403,
    }
  }

  activeSessionAdminId = admin.id
  admin.lastLoginAt = new Date().toISOString()
  admin.updatedAt = new Date().toISOString()

  recordLoginHistory({
    administratorId: admin.id,
    administratorEmail: admin.email,
    loginTime: new Date().toISOString(),
    logoutTime: null,
    ipAddress: '10.0.0.1',
    browserDevice: 'Mock Browser',
    result: 'success',
  })

  const tokens = createMockTokens(admin.id)
  return { ...tokens, administrator: admin }
}

export async function mockLogin(payload: SignInRequest): Promise<LoginResponse> {
  const response = await mockSignIn(payload)
  return { ...response, admin: response.administrator }
}

export async function mockRefresh(refreshToken: string): Promise<RefreshResponse> {
  await delay(180)
  const payload = decodeMockJwt(refreshToken)
  const adminId = typeof payload?.sub === 'string' ? payload.sub : activeSessionAdminId
  if (!adminId) {
    throw { code: 'UNAUTHORIZED', message: 'Session is not valid', status: 401 }
  }
  const admin = mockAdmins.find((item) => item.id === adminId)
  if (!admin || admin.status !== 'active') {
    throw { code: 'UNAUTHORIZED', message: 'Session is not valid', status: 401 }
  }
  activeSessionAdminId = adminId
  return createMockTokens(adminId)
}

export async function mockSignOut(): Promise<{ success: true }> {
  await delay(120)
  activeSessionAdminId = null
  return { success: true }
}

export async function mockLogout(): Promise<{ success: true }> {
  return mockSignOut()
}

export async function mockGetSession(): Promise<SessionResponse> {
  await delay()
  const admin = getActiveAdmin()
  const tokens = createMockTokens(admin.id)
  return {
    administrator: admin,
    session: { valid: true, expiresAt: tokens.expiresAt },
  }
}

export async function mockMe(): Promise<MockAdministrator> {
  await delay()
  return getActiveAdmin()
}

export async function mockChangePassword(payload: {
  currentPassword: string
  newPassword: string
}): Promise<{ success: true }> {
  await delay()
  const admin = getActiveAdmin()
  if (payload.currentPassword !== getAdminPassword(admin.id)) {
    throw {
      code: 'INVALID_CURRENT_PASSWORD',
      message: 'Current password is incorrect.',
      status: 400,
    }
  }
  if (payload.newPassword.length < 8) {
    throw {
      code: 'PASSWORD_POLICY_VIOLATION',
      message: 'New password does not meet security requirements.',
      status: 400,
    }
  }
  setAdminPassword(admin.id, payload.newPassword)
  return { success: true }
}

export async function mockRequestPasswordReset(payload: { email: string }): Promise<{ success: true }> {
  await delay()
  const admin = findAdminByEmail(payload.email)
  if (admin) {
    const proof = `reset-${admin.id}-${Date.now()}`
    resetProofs.set(proof, { adminId: admin.id, expiresAt: Date.now() + 3600_000 })
  }
  return { success: true }
}

export async function mockCompletePasswordReset(payload: {
  resetProof: string
  newPassword: string
}): Promise<{ success: true }> {
  await delay()
  const proof = resetProofs.get(payload.resetProof)
  if (!proof || proof.expiresAt < Date.now()) {
    throw {
      code: 'INVALID_RESET_PROOF',
      message: 'This reset link is invalid or has expired.',
      status: 400,
    }
  }
  if (payload.newPassword.length < 8) {
    throw {
      code: 'PASSWORD_POLICY_VIOLATION',
      message: 'New password does not meet security requirements.',
      status: 400,
    }
  }
  setAdminPassword(proof.adminId, payload.newPassword)
  resetProofs.delete(payload.resetProof)
  activeSessionAdminId = null
  return { success: true }
}

export async function mockListLoginHistory(
  params: ListQueryParams & {
    administratorId?: string
    from?: string
    to?: string
    result?: MockLoginHistoryEntry['result']
  } = {},
): Promise<PaginatedResponse<MockLoginHistoryEntry>> {
  await delay()
  let filtered = [...mockLoginHistory]

  if (params.administratorId) {
    filtered = filtered.filter((item) => item.administratorId === params.administratorId)
  }
  if (params.result) {
    filtered = filtered.filter((item) => item.result === params.result)
  }
  if (params.from) {
    filtered = filtered.filter((item) => item.loginTime >= params.from!)
  }
  if (params.to) {
    filtered = filtered.filter((item) => item.loginTime <= params.to!)
  }

  return paginate(filtered, params)
}

export async function mockMetricsSummary() {
  await delay()
  return metricsSummaryData
}

export async function mockMetricsGrowth() {
  await delay()
  return { series: mockGrowthSeries, asOf: new Date().toISOString() }
}

export async function mockMetricsSubscriptions() {
  await delay()
  return {
    distribution: mockSubscriptionDistribution,
    expiringSoon: mockSubscriptions.filter((sub) => sub.status === 'active').slice(0, 2),
  }
}

export async function mockMetricsPlatform() {
  await delay()
  return {
    usage: mockPlatformUsage,
    health: { uptime: 99.98, errorRate: 0.12, p95Ms: 182 },
  }
}

export async function mockRecentActivity(limit = 8): Promise<MockAuditEvent[]> {
  await delay()
  return mockActivity.slice(0, limit)
}

export async function mockDashboardSummary(_filters?: unknown) {
  await delay()
  return dashboardSummaryData
}

export async function mockDashboardStatistics(_filters?: unknown) {
  await delay()
  return dashboardStatisticsData
}

export async function mockGrowthAnalytics(_filters?: unknown) {
  await delay()
  return growthAnalyticsData
}

export async function mockSubscriptionAnalytics(_filters?: unknown) {
  await delay()
  return subscriptionAnalyticsData
}

export async function mockCompanyRankings(_filters?: unknown, limit = 5) {
  await delay()
  const slice = <T>(items: T[]) => items.slice(0, limit)
  return {
    mostActive: slice(mockCompanyRankingsData.mostActive),
    leastActive: slice(mockCompanyRankingsData.leastActive),
    newest: slice(mockCompanyRankingsData.newest),
    mostUsers: slice(mockCompanyRankingsData.mostUsers),
    highestTransactionVolume: slice(mockCompanyRankingsData.highestTransactionVolume),
  }
}

export async function mockDashboardRecentActivities(_filters?: unknown, limit = 8) {
  await delay()
  const items = dashboardRecentActivitiesData.slice(0, limit)
  return { items, total: dashboardRecentActivitiesData.length }
}

export async function mockAttentionCompanies(_filters?: unknown, limit = 10) {
  await delay()
  return { items: attentionCompaniesData.slice(0, limit) } as AttentionCompaniesResponse
}

export async function mockQuickActions() {
  await delay()
  return { items: quickActionsData }
}

export async function mockListCompanies(params?: ListQueryParams & { status?: string }): Promise<PaginatedResponse<MockCompany>> {
  await delay()
  let items = [...mockCompanies]
  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter((c) => c.name.toLowerCase().includes(q))
  }
  if (params?.status) {
    items = items.filter((c) => c.status === params.status)
  }
  return paginate(items, params)
}

export async function mockGetCompany(id: string): Promise<MockCompany> {
  await delay()
  const company = mockCompanies.find((item) => item.id === id)
  if (!company) throw { code: 'NOT_FOUND', message: 'Company not found' }
  return company
}

export async function mockCreateCompany(payload: {
  name: string
  email?: string
  contactEmail?: string
  contactNumber?: string
  address?: string
  locale?: string
}): Promise<MockCompany> {
  await delay()
  if (mockCompanies.some((item) => item.name.toLowerCase() === payload.name.trim().toLowerCase())) {
    throw { code: 'CONFLICT', message: 'A company with this name already exists', status: 409 }
  }
  const company: MockCompany = {
    id: `co-${Date.now()}`,
    name: payload.name.trim(),
    status: 'registered',
    registeredAt: new Date().toISOString(),
    activatedAt: null,
    deactivatedAt: null,
    ownerCount: 0,
    userCount: 0,
    branchCount: 0,
    warehouseCount: 0,
    vehicleCount: 0,
    subscriptionId: null,
    email: payload.email ?? payload.contactEmail ?? null,
    contactNumber: payload.contactNumber ?? null,
    address: payload.address ?? null,
  }
  mockCompanies.unshift(company)
  recordCompanyAudit(company.id, 'company.created', `Created company ${company.name}`)
  return company
}

export async function mockUpdateCompany(
  id: string,
  payload: { name: string; contactEmail?: string; locale?: string },
): Promise<MockCompany> {
  await delay()
  const company = await mockGetCompany(id)
  company.name = payload.name.trim()
  recordCompanyAudit(id, 'company.updated', `Updated company ${company.name}`)
  return company
}

export async function mockGetCompanyStatistics(id: string) {
  await delay()
  return (
    mockCompanyStatistics[id] ?? {
      companyId: id,
      transactionVolume: 0,
      tripVolume: 0,
      expenseVolume: 0,
      activeUsers: 0,
      lastActivityAt: null,
    }
  )
}

export async function mockGetCompanyOwners(companyId: string) {
  await delay()
  return mockCompanyOwners.filter((owner) => owner.companyId === companyId)
}

export async function mockGetCompanyNotes(companyId: string): Promise<MockAdministrativeNote[]> {
  await delay()
  return mockNotes.filter((note) => note.companyId === companyId)
}

export async function mockGetCompanyTimeline(companyId: string) {
  await delay()
  return mockActivity
    .filter((event) => event.targetType === 'company' && event.targetId === companyId)
    .map((event) => ({
      id: event.id,
      companyId,
      type: event.action,
      summary: typeof event.metadata.summary === 'string' ? event.metadata.summary : event.action.replace(/\./g, ' '),
      at: event.createdAt,
      actorLabel: event.actorName,
    }))
}

export async function mockAddCompanyNote(
  companyId: string,
  body: string,
): Promise<MockAdministrativeNote> {
  await delay()
  const note: MockAdministrativeNote = {
    id: `note-${Date.now()}`,
    targetType: 'company',
    targetId: companyId,
    companyId,
    body,
    authorAdminId: mockCurrentAdmin.id,
    createdBy: { id: mockCurrentAdmin.id, label: mockCurrentAdmin.name },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockNotes.unshift(note)
  recordCompanyAudit(companyId, 'company.note_added', 'Added an administrative note')
  return note
}

export async function mockUpdateCompanyNote(
  companyId: string,
  noteId: string,
  body: string,
): Promise<MockAdministrativeNote> {
  await delay()
  const note = mockNotes.find((item) => item.id === noteId && item.companyId === companyId)
  if (!note) throw { code: 'NOT_FOUND', message: 'Note not found' }
  note.body = body
  note.updatedAt = new Date().toISOString()
  return note
}

export async function mockActivateCompany(id: string): Promise<MockCompany> {
  await delay()
  const company = await mockGetCompany(id)
  company.status = 'active'
  company.activatedAt = new Date().toISOString()
  recordCompanyAudit(id, 'company.activated', `Activated company ${company.name}`)
  return company
}

export async function mockDeactivateCompany(id: string): Promise<MockCompany> {
  await delay()
  const company = await mockGetCompany(id)
  company.status = 'deactivated'
  company.deactivatedAt = new Date().toISOString()
  recordCompanyAudit(id, 'company.deactivated', `Deactivated company ${company.name}`)
  return company
}

export async function mockListSubscriptions(
  params?: ListQueryParams,
): Promise<PaginatedResponse<MockSubscription>> {
  await delay()
  return paginate(mockSubscriptions, params)
}

export async function mockGetSubscription(id: string): Promise<MockSubscription> {
  await delay()
  const subscription = mockSubscriptions.find((item) => item.id === id)
  if (!subscription) throw { code: 'NOT_FOUND', message: 'Subscription not found' }
  return subscription
}

export async function mockCreateSubscription(
  payload: Pick<MockSubscription, 'companyId' | 'planCode'> & {
    planName?: string
    status?: string
    startsAt?: string
    endsAt?: string
  },
): Promise<MockSubscription> {
  await delay()
  const company = mockCompanies.find((item) => item.id === payload.companyId)
  const planName = payload.planName ?? payload.planCode
  const subscription: MockSubscription = {
    id: `sub-${Date.now()}`,
    companyId: payload.companyId,
    companyName: company?.name ?? 'Unknown Company',
    planCode: planName,
    planName,
    status: payload.status ?? 'TRIAL',
    startsAt: payload.startsAt ?? new Date().toISOString(),
    endsAt: payload.endsAt ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    renewedAt: null,
    suspendedAt: null,
  }
  mockSubscriptions.unshift(subscription)
  return subscription
}

export async function mockRenewSubscription(id: string): Promise<MockSubscription> {
  await delay()
  const subscription = await mockGetSubscription(id)
  subscription.status = 'active'
  subscription.renewedAt = new Date().toISOString()
  subscription.endsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  subscription.suspendedAt = null
  return subscription
}

export async function mockSuspendSubscription(id: string): Promise<MockSubscription> {
  await delay()
  const subscription = await mockGetSubscription(id)
  subscription.status = 'suspended'
  subscription.suspendedAt = new Date().toISOString()
  return subscription
}

export async function mockExpireSubscription(id: string): Promise<MockSubscription> {
  await delay()
  const subscription = await mockGetSubscription(id)
  if (subscription.status === 'expired') {
    throw { code: 'INVALID_TRANSITION', message: 'Subscription is already expired', status: 400 }
  }
  subscription.status = 'expired'
  mockActivity.unshift({
    id: `evt-${Date.now()}`,
    action: 'subscription.expired',
    actorAdminId: getActiveAdmin().id,
    actorName: getActiveAdmin().name,
    targetType: 'subscription',
    targetId: id,
    metadata: { summary: `Expired subscription ${id}` },
    createdAt: new Date().toISOString(),
  })
  return subscription
}

export async function mockListCompanySubscriptions(companyId: string) {
  await delay()
  return mockSubscriptions.filter((item) => item.companyId === companyId)
}

export async function mockGetSubscriptionNotes(id: string) {
  await delay()
  return mockNotes.filter((n) => n.targetId === id || (n as { subscriptionId?: string }).subscriptionId === id)
}

export async function mockAddSubscriptionNote(id: string, body: string) {
  await delay()
  const note: MockAdministrativeNote = {
    id: `note-${Date.now()}`,
    targetType: 'company',
    targetId: id,
    companyId: (await mockGetSubscription(id)).companyId,
    body,
    authorAdminId: mockCurrentAdmin.id,
    createdBy: { id: mockCurrentAdmin.id, label: mockCurrentAdmin.name },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockNotes.unshift(note)
  return note
}

export async function mockCreateCompanyAccount(
  companyId: string,
  payload: {
    firstName: string
    lastName: string
    weeklySalary?: number
    account: {
      email: string
      password: string
      confirmPassword: string
      role: string
    }
  },
) {
  await delay()
  await mockGetCompany(companyId)
  if (payload.account.password !== payload.account.confirmPassword) {
    throw { code: 'VALIDATION_ERROR', message: 'Passwords must match', status: 400 }
  }
  const owner = {
    id: `usr-${Date.now()}`,
    companyId,
    name: `${payload.firstName} ${payload.lastName}`.trim(),
    email: payload.account.email,
    status: 'active' as const,
    locked: false,
    lastLoginAt: null,
    role: payload.account.role,
    passwordChangeRequired: false,
  }
  mockCompanyOwners.unshift(owner)
  recordCompanyAudit(companyId, 'admin.account_created', `Created ${payload.account.role} ${owner.email}`)
  return {
    employee: {
      id: `emp-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      weeklySalary: payload.weeklySalary ?? 0,
    },
    user: {
      id: owner.id,
      email: owner.email,
      role: payload.account.role,
      status: 'ACTIVE',
    },
    linkedUser: {
      id: owner.id,
      email: owner.email,
      role: payload.account.role,
      status: 'ACTIVE',
    },
  }
}

export async function mockListCompanyAccounts(companyId: string) {
  await delay()
  await mockGetCompany(companyId)
  return mockCompanyOwners
    .filter((owner) => owner.companyId === companyId)
    .map((owner) => {
      const [firstName, ...rest] = (owner.name || '').split(' ')
      return {
        userId: owner.id,
        employeeId: null as string | null,
        email: owner.email,
        role: owner.role ?? 'OWNER',
        status: owner.status === 'active' ? 'ACTIVE' : 'INACTIVE',
        firstName: firstName || null,
        lastName: rest.join(' ') || null,
        passwordChangeRequired: Boolean(owner.passwordChangeRequired),
        lastLoginAt: owner.lastLoginAt,
      }
    })
}

export async function mockResetCompanyAccountPassword(
  companyId: string,
  userId: string,
  temporaryPassword: string,
) {
  await delay()
  if (temporaryPassword.trim().length < 8) {
    throw { code: 'VALIDATION_ERROR', message: 'Temporary password must be at least 8 characters', status: 400 }
  }
  const owner = mockCompanyOwners.find((item) => item.id === userId && item.companyId === companyId)
  if (!owner) throw { code: 'NOT_FOUND', message: 'Account not found', status: 404 }
  ;(owner).passwordChangeRequired = true
  recordCompanyAudit(companyId, 'user.password_admin_reset', `Password reset for ${owner.email}`)
  return {
    userId: owner.id,
    employeeId: null as string | null,
    passwordChangeRequired: true as const,
  }
}

export async function mockCreateOwner(
  companyId: string,
  payload: { name: string; email: string },
): Promise<(typeof mockCompanyOwners)[number]> {
  await delay()
  if (mockCompanyOwners.some((o) => o.email.toLowerCase() === payload.email.toLowerCase())) {
    throw { code: 'CONFLICT', message: 'Owner email already exists', status: 409 }
  }
  const owner = {
    id: `usr-${Date.now()}`,
    companyId,
    name: payload.name,
    email: payload.email,
    status: 'active' as const,
    locked: false,
    lastLoginAt: null,
  }
  mockCompanyOwners.unshift(owner)
  recordCompanyAudit(companyId, 'owner.created', `Created owner ${owner.email}`)
  return owner
}

export async function mockGetOwner(id: string) {
  await delay()
  const owner = mockCompanyOwners.find((item) => item.id === id)
  if (!owner) throw { code: 'NOT_FOUND', message: 'Owner not found' }
  return owner
}

export async function mockUpdateOwner(id: string, payload: { name?: string; email?: string }) {
  await delay()
  const owner = await mockGetOwner(id)
  if (payload.name) owner.name = payload.name
  if (payload.email) owner.email = payload.email
  recordCompanyAudit(owner.companyId, 'owner.updated', `Updated owner ${owner.email}`)
  return owner
}

export async function mockActivateOwner(id: string) {
  await delay()
  const owner = await mockGetOwner(id)
  owner.status = 'active'
  recordCompanyAudit(owner.companyId, 'owner.activated', `Activated owner ${owner.email}`)
  return owner
}

export async function mockDeactivateOwner(id: string) {
  await delay()
  const owner = await mockGetOwner(id)
  owner.status = 'inactive'
  recordCompanyAudit(owner.companyId, 'owner.deactivated', `Deactivated owner ${owner.email}`)
  return owner
}

export async function mockLockOwner(id: string) {
  await delay()
  const owner = await mockGetOwner(id)
  owner.locked = true
  recordCompanyAudit(owner.companyId, 'owner.locked', `Locked owner ${owner.email}`)
  return owner
}

export async function mockUnlockOwner(id: string) {
  await delay()
  const owner = await mockGetOwner(id)
  owner.locked = false
  recordCompanyAudit(owner.companyId, 'owner.unlocked', `Unlocked owner ${owner.email}`)
  return owner
}

export async function mockResetOwnerPassword(id: string) {
  await delay()
  const owner = await mockGetOwner(id)
  recordCompanyAudit(owner.companyId, 'owner.password_reset', `Password reset for ${owner.email}`)
  return { accepted: true as const, message: 'Password reset email queued' }
}

export async function mockGetOwnerLoginHistory(id: string, params?: ListQueryParams) {
  await delay()
  await mockGetOwner(id)
  const items = [
    {
      id: `olh-${id}-1`,
      at: new Date().toISOString(),
      success: true,
      result: 'success',
      ip: '10.0.0.40',
      userAgent: 'Chrome / macOS',
    },
  ]
  return paginate(items, params)
}

export async function mockGetOwnerActivitySummary(id: string) {
  await delay()
  await mockGetOwner(id)
  return {
    ownerId: id,
    recentActions: mockActivity
      .filter((e) => e.targetId === id)
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        summary: typeof e.metadata.summary === 'string' ? e.metadata.summary : e.action,
        at: e.createdAt,
      })),
  }
}

export async function mockActivateAdministrator(id: string) {
  await delay()
  const admin = await mockGetAdministrator(id)
  admin.status = 'active'
  return admin
}

export async function mockLockAdministrator(id: string) {
  await delay()
  const activeSuper = mockAdmins.filter((a) => a.status === 'active' && a.roles.includes('super_admin'))
  const admin = await mockGetAdministrator(id)
  if (admin.roles.includes('super_admin') && activeSuper.length <= 1 && admin.status === 'active') {
    throw { code: 'LAST_SUPER_ADMIN', message: 'Cannot lock the last Active Super Admin', status: 400 }
  }
  admin.status = 'locked'
  return admin
}

export async function mockUnlockAdministrator(id: string) {
  await delay()
  const admin = await mockGetAdministrator(id)
  admin.status = 'active'
  return admin
}

export async function mockResetAdministratorPassword(id: string) {
  await delay()
  await mockGetAdministrator(id)
  mockActivity.unshift({
    id: `evt-${Date.now()}`,
    action: 'administrator.password_reset',
    actorAdminId: getActiveAdmin().id,
    actorName: getActiveAdmin().name,
    targetType: 'administrator',
    targetId: id,
    metadata: { summary: 'Administrator password reset initiated' },
    createdAt: new Date().toISOString(),
  })
  return { accepted: true as const, message: 'Password reset email queued' }
}

export async function mockListAdministratorLoginHistory(id: string, params?: ListQueryParams) {
  await delay()
  const items = mockLoginHistory
    .filter((h) => h.administratorId === id)
    .map((h) => ({
      id: h.id,
      at: h.loginTime,
      success: h.result === 'success',
      result: h.result,
      ip: h.ipAddress,
      userAgent: h.browserDevice,
    }))
  return paginate(items, params)
}

export async function mockListAdministratorActivity(id: string, params?: ListQueryParams) {
  await delay()
  const items = mockActivity.filter((e) => e.actorAdminId === id || e.targetId === id)
  return paginate(items, params)
}

export async function mockListReports() {
  await delay()
  return [
    { key: 'companies', name: 'Companies', description: 'Company inventory' },
    { key: 'subscriptions', name: 'Subscriptions', description: 'Subscription status' },
    { key: 'users', name: 'Users', description: 'Platform users' },
    { key: 'transactions', name: 'Transactions', description: 'Monitoring volumes' },
    { key: 'trips', name: 'Trips', description: 'Monitoring volumes' },
    { key: 'expenses', name: 'Expenses', description: 'Monitoring volumes' },
    { key: 'growth', name: 'Platform Growth', description: 'Growth trends' },
    { key: 'usage', name: 'Platform Usage', description: 'Usage overview' },
    { key: 'administrative', name: 'Administrative Activities', description: 'Admin actions' },
    { key: 'monthly-growth', name: 'Monthly Growth Report', description: 'Legacy growth summary' },
    { key: 'subscription-health', name: 'Subscription Health', description: 'Renewals and expirations' },
    { key: 'platform-usage', name: 'Platform Usage', description: 'API volume overview' },
  ]
}

export async function mockRunReport(reportKey: string, _filters?: unknown) {
  await delay()
  return mockReport(reportKey)
}

const mockExportJobs: Array<{
  id: string
  dataset: string
  scope: Record<string, unknown>
  status: 'pending' | 'running' | 'ready' | 'failed'
  downloadRef: string | null
  createdAt: string
  completedAt: string | null
}> = []

export async function mockCreateExport(payload: { dataset: string; scope?: Record<string, unknown> }) {
  await delay()
  const allowed = ['companies', 'users', 'subscriptions', 'reports', 'activity']
  if (!allowed.includes(payload.dataset)) {
    throw { code: 'VALIDATION', message: 'Invalid export dataset', status: 400 }
  }
  const job = {
    id: `exp-${Date.now()}`,
    dataset: payload.dataset,
    scope: payload.scope ?? {},
    status: 'ready' as const,
    downloadRef: `mock://exports/${payload.dataset}.csv`,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  }
  mockExportJobs.unshift(job)
  mockActivity.unshift({
    id: `evt-${Date.now()}`,
    action: 'export.requested',
    actorAdminId: getActiveAdmin().id,
    actorName: getActiveAdmin().name,
    targetType: 'export',
    targetId: job.id,
    metadata: { summary: `Export ${payload.dataset}` },
    createdAt: new Date().toISOString(),
  })
  return job
}

export async function mockGetExport(id: string) {
  await delay()
  const job = mockExportJobs.find((item) => item.id === id)
  if (!job) throw { code: 'NOT_FOUND', message: 'Export not found' }
  return job
}

export async function mockListAdministrators(
  params?: ListQueryParams,
): Promise<PaginatedResponse<MockAdministrator>> {
  await delay()
  return paginate(mockAdmins, params)
}

export async function mockGetAdministrator(id: string): Promise<MockAdministrator> {
  await delay()
  const admin = mockAdmins.find((item) => item.id === id)
  if (!admin) throw { code: 'NOT_FOUND', message: 'Administrator not found' }
  return admin
}

export async function mockCreateAdministrator(
  payload: Pick<MockAdministrator, 'email' | 'name' | 'roles'>,
): Promise<MockAdministrator> {
  await delay()
  const admin: MockAdministrator = {
    id: `adm-${Date.now()}`,
    email: payload.email,
    fullName: payload.name,
    name: payload.name,
    roles: payload.roles,
    status: 'active',
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockAdmins.unshift(admin)
  return admin
}

export async function mockUpdateAdministrator(
  id: string,
  payload: Partial<Pick<MockAdministrator, 'roles' | 'status' | 'name'>>,
): Promise<MockAdministrator> {
  await delay()
  const admin = await mockGetAdministrator(id)
  Object.assign(admin, payload, { updatedAt: new Date().toISOString() })
  return admin
}

export async function mockDeactivateAdministrator(id: string): Promise<MockAdministrator> {
  await delay()
  const admin = await mockGetAdministrator(id)
  const activeSuper = mockAdmins.filter((a) => a.status === 'active' && a.roles.includes('super_admin'))
  if (admin.roles.includes('super_admin') && activeSuper.length <= 1 && admin.status === 'active') {
    throw { code: 'LAST_SUPER_ADMIN', message: 'Cannot deactivate the last Active Super Admin', status: 400 }
  }
  admin.status = 'inactive'
  admin.updatedAt = new Date().toISOString()
  return admin
}

export async function mockSearch(q: string, types?: string[]): Promise<MockSearchResult[]> {
  await delay(200)
  const query = q.trim().toLowerCase()
  if (!query) return []

  return mockSearchIndex.filter((result) => {
    const matchesType = !types?.length || types.includes(result.entityType)
    const haystack = `${result.title} ${result.subtitle ?? ''}`.toLowerCase()
    return matchesType && haystack.includes(query)
  })
}

export async function mockListActivity(params?: ListQueryParams): Promise<PaginatedResponse<MockAuditEvent>> {
  await delay()
  return paginate(mockActivity, params)
}

export async function mockListSettings() {
  await delay()
  return mockSettings
}

export async function mockUpdateSetting(key: string, value: unknown) {
  await delay()
  const setting = mockSettings.find((item) => item.key === key)
  if (!setting) throw { code: 'NOT_FOUND', message: 'Setting not found' }
  setting.value = value as typeof setting.value
  setting.updatedAt = new Date().toISOString()
  setting.updatedByAdminId = mockCurrentAdmin.id
  return setting
}

export async function mockAnalytics(reportKey: string) {
  await delay()
  return {
    reportKey,
    generatedAt: new Date().toISOString(),
    series: mockGrowthSeries,
    breakdown: mockSubscriptionDistribution,
  }
}

export async function mockReport(reportKey: string) {
  await delay()
  return {
    reportKey,
    title: reportKey.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    generatedAt: new Date().toISOString(),
    sections: [
      { heading: 'Summary', body: 'Platform growth remains strong across enterprise accounts.' },
      { heading: 'Highlights', body: 'Two subscriptions require attention within the next 14 days.' },
    ],
  }
}

export async function mockTriggerPasswordReset(userId: string) {
  await delay()
  return { userId, status: 'reset_email_sent' as const }
}

export async function mockUnlockUser(userId: string) {
  await delay()
  return { userId, status: 'unlocked' as const }
}

export async function mockSearchUsers(params?: ListQueryParams) {
  await delay()
  const users = mockCompanyOwners.map((owner) => ({
    id: owner.id,
    name: owner.name,
    email: owner.email,
    companyId: owner.companyId,
    status: owner.status,
  }))
  return paginate(users, params)
}

export const mockHandlers = {
  signIn: mockSignIn,
  login: mockLogin,
  refresh: mockRefresh,
  signOut: mockSignOut,
  logout: mockLogout,
  getSession: mockGetSession,
  me: mockMe,
  changePassword: mockChangePassword,
  requestPasswordReset: mockRequestPasswordReset,
  completePasswordReset: mockCompletePasswordReset,
  listLoginHistory: mockListLoginHistory,
  metricsSummary: mockMetricsSummary,
  metricsGrowth: mockMetricsGrowth,
  metricsSubscriptions: mockMetricsSubscriptions,
  metricsPlatform: mockMetricsPlatform,
  recentActivity: mockRecentActivity,
  dashboardSummary: mockDashboardSummary,
  dashboardStatistics: mockDashboardStatistics,
  growthAnalytics: mockGrowthAnalytics,
  subscriptionAnalytics: mockSubscriptionAnalytics,
  companyRankings: mockCompanyRankings,
  dashboardRecentActivities: mockDashboardRecentActivities,
  attentionCompanies: mockAttentionCompanies,
  quickActions: mockQuickActions,
  listCompanies: mockListCompanies,
  getCompany: mockGetCompany,
  createCompany: mockCreateCompany,
  updateCompany: mockUpdateCompany,
  getCompanyStatistics: mockGetCompanyStatistics,
  getCompanyOwners: mockGetCompanyOwners,
  getCompanyNotes: mockGetCompanyNotes,
  getCompanyTimeline: mockGetCompanyTimeline,
  addCompanyNote: mockAddCompanyNote,
  updateCompanyNote: mockUpdateCompanyNote,
  activateCompany: mockActivateCompany,
  deactivateCompany: mockDeactivateCompany,
  createCompanyAccount: mockCreateCompanyAccount,
  listCompanyAccounts: mockListCompanyAccounts,
  resetCompanyAccountPassword: mockResetCompanyAccountPassword,
  createOwner: mockCreateOwner,
  getOwner: mockGetOwner,
  updateOwner: mockUpdateOwner,
  activateOwner: mockActivateOwner,
  deactivateOwner: mockDeactivateOwner,
  lockOwner: mockLockOwner,
  unlockOwner: mockUnlockOwner,
  resetOwnerPassword: mockResetOwnerPassword,
  getOwnerLoginHistory: mockGetOwnerLoginHistory,
  getOwnerActivitySummary: mockGetOwnerActivitySummary,
  listSubscriptions: mockListSubscriptions,
  getSubscription: mockGetSubscription,
  createSubscription: mockCreateSubscription,
  renewSubscription: mockRenewSubscription,
  suspendSubscription: mockSuspendSubscription,
  expireSubscription: mockExpireSubscription,
  listCompanySubscriptions: mockListCompanySubscriptions,
  getSubscriptionNotes: mockGetSubscriptionNotes,
  addSubscriptionNote: mockAddSubscriptionNote,
  listAdministrators: mockListAdministrators,
  getAdministrator: mockGetAdministrator,
  createAdministrator: mockCreateAdministrator,
  updateAdministrator: mockUpdateAdministrator,
  deactivateAdministrator: mockDeactivateAdministrator,
  activateAdministrator: mockActivateAdministrator,
  lockAdministrator: mockLockAdministrator,
  unlockAdministrator: mockUnlockAdministrator,
  resetAdministratorPassword: mockResetAdministratorPassword,
  listAdministratorLoginHistory: mockListAdministratorLoginHistory,
  listAdministratorActivity: mockListAdministratorActivity,
  search: mockSearch,
  listActivity: mockListActivity,
  listSettings: mockListSettings,
  updateSetting: mockUpdateSetting,
  analytics: mockAnalytics,
  report: mockReport,
  listReports: mockListReports,
  runReport: mockRunReport,
  createExport: mockCreateExport,
  getExport: mockGetExport,
  triggerPasswordReset: mockTriggerPasswordReset,
  unlockUser: mockUnlockUser,
  searchUsers: mockSearchUsers,
}
