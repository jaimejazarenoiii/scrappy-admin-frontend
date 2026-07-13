import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthLoadingScreen } from '@/features/auth/components/auth-loading-screen'
import { useAuthStore } from '@/features/auth/store/auth-store'

interface RequireAuthProps {
  children?: React.ReactNode
  loginPath?: string
}

export function RequireAuth({ children, loginPath = '/login' }: RequireAuthProps) {
  const location = useLocation()
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!hydrated) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />
  }

  return children ? <>{children}</> : <Outlet />
}
