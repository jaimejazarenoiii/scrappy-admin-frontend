import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="mesh-atmosphere relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--primary)]/15 blur-3xl"
            animate={{ y: [0, 24, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[var(--accent)] blur-3xl"
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[var(--surface)] shadow-elevated ring-1 ring-[var(--border)]"
          >
            <Sparkles className="h-6 w-6 text-[var(--primary)]" aria-hidden />
          </motion.div>
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">{subtitle}</p>
        </div>

        <div className="rounded-3xl bg-[var(--surface)]/85 p-7 shadow-elevated ring-1 ring-[var(--border)] backdrop-blur-xl">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
