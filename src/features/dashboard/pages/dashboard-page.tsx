import { motion, useReducedMotion } from 'framer-motion'
import { AttentionCompaniesWidget } from '@/features/dashboard/components/attention-companies-widget'
import { CompanyRankingsWidget } from '@/features/dashboard/components/company-rankings-widget'
import { DashboardFilterBar } from '@/features/dashboard/components/dashboard-filter-bar'
import { GrowthAnalyticsWidget } from '@/features/dashboard/components/growth-analytics-widget'
import { OperationalStatisticsWidget } from '@/features/dashboard/components/operational-statistics-widget'
import { PlatformOverviewWidget } from '@/features/dashboard/components/platform-overview-widget'
import { QuickActionsWidget } from '@/features/dashboard/components/quick-actions-widget'
import { RecentActivityWidget } from '@/features/dashboard/components/recent-activity-widget'
import { RecentCompaniesWidget } from '@/features/dashboard/components/recent-companies-widget'
import { SubscriptionOverviewWidget } from '@/features/dashboard/components/subscription-overview-widget'
import { UserStatisticsWidget } from '@/features/dashboard/components/user-statistics-widget'
import { staggerContainer, staggerItem } from '@/shared/motion/variants'

export function DashboardPage() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="space-y-5">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Platform health
          </p>
          <h1 className="mt-1 text-[1.75rem] font-semibold tracking-tight">Good morning</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Live signals across companies, subscriptions, and support.
          </p>
        </div>
      </motion.div>

      <DashboardFilterBar />

      <PlatformOverviewWidget />

      <motion.div
        variants={staggerContainer}
        initial={reduceMotion ? false : 'initial'}
        animate="animate"
        className="grid gap-4 xl:grid-cols-12"
      >
        <motion.div variants={staggerItem} className="xl:col-span-6">
          <UserStatisticsWidget />
        </motion.div>
        <motion.div variants={staggerItem} className="xl:col-span-6">
          <OperationalStatisticsWidget />
        </motion.div>

        <motion.div variants={staggerItem} className="xl:col-span-12">
          <GrowthAnalyticsWidget />
        </motion.div>

        <motion.div variants={staggerItem} className="xl:col-span-7">
          <SubscriptionOverviewWidget />
        </motion.div>
        <motion.div variants={staggerItem} className="xl:col-span-5">
          <CompanyRankingsWidget />
        </motion.div>

        <motion.div variants={staggerItem} className="xl:col-span-6">
          <AttentionCompaniesWidget />
        </motion.div>
        <motion.div variants={staggerItem} className="xl:col-span-6">
          <RecentActivityWidget />
        </motion.div>

        <motion.div variants={staggerItem} className="xl:col-span-12">
          <RecentCompaniesWidget />
        </motion.div>

        <motion.div variants={staggerItem} className="xl:col-span-12">
          <QuickActionsWidget />
        </motion.div>
      </motion.div>
    </div>
  )
}
