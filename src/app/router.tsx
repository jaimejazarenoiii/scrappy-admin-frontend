import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { UserMenu } from '@/features/auth/components/user-menu'
import { GlobalSearch } from '@/features/search/components/global-search'
import { env } from '@/shared/config/env'
import { AppShell } from '@/shared/layout/app-shell'
import { NotFoundPage } from '@/shared/pages/not-found-page'
import { UnauthorizedPage } from '@/shared/pages/unauthorized-page'
import { RequireAuth } from '@/shared/routing/require-auth'
import { RequireRole } from '@/shared/routing/require-role'
import { Skeleton } from '@/shared/ui/skeleton'

const LoginPage = lazy(() =>
  import('@/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/forgot-password-page').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/reset-password-page').then((m) => ({
    default: m.ResetPasswordPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const CompaniesListPage = lazy(() =>
  import('@/features/companies/pages/companies-list-page').then((m) => ({
    default: m.CompaniesListPage,
  })),
)
const CompanyCreatePage = lazy(() =>
  import('@/features/companies/pages/company-create-page').then((m) => ({
    default: m.CompanyCreatePage,
  })),
)
const OwnerDetailPage = lazy(() =>
  import('@/features/companies/pages/owner-detail-page').then((m) => ({
    default: m.OwnerDetailPage,
  })),
)
const SubscriptionCreatePage = lazy(() =>
  import('@/features/subscriptions/pages/subscription-create-page').then((m) => ({
    default: m.SubscriptionCreatePage,
  })),
)
const ExportsPage = lazy(() =>
  import('@/features/exports/pages/exports-page').then((m) => ({ default: m.ExportsPage })),
)
const CompanyDetailPage = lazy(() =>
  import('@/features/companies/pages/company-detail-page').then((m) => ({ default: m.CompanyDetailPage })),
)
const SubscriptionsListPage = lazy(() =>
  import('@/features/subscriptions/pages/subscriptions-list-page').then((m) => ({
    default: m.SubscriptionsListPage,
  })),
)
const SubscriptionDetailPage = lazy(() =>
  import('@/features/subscriptions/pages/subscription-detail-page').then((m) => ({
    default: m.SubscriptionDetailPage,
  })),
)
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/pages/analytics-page').then((m) => ({ default: m.AnalyticsPage })),
)
const ReportsPage = lazy(() =>
  import('@/features/reports/pages/reports-page').then((m) => ({ default: m.ReportsPage })),
)
const AdministratorsListPage = lazy(() =>
  import('@/features/administrators/pages/administrators-list-page').then((m) => ({
    default: m.AdministratorsListPage,
  })),
)
const AdministratorDetailPage = lazy(() =>
  import('@/features/administrators/pages/administrator-detail-page').then((m) => ({
    default: m.AdministratorDetailPage,
  })),
)
const ActivityListPage = lazy(() =>
  import('@/features/activity/pages/activity-list-page').then((m) => ({ default: m.ActivityListPage })),
)
const SearchPage = lazy(() =>
  import('@/features/search/pages/search-page').then((m) => ({ default: m.SearchPage })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/settings-page').then((m) => ({ default: m.SettingsPage })),
)
const ChangePasswordPage = lazy(() =>
  import('@/features/auth/pages/change-password-page').then((m) => ({
    default: m.ChangePasswordPage,
  })),
)
const LoginHistoryPage = lazy(() =>
  import('@/features/auth/pages/login-history-page').then((m) => ({
    default: m.LoginHistoryPage,
  })),
)

function PageFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function ConsoleShell() {
  // Global search has no live `/admin/search` endpoint yet.
  const searchSlot = env.useMock ? <GlobalSearch /> : undefined
  return <AppShell searchSlot={searchSlot} userMenuSlot={<UserMenu />} />
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<RequireRole roles="super_admin" />}>
            <Route element={<ConsoleShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="companies" element={<CompaniesListPage />} />
              <Route path="companies/new" element={<CompanyCreatePage />} />
              <Route path="companies/:id" element={<CompanyDetailPage />} />
              <Route path="owners/:id" element={<OwnerDetailPage />} />
              <Route path="subscriptions" element={<SubscriptionsListPage />} />
              <Route path="subscriptions/new" element={<SubscriptionCreatePage />} />
              <Route path="subscriptions/:id" element={<SubscriptionDetailPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/:reportKey" element={<ReportsPage />} />
              <Route path="administrators" element={<AdministratorsListPage />} />
              <Route path="administrators/:id" element={<AdministratorDetailPage />} />
              <Route path="activity" element={<ActivityListPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="exports" element={<ExportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account/change-password" element={<ChangePasswordPage />} />
              <Route path="security/login-history" element={<LoginHistoryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
