import { ChangePasswordForm } from '@/features/auth/components/change-password-form'

export function ChangePasswordPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Change password</h1>
        <p className="text-sm text-[var(--muted)]">
          Update your administrator password. Your current session will remain active.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  )
}
