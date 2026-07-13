import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'
import { Link } from 'react-router-dom'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetProof = searchParams.get('proof') ?? searchParams.get('token') ?? ''

  if (!resetProof) {
    return (
      <AuthLayout title="Reset password" subtitle="This reset link is invalid or incomplete.">
        <p className="text-center text-sm text-[var(--muted)]">
          <Link to="/forgot-password" className="font-medium text-[var(--primary)] hover:underline">
            Request a new reset link
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your administrator account.">
      <ResetPasswordForm resetProof={resetProof} onSuccess={() => navigate('/login', { replace: true })} />
    </AuthLayout>
  )
}
