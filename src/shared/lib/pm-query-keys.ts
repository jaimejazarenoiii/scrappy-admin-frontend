/** Query key factory conventions for Platform Management (A004). */

export const pmKeys = {
  all: ['pm'] as const,
  companies: {
    all: ['pm', 'companies'] as const,
    list: (params: unknown) => ['pm', 'companies', 'list', params] as const,
    detail: (id: string) => ['pm', 'companies', 'detail', id] as const,
    statistics: (id: string) => ['pm', 'companies', 'statistics', id] as const,
    timeline: (id: string, params?: unknown) => ['pm', 'companies', 'timeline', id, params] as const,
    notes: (id: string) => ['pm', 'companies', 'notes', id] as const,
    owners: (id: string, params?: unknown) => ['pm', 'companies', 'owners', id, params] as const,
    accounts: (id: string) => ['pm', 'companies', 'accounts', id] as const,
    subscriptions: (id: string) => ['pm', 'companies', 'subscriptions', id] as const,
  },
  owners: {
    all: ['pm', 'owners'] as const,
    detail: (id: string) => ['pm', 'owners', 'detail', id] as const,
    loginHistory: (id: string, params?: unknown) => ['pm', 'owners', 'login-history', id, params] as const,
    activity: (id: string) => ['pm', 'owners', 'activity', id] as const,
  },
  administrators: {
    all: ['pm', 'administrators'] as const,
    list: (params: unknown) => ['pm', 'administrators', 'list', params] as const,
    detail: (id: string) => ['pm', 'administrators', 'detail', id] as const,
    loginHistory: (id: string, params?: unknown) =>
      ['pm', 'administrators', 'login-history', id, params] as const,
    activity: (id: string, params?: unknown) => ['pm', 'administrators', 'activity', id, params] as const,
  },
  subscriptions: {
    all: ['pm', 'subscriptions'] as const,
    list: (params: unknown) => ['pm', 'subscriptions', 'list', params] as const,
    detail: (id: string) => ['pm', 'subscriptions', 'detail', id] as const,
    notes: (id: string) => ['pm', 'subscriptions', 'notes', id] as const,
  },
  activity: {
    all: ['pm', 'activity'] as const,
    list: (params: unknown) => ['pm', 'activity', 'list', params] as const,
  },
  search: {
    all: ['pm', 'search'] as const,
    query: (params: unknown) => ['pm', 'search', params] as const,
  },
  reports: {
    all: ['pm', 'reports'] as const,
    catalog: ['pm', 'reports', 'catalog'] as const,
    result: (key: string, filters: unknown) => ['pm', 'reports', 'result', key, filters] as const,
  },
  settings: {
    all: ['pm', 'settings'] as const,
    list: (category?: string) => ['pm', 'settings', 'list', category ?? 'all'] as const,
  },
  exports: {
    all: ['pm', 'exports'] as const,
    detail: (id: string) => ['pm', 'exports', 'detail', id] as const,
  },
} as const

/** Alias used by feature query-key modules. */
export const pmQueryKeys = pmKeys
