import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { pageFade } from '@/shared/motion/variants'
import { Sidebar } from '@/shared/layout/sidebar'
import { TopBar } from '@/shared/layout/top-bar'
import type { ReactNode } from 'react'

export interface AppShellProps {
  searchSlot?: ReactNode
  userMenuSlot?: ReactNode
}

export function AppShell({ searchSlot, userMenuSlot }: AppShellProps) {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <div className="mesh-atmosphere flex min-h-screen">
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar searchSlot={searchSlot} userMenuSlot={userMenuSlot} />
        <main className="flex-1 p-4 md:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageFade}
              initial={reduceMotion ? false : 'initial'}
              animate="animate"
              exit={reduceMotion ? undefined : 'exit'}
              className="mx-auto w-full max-w-[1400px]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
