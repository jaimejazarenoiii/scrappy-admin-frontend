/**
 * Maps Quick Action keys to admin console routes.
 * Navigation only — no dashboard writes.
 *
 * create_company: navigates to /companies?action=create (company create modal pattern).
 */
const QUICK_ACTION_ROUTES: Record<string, string> = {
  create_company: '/companies/new',
  view_companies: '/companies',
  manage_subscriptions: '/subscriptions',
  manage_administrators: '/administrators',
  view_reports: '/reports',
  view_activity_logs: '/activity',
  manage_settings: '/settings',
  exports: '/exports',
}

export function getQuickActionRoute(key: string, destination?: string): string {
  return QUICK_ACTION_ROUTES[key] ?? destination ?? '/dashboard'
}
