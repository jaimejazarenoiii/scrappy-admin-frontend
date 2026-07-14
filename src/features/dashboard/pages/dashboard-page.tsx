import { motion, useReducedMotion } from 'framer-motion'
import { AttentionCompaniesWidget } from '@/features/dashboard/components/attention-companies-widget'
import { CompanyRankingsWidget } from '@/features/dashboard/components/company-rankings-widget'
import { DashboardFilterBar } from '@/features/dashboard/components/dashboard-filter-bar'
import { DashboardQuickLinks } from '@/features/dashboard/components/dashboard-quick-links'
import { GrowthAnalyticsWidget } from '@/features/dashboard/components/growth-analytics-widget'
import { OperationalStatisticsWidget } from '@/features/dashboard/components/operational-statistics-widget'
import { PlatformOverviewWidget } from '@/features/dashboard/components/platform-overview-widget'
import { RecentActivityWidget } from '@/features/dashboard/components/recent-activity-widget'
import { RecentCompaniesWidget } from '@/features/dashboard/components/recent-companies-widget'
import { SubscriptionOverviewWidget } from '@/features/dashboard/components/subscription-overview-widget'
import { UserStatisticsWidget } from '@/features/dashboard/components/user-statistics-widget'
import { staggerContainer, staggerItem } from '@/shared/motion/variants'

export function DashboardPage() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="space-y-6">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Operations
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Platform overview
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Entitlement health, growth, and companies that need action — scanned in one composition.
          </p>
        </div>
        <DashboardQuickLinks />
      </motion.header>

      <DashboardFilterBar />

      <PlatformOverviewWidget />

      <motion.div
        variants={staggerContainer}
        initial={reduceMotion ? false : 'initial'}
        animate="animate"
        className="grid gap-5 xl:grid-cols-12"
      >
        {/* Primary workbench: trend + attention rail */}
        <motion.div variants={staggerItem} className="space-y-5 xl:col-span-8">
          <GrowthAnalyticsWidget />
          <div className="grid gap-5 lg:grid-cols-2">
            <UserStatisticsWidget />
            <OperationalStatisticsWidget />
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col gap-5 xl:col-span-4">
          <AttentionCompaniesWidget />
          <RecentActivityWidget />
          <RecentCompaniesWidget />
        </motion.div>

        {/* Secondary band */}
        <motion.div variants={staggerItem} className="xl:col-span-7">
          <SubscriptionOverviewWidget />
        </motion.div>
        <motion.div variants={staggerItem} className="xl:col-span-5">
          <CompanyRankingsWidget />
        </motion.div>
      </motion.div>
    </div>
  )
}
