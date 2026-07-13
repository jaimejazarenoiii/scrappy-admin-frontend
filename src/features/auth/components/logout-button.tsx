import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { Button } from '@/shared/ui/button'
import { showError } from '@/shared/ui/toast'
import { cn } from '@/shared/lib/utils'

interface LogoutButtonProps {
  variant?: 'ghost' | 'outline' | 'default'
  showLabel?: boolean
  className?: string
}

export function LogoutButton({ variant = 'ghost', showLabel = true, className }: LogoutButtonProps) {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to sign out')
    }
  }

  return (
    <Button
      variant={variant}
      size="sm"
      className={cn(className)}
      onClick={() => void handleLogout()}
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {showLabel ? 'Sign out' : null}
    </Button>
  )
}
