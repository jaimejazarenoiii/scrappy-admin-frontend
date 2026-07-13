import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function AuthLoadingScreen() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="mesh-atmosphere flex min-h-screen items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading session"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[var(--surface)] shadow-elevated ring-1 ring-[var(--border)]">
          <Sparkles className="h-6 w-6 animate-pulse text-[var(--primary)]" aria-hidden />
        </div>
        <p className="text-sm text-[var(--muted)]">Restoring your session…</p>
      </motion.div>
    </div>
  )
}
