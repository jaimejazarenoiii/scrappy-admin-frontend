import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
  showToggle?: boolean
}

export function PasswordInput({ className, showToggle = true, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('h-11 rounded-xl pr-10', className)}
      />
      {showToggle ? (
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      ) : null}
    </div>
  )
}
