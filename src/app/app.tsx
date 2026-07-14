import { useEffect } from 'react'
import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { ErrorBoundary } from '@/app/error-boundary'
import { SessionExpiredDialog } from '@/features/auth/components/session-expired-dialog'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { BrowserRouter } from 'react-router-dom'

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrateSession = useAuthStore((state) => state.hydrateSession)

  useEffect(() => {
    void hydrateSession()
  }, [hydrateSession])

  return <>{children}</>
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AuthHydrator>
            <AppRouter />
            <SessionExpiredDialog />
          </AuthHydrator>
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  )
}
