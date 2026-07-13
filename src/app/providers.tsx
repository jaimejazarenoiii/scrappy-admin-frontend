import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Toaster } from '@/shared/ui/toast'
import { useThemeStore } from '@/shared/stores/theme-store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ThemeHydrator({ children }: { children: ReactNode }) {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  useEffect(() => {
    setMode(mode)
  }, [mode, setMode])

  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeHydrator>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </ThemeHydrator>
    </QueryClientProvider>
  )
}
