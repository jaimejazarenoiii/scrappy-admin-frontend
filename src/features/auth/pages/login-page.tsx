import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { canEnterConsole } from '@/shared/lib/rbac'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { AuthLoadingScreen } from '@/features/auth/components/auth-loading-screen'
import { LoginForm } from '@/features/auth/components/login-form'
import { useAuthStore } from '@/features/auth/store/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const admin = useAuthStore((state) => state.admin)

  if (!hydrated) {
    return <AuthLoadingScreen />
  }

  if (isAuthenticated && admin) {
    if (canEnterConsole(admin.roles)) {
      const redirectTo =
        (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'
      return <Navigate to={redirectTo} replace />
    }
    return <Navigate to="/unauthorized" replace />
  }

  const handleSuccess = () => {
    const current = useAuthStore.getState().admin
    if (current && !canEnterConsole(current.roles)) {
      navigate('/unauthorized', { replace: true })
      return
    }
    const redirectTo =
      (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout
      title="Scrappy Admin"
      subtitle="Internal platform operations — quiet, precise, human."
    >
      <LoginForm onSuccess={handleSuccess} />
      <p className="mt-5 text-center text-[11px] leading-relaxed text-[var(--muted)]">
        Demo · Super Admin{' '}
        <span className="font-mono-value text-[var(--foreground)]">super@scrappy.io</span> · password{' '}
        <span className="font-mono-value text-[var(--foreground)]">admin123</span>
      </p>
    </AuthLayout>
  )
}
