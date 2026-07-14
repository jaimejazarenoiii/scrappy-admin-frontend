import type { Role } from '@/shared/types/api'

export interface MockAdministrator {
  id: string
  email: string
  fullName: string
  name: string
  roles: Role[]
  status: 'active' | 'inactive' | 'locked'
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MockLoginHistoryEntry {
  id: string
  administratorId: string
  administratorEmail: string
  loginTime: string
  logoutTime: string | null
  ipAddress: string | null
  browserDevice: string | null
  result: 'success' | 'failure' | 'locked' | 'inactive'
}

export interface MockCompany {
  id: string
  name: string
  status: 'registered' | 'active' | 'inactive' | 'deactivated'
  registeredAt: string
  activatedAt: string | null
  deactivatedAt: string | null
  ownerCount: number
  userCount: number
  branchCount: number
  warehouseCount: number
  vehicleCount: number
  subscriptionId: string | null
  email?: string | null
  contactNumber?: string | null
  address?: string | null
  subscriptionStatus?: string | null
}

export interface MockCompanyStatistics {
  companyId: string
  transactionVolume: number
  tripVolume: number
  expenseVolume: number
  activeUsers: number
  lastActivityAt: string | null
}

export interface MockCompanyOwner {
  id: string
  companyId: string
  name: string
  email: string
  status: 'active' | 'inactive'
  locked: boolean
  lastLoginAt: string | null
  role?: string
  passwordChangeRequired?: boolean
}

export interface MockAdministrativeNote {
  id: string
  targetType: 'company'
  targetId: string
  companyId: string
  body: string
  authorAdminId: string
  createdBy: { id: string; label: string }
  createdAt: string
  updatedAt: string
}

export interface MockSubscription {
  id: string
  companyId: string
  companyName: string
  planCode: string
  planName: string
  status: 'active' | 'suspended' | 'expired' | 'pending' | string
  startsAt: string
  endsAt: string
  renewedAt: string | null
  suspendedAt: string | null
}

export interface MockAuditEvent {
  id: string
  action: string
  actorAdminId: string
  actorName: string
  targetType: string
  targetId: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface MockMetricPoint {
  label: string
  value: number
}

export interface MockPlatformMetric {
  key: string
  value: number
  asOf: string
  series: MockMetricPoint[] | null
}

export interface MockSearchResult {
  entityType: 'company' | 'user' | 'subscription' | 'administrator' | 'note' | 'activity' | 'report'
  entityId: string
  title: string
  subtitle: string | null
  deepLink: string
}

export interface MockAppSetting {
  key: string
  value: string | number | boolean | Record<string, unknown>
  updatedAt: string
  updatedByAdminId: string
}

const now = new Date('2026-07-13T12:00:00.000Z')

function daysAgo(days: number): string {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function toMockAdmin(
  id: string,
  email: string,
  fullName: string,
  roles: Role[],
  status: MockAdministrator['status'],
  lastLoginAt: string | null,
  createdAt: string,
  updatedAt: string,
): MockAdministrator {
  return { id, email, fullName, name: fullName, roles, status, lastLoginAt, createdAt, updatedAt }
}

export const mockAdmins: MockAdministrator[] = [
  toMockAdmin(
    'adm-001',
    'super@scrappy.io',
    'Sofia Mendoza',
    ['super_admin'],
    'active',
    daysAgo(0),
    daysAgo(400),
    daysAgo(1),
  ),
  toMockAdmin(
    'adm-002',
    'ops@scrappy.io',
    'Liam Carter',
    ['admin', 'support'],
    'active',
    daysAgo(1),
    daysAgo(320),
    daysAgo(2),
  ),
  toMockAdmin(
    'adm-003',
    'finance@scrappy.io',
    'Priya Nair',
    ['finance'],
    'active',
    daysAgo(3),
    daysAgo(280),
    daysAgo(5),
  ),
  toMockAdmin(
    'adm-004',
    'analyst@scrappy.io',
    'Noah Brooks',
    ['read_only_analyst'],
    'active',
    daysAgo(2),
    daysAgo(90),
    daysAgo(2),
  ),
  toMockAdmin(
    'adm-005',
    'inactive@scrappy.io',
    'Elena Ruiz',
    ['sales'],
    'inactive',
    daysAgo(45),
    daysAgo(200),
    daysAgo(30),
  ),
  toMockAdmin(
    'adm-006',
    'locked@scrappy.io',
    'Marcus Chen',
    ['admin'],
    'locked',
    daysAgo(10),
    daysAgo(150),
    daysAgo(5),
  ),
]

export const mockCompanies: MockCompany[] = [
  {
    id: 'co-1001',
    name: 'Northwind Logistics',
    status: 'active',
    registeredAt: daysAgo(180),
    activatedAt: daysAgo(175),
    deactivatedAt: null,
    ownerCount: 2,
    userCount: 48,
    branchCount: 6,
    warehouseCount: 4,
    vehicleCount: 22,
    subscriptionId: 'sub-2001',
  },
  {
    id: 'co-1002',
    name: 'Blue Harbor Retail',
    status: 'active',
    registeredAt: daysAgo(120),
    activatedAt: daysAgo(115),
    deactivatedAt: null,
    ownerCount: 1,
    userCount: 31,
    branchCount: 3,
    warehouseCount: 2,
    vehicleCount: 8,
    subscriptionId: 'sub-2002',
  },
  {
    id: 'co-1003',
    name: 'Summit Field Services',
    status: 'inactive',
    registeredAt: daysAgo(90),
    activatedAt: daysAgo(85),
    deactivatedAt: null,
    ownerCount: 1,
    userCount: 12,
    branchCount: 2,
    warehouseCount: 1,
    vehicleCount: 5,
    subscriptionId: 'sub-2003',
  },
  {
    id: 'co-1004',
    name: 'Orion Manufacturing',
    status: 'registered',
    registeredAt: daysAgo(14),
    activatedAt: null,
    deactivatedAt: null,
    ownerCount: 1,
    userCount: 0,
    branchCount: 0,
    warehouseCount: 0,
    vehicleCount: 0,
    subscriptionId: null,
  },
  {
    id: 'co-1005',
    name: 'Cedar Transport Co.',
    status: 'deactivated',
    registeredAt: daysAgo(400),
    activatedAt: daysAgo(390),
    deactivatedAt: daysAgo(20),
    ownerCount: 2,
    userCount: 0,
    branchCount: 4,
    warehouseCount: 2,
    vehicleCount: 16,
    subscriptionId: 'sub-2005',
  },
  {
    id: 'co-1006',
    name: 'Pulse Health Supplies',
    status: 'active',
    registeredAt: daysAgo(60),
    activatedAt: daysAgo(58),
    deactivatedAt: null,
    ownerCount: 3,
    userCount: 67,
    branchCount: 8,
    warehouseCount: 5,
    vehicleCount: 14,
    subscriptionId: 'sub-2006',
  },
]

export const mockSubscriptions: MockSubscription[] = [
  {
    id: 'sub-2001',
    companyId: 'co-1001',
    companyName: 'Northwind Logistics',
    planCode: 'enterprise',
    planName: 'Enterprise',
    status: 'active',
    startsAt: daysAgo(175),
    endsAt: daysAgo(-190),
    renewedAt: daysAgo(10),
    suspendedAt: null,
  },
  {
    id: 'sub-2002',
    companyId: 'co-1002',
    companyName: 'Blue Harbor Retail',
    planCode: 'growth',
    planName: 'Growth',
    status: 'active',
    startsAt: daysAgo(115),
    endsAt: daysAgo(-80),
    renewedAt: null,
    suspendedAt: null,
  },
  {
    id: 'sub-2003',
    companyId: 'co-1003',
    companyName: 'Summit Field Services',
    planCode: 'starter',
    planName: 'Starter',
    status: 'suspended',
    startsAt: daysAgo(85),
    endsAt: daysAgo(-5),
    renewedAt: null,
    suspendedAt: daysAgo(7),
  },
  {
    id: 'sub-2005',
    companyId: 'co-1005',
    companyName: 'Cedar Transport Co.',
    planCode: 'growth',
    planName: 'Growth',
    status: 'expired',
    startsAt: daysAgo(390),
    endsAt: daysAgo(25),
    renewedAt: daysAgo(60),
    suspendedAt: null,
  },
  {
    id: 'sub-2006',
    companyId: 'co-1006',
    companyName: 'Pulse Health Supplies',
    planCode: 'enterprise',
    planName: 'Enterprise',
    status: 'active',
    startsAt: daysAgo(58),
    endsAt: daysAgo(-300),
    renewedAt: null,
    suspendedAt: null,
  },
  {
    id: 'sub-2007',
    companyId: 'co-1004',
    companyName: 'Orion Manufacturing',
    planCode: 'starter',
    planName: 'Starter',
    status: 'pending',
    startsAt: daysAgo(-7),
    endsAt: daysAgo(-180),
    renewedAt: null,
    suspendedAt: null,
  },
]

export const mockNotes: MockAdministrativeNote[] = [
  {
    id: 'note-01',
    targetType: 'company',
    targetId: 'co-1001',
    companyId: 'co-1001',
    body: 'Enterprise onboarding completed. Monitoring trip volume weekly.',
    authorAdminId: 'adm-002',
    createdBy: { id: 'adm-002', label: 'Liam Carter' },
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: 'note-02',
    targetType: 'company',
    targetId: 'co-1003',
    companyId: 'co-1003',
    body: 'Customer requested temporary suspension while restructuring branches.',
    authorAdminId: 'adm-002',
    createdBy: { id: 'adm-002', label: 'Liam Carter' },
    createdAt: daysAgo(8),
    updatedAt: daysAgo(7),
  },
  {
    id: 'note-03',
    targetType: 'company',
    targetId: 'co-1005',
    companyId: 'co-1005',
    body: 'Account deactivated after non-payment. Finance notified.',
    authorAdminId: 'adm-003',
    createdBy: { id: 'adm-003', label: 'Priya Nair' },
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
]

export const mockActivity: MockAuditEvent[] = [
  {
    id: 'evt-001',
    action: 'admin.login',
    actorAdminId: 'adm-001',
    actorName: 'Sofia Mendoza',
    targetType: 'administrator',
    targetId: 'adm-001',
    metadata: { ip: '10.0.0.12' },
    createdAt: daysAgo(0),
  },
  {
    id: 'evt-002',
    action: 'company.deactivated',
    actorAdminId: 'adm-003',
    actorName: 'Priya Nair',
    targetType: 'company',
    targetId: 'co-1005',
    metadata: { reason: 'non_payment' },
    createdAt: daysAgo(20),
  },
  {
    id: 'evt-003',
    action: 'subscription.suspended',
    actorAdminId: 'adm-002',
    actorName: 'Liam Carter',
    targetType: 'subscription',
    targetId: 'sub-2003',
    metadata: {},
    createdAt: daysAgo(7),
  },
  {
    id: 'evt-004',
    action: 'note.added',
    actorAdminId: 'adm-002',
    actorName: 'Liam Carter',
    targetType: 'company',
    targetId: 'co-1003',
    metadata: { noteId: 'note-02' },
    createdAt: daysAgo(8),
  },
  {
    id: 'evt-005',
    action: 'subscription.renewed',
    actorAdminId: 'adm-003',
    actorName: 'Priya Nair',
    targetType: 'subscription',
    targetId: 'sub-2001',
    metadata: { termMonths: 12 },
    createdAt: daysAgo(10),
  },
  {
    id: 'evt-006',
    action: 'user.password_reset',
    actorAdminId: 'adm-002',
    actorName: 'Liam Carter',
    targetType: 'user',
    targetId: 'usr-8821',
    metadata: {},
    createdAt: daysAgo(3),
  },
]

export const mockMetricsSummary = {
  activeCompanies: 4,
  totalUsers: 158,
  attentionCount: 3,
  expiringSubscriptions: 2,
  suspendedSubscriptions: 1,
  asOf: now.toISOString(),
}

export const mockGrowthSeries: MockMetricPoint[] = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 48 },
  { label: 'Mar', value: 53 },
  { label: 'Apr', value: 61 },
  { label: 'May', value: 68 },
  { label: 'Jun', value: 74 },
  { label: 'Jul', value: 82 },
]

export const mockSubscriptionDistribution = [
  { name: 'Enterprise', value: 18 },
  { name: 'Growth', value: 34 },
  { name: 'Starter', value: 22 },
  { name: 'Trial', value: 8 },
]

export const mockPlatformUsage: MockMetricPoint[] = [
  { label: 'Mon', value: 1240 },
  { label: 'Tue', value: 1380 },
  { label: 'Wed', value: 1520 },
  { label: 'Thu', value: 1490 },
  { label: 'Fri', value: 1610 },
  { label: 'Sat', value: 980 },
  { label: 'Sun', value: 860 },
]

export const mockActivityTimeline: MockMetricPoint[] = [
  { label: 'Week 1', value: 42 },
  { label: 'Week 2', value: 55 },
  { label: 'Week 3', value: 48 },
  { label: 'Week 4', value: 63 },
]

export const mockCompanyRankings = [
  { name: 'Northwind', score: 92 },
  { name: 'Pulse Health', score: 88 },
  { name: 'Blue Harbor', score: 76 },
  { name: 'Summit', score: 54 },
  { name: 'Cedar', score: 31 },
]

export const mockSearchIndex: MockSearchResult[] = [
  {
    entityType: 'company',
    entityId: 'co-1001',
    title: 'Northwind Logistics',
    subtitle: 'Active · 48 users',
    deepLink: '/companies/co-1001',
  },
  {
    entityType: 'subscription',
    entityId: 'sub-2003',
    title: 'Summit Field Services — Starter',
    subtitle: 'Suspended',
    deepLink: '/subscriptions/sub-2003',
  },
  {
    entityType: 'administrator',
    entityId: 'adm-002',
    title: 'Liam Carter',
    subtitle: 'ops@scrappy.io',
    deepLink: '/administrators/adm-002',
  },
  {
    entityType: 'note',
    entityId: 'note-02',
    title: 'Summit restructuring note',
    subtitle: 'Company co-1003',
    deepLink: '/companies/co-1003',
  },
  {
    entityType: 'activity',
    entityId: 'evt-003',
    title: 'Subscription suspended',
    subtitle: 'sub-2003',
    deepLink: '/activity',
  },
  {
    entityType: 'report',
    entityId: 'monthly-growth',
    title: 'Monthly Growth Report',
    subtitle: 'Analytics',
    deepLink: '/reports/monthly-growth',
  },
]

export const mockSettings: MockAppSetting[] = [
  {
    key: 'session.timeout_minutes',
    value: 60,
    updatedAt: daysAgo(14),
    updatedByAdminId: 'adm-001',
  },
  {
    key: 'notifications.slack_webhook_enabled',
    value: true,
    updatedAt: daysAgo(30),
    updatedByAdminId: 'adm-001',
  },
  {
    key: 'billing.grace_period_days',
    value: 7,
    updatedAt: daysAgo(60),
    updatedByAdminId: 'adm-003',
  },
]

export const mockCompanyStatistics: Record<string, MockCompanyStatistics> = {
  'co-1001': {
    companyId: 'co-1001',
    transactionVolume: 18420,
    tripVolume: 3260,
    expenseVolume: 912,
    activeUsers: 41,
    lastActivityAt: daysAgo(0),
  },
  'co-1002': {
    companyId: 'co-1002',
    transactionVolume: 9420,
    tripVolume: 1180,
    expenseVolume: 402,
    activeUsers: 27,
    lastActivityAt: daysAgo(1),
  },
}

export const mockCompanyOwners: MockCompanyOwner[] = [
  {
    id: 'usr-1001',
    companyId: 'co-1001',
    name: 'Alex Turner',
    email: 'alex@northwind.io',
    status: 'active',
    locked: false,
    lastLoginAt: daysAgo(1),
  },
  {
    id: 'usr-1002',
    companyId: 'co-1001',
    name: 'Jordan Lee',
    email: 'jordan@northwind.io',
    status: 'active',
    locked: false,
    lastLoginAt: daysAgo(5),
  },
]

export const mockCurrentAdmin = mockAdmins[0]

export const mockLoginHistory: MockLoginHistoryEntry[] = [
  {
    id: 'lh-001',
    administratorId: 'adm-001',
    administratorEmail: 'super@scrappy.io',
    loginTime: daysAgo(0),
    logoutTime: null,
    ipAddress: '10.0.0.12',
    browserDevice: 'Chrome 126 / macOS',
    result: 'success',
  },
  {
    id: 'lh-002',
    administratorId: 'adm-002',
    administratorEmail: 'ops@scrappy.io',
    loginTime: daysAgo(1),
    logoutTime: daysAgo(1),
    ipAddress: '10.0.0.18',
    browserDevice: 'Safari 17 / macOS',
    result: 'success',
  },
  {
    id: 'lh-003',
    administratorId: 'adm-005',
    administratorEmail: 'inactive@scrappy.io',
    loginTime: daysAgo(3),
    logoutTime: null,
    ipAddress: '10.0.0.44',
    browserDevice: 'Firefox 128 / Windows',
    result: 'inactive',
  },
  {
    id: 'lh-004',
    administratorId: 'adm-006',
    administratorEmail: 'locked@scrappy.io',
    loginTime: daysAgo(2),
    logoutTime: null,
    ipAddress: '10.0.0.55',
    browserDevice: 'Chrome 126 / Windows',
    result: 'locked',
  },
  {
    id: 'lh-005',
    administratorId: 'adm-001',
    administratorEmail: 'super@scrappy.io',
    loginTime: daysAgo(5),
    logoutTime: daysAgo(5),
    ipAddress: '10.0.0.12',
    browserDevice: 'Chrome 126 / macOS',
    result: 'success',
  },
  {
    id: 'lh-006',
    administratorId: 'adm-001',
    administratorEmail: 'unknown@scrappy.io',
    loginTime: daysAgo(4),
    logoutTime: null,
    ipAddress: '10.0.0.99',
    browserDevice: 'Chrome 126 / Linux',
    result: 'failure',
  },
]

function encodeMockJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = btoa('mock-signature')
  return `${header}.${body}.${signature}`
}

export function createMockTokens(adminId: string) {
  const issuedAt = Math.floor(Date.now() / 1000)
  return {
    accessToken: encodeMockJwt({ sub: adminId, type: 'access', iat: issuedAt, exp: issuedAt + 3600 }),
    refreshToken: encodeMockJwt({ sub: adminId, type: 'refresh', iat: issuedAt, exp: issuedAt + 604800 }),
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  }
}

// --- A003 Platform Dashboard & Analytics fixtures ---

function buildGrowthPoints(count: number, base: number, step: number) {
  return Array.from({ length: count }, (_, index) => ({
    period: `D${index + 1}`,
    value: base + index * step,
  }))
}

export const mockDashboardSummary = {
  total: 6,
  active: 3,
  trial: 1,
  gracePeriod: 1,
  expired: 0,
  suspended: 1,
  newCompaniesToday: 1,
  newCompaniesThisMonth: 2,
  recentCompanies: [
    {
      companyId: 'co-1004',
      name: 'Orion Manufacturing',
      status: 'registered',
      registeredAt: daysAgo(14),
    },
    {
      companyId: 'co-1006',
      name: 'Pulse Health Supplies',
      status: 'active',
      registeredAt: daysAgo(60),
    },
    {
      companyId: 'co-1002',
      name: 'Blue Harbor Retail',
      status: 'active',
      registeredAt: daysAgo(120),
    },
  ],
}

export const mockDashboardStatistics = {
  users: {
    totalUsers: 158,
    owners: 10,
    managers: 24,
    employees: 124,
    activeUsers: 142,
    inactiveUsers: 12,
    lockedUsers: 4,
    newUsersThisMonth: 18,
  },
  operations: {
    transactions: {
      total: 48210,
      today: 312,
      week: 2140,
      month: 8930,
      inbound: 24105,
      outbound: 24105,
    },
    trips: {
      total: 12840,
      completed: 11920,
      active: 340,
      cancelled: 580,
    },
    totalExpenses: 2840000,
    totalBranches: 23,
    totalWarehouses: 14,
    totalVehicles: 65,
  },
}

export const mockGrowthAnalytics = {
  companies: buildGrowthPoints(7, 4, 1),
  users: buildGrowthPoints(7, 120, 6),
  transactions: buildGrowthPoints(7, 800, 45),
  trips: buildGrowthPoints(7, 180, 12),
  expenses: buildGrowthPoints(7, 32000, 1800),
  subscriptions: buildGrowthPoints(7, 4, 0),
}

export const mockSubscriptionAnalytics = {
  distribution: [
    { status: 'active', count: 3 },
    { status: 'suspended', count: 1 },
    { status: 'expired', count: 1 },
    { status: 'pending', count: 1 },
  ],
  statusBreakdown: {
    active: 3,
    suspended: 1,
    expired: 1,
    pending: 1,
  },
  averageDurationDays: 342,
  expiringSoon: [
    {
      companyId: 'co-1002',
      companyName: 'Blue Harbor Retail',
      subscriptionId: 'sub-2002',
      date: daysAgo(-10),
    },
    {
      companyId: 'co-1003',
      companyName: 'Summit Field Services',
      subscriptionId: 'sub-2003',
      date: daysAgo(-5),
    },
  ],
  recentlyExpired: [
    {
      companyId: 'co-1005',
      companyName: 'Cedar Transport Co.',
      subscriptionId: 'sub-2005',
      date: daysAgo(3),
    },
  ],
  recentlyRenewed: [
    {
      companyId: 'co-1001',
      companyName: 'Northwind Logistics',
      subscriptionId: 'sub-2001',
      date: daysAgo(10),
    },
  ],
}

export const mockCompanyRankingsData = {
  mostActive: [
    { companyId: 'co-1001', name: 'Northwind Logistics', value: 92 },
    { companyId: 'co-1006', name: 'Pulse Health Supplies', value: 88 },
    { companyId: 'co-1002', name: 'Blue Harbor Retail', value: 76 },
    { companyId: 'co-1003', name: 'Summit Field Services', value: 54 },
    { companyId: 'co-1005', name: 'Cedar Transport Co.', value: 31 },
  ],
  leastActive: [
    { companyId: 'co-1004', name: 'Orion Manufacturing', value: 2 },
    { companyId: 'co-1005', name: 'Cedar Transport Co.', value: 8 },
    { companyId: 'co-1003', name: 'Summit Field Services', value: 14 },
    { companyId: 'co-1002', name: 'Blue Harbor Retail', value: 22 },
    { companyId: 'co-1006', name: 'Pulse Health Supplies', value: 28 },
  ],
  newest: [
    { companyId: 'co-1004', name: 'Orion Manufacturing', value: 14, meta: { registeredAt: daysAgo(14) } },
    { companyId: 'co-1006', name: 'Pulse Health Supplies', value: 60, meta: { registeredAt: daysAgo(60) } },
    { companyId: 'co-1002', name: 'Blue Harbor Retail', value: 120, meta: { registeredAt: daysAgo(120) } },
    { companyId: 'co-1003', name: 'Summit Field Services', value: 90, meta: { registeredAt: daysAgo(90) } },
    { companyId: 'co-1001', name: 'Northwind Logistics', value: 180, meta: { registeredAt: daysAgo(180) } },
  ],
  mostUsers: [
    { companyId: 'co-1006', name: 'Pulse Health Supplies', value: 67 },
    { companyId: 'co-1001', name: 'Northwind Logistics', value: 48 },
    { companyId: 'co-1002', name: 'Blue Harbor Retail', value: 31 },
    { companyId: 'co-1003', name: 'Summit Field Services', value: 12 },
    { companyId: 'co-1004', name: 'Orion Manufacturing', value: 0 },
  ],
  highestTransactionVolume: [
    { companyId: 'co-1001', name: 'Northwind Logistics', value: 18420 },
    { companyId: 'co-1006', name: 'Pulse Health Supplies', value: 14280 },
    { companyId: 'co-1002', name: 'Blue Harbor Retail', value: 8640 },
    { companyId: 'co-1003', name: 'Summit Field Services', value: 3120 },
    { companyId: 'co-1005', name: 'Cedar Transport Co.', value: 980 },
  ],
}

export const mockDashboardRecentActivities = [
  {
    id: 'evt-001',
    type: 'company.activated',
    title: 'Company activated',
    timestamp: daysAgo(0),
    actorLabel: 'Sofia Mendoza',
    targetType: 'company',
    targetId: 'co-1006',
    href: '/companies/co-1006',
  },
  {
    id: 'evt-002',
    type: 'company.deactivated',
    title: 'Company deactivated',
    timestamp: daysAgo(1),
    actorLabel: 'Liam Carter',
    targetType: 'company',
    targetId: 'co-1005',
    href: '/companies/co-1005',
  },
  {
    id: 'evt-003',
    type: 'subscription.suspended',
    title: 'Subscription suspended',
    timestamp: daysAgo(2),
    actorLabel: 'Liam Carter',
    targetType: 'subscription',
    targetId: 'sub-2003',
    href: '/subscriptions/sub-2003',
  },
  {
    id: 'evt-004',
    type: 'note.added',
    title: 'Administrative note added',
    timestamp: daysAgo(3),
    actorLabel: 'Liam Carter',
    targetType: 'company',
    targetId: 'co-1003',
    href: '/companies/co-1003',
  },
  {
    id: 'evt-005',
    type: 'subscription.renewed',
    title: 'Subscription renewed',
    timestamp: daysAgo(4),
    actorLabel: 'Priya Nair',
    targetType: 'subscription',
    targetId: 'sub-2001',
    href: '/subscriptions/sub-2001',
  },
  {
    id: 'evt-006',
    type: 'user.password_reset',
    title: 'User password reset',
    timestamp: daysAgo(5),
    actorLabel: 'Liam Carter',
    targetType: 'user',
    targetId: 'usr-8821',
    href: '/activity',
  },
]

export const mockAttentionCompanies = [
  {
    companyId: 'co-1003',
    name: 'Summit Field Services',
    reasons: ['suspended_subscription', 'no_recent_activity'],
  },
  {
    companyId: 'co-1002',
    name: 'Blue Harbor Retail',
    reasons: ['grace_ending_soon'],
  },
  {
    companyId: 'co-1005',
    name: 'Cedar Transport Co.',
    reasons: ['expired_subscription', 'locked_owner'],
  },
]

export const mockQuickActions = [
  { key: 'create_company', label: 'Create company', destination: 'companies', iconKey: 'building' },
  { key: 'view_companies', label: 'View companies', destination: 'companies', iconKey: 'building' },
  {
    key: 'manage_subscriptions',
    label: 'Manage subscriptions',
    destination: 'subscriptions',
    iconKey: 'credit-card',
  },
  {
    key: 'manage_administrators',
    label: 'Manage administrators',
    destination: 'administrators',
    iconKey: 'users',
  },
  { key: 'view_reports', label: 'View reports', destination: 'reports', iconKey: 'file-text' },
  {
    key: 'view_activity_logs',
    label: 'View activity logs',
    destination: 'activity',
    iconKey: 'activity',
  },
]
