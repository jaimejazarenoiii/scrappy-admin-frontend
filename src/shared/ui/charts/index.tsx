import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReactNode } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/lib/utils'

const CHART_COLORS = ['#0071E3', '#34C759', '#FF9F0A', '#5856D6', '#FF3B30', '#64D2FF']

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-soft)',
  fontSize: 12,
}

export interface ChartContainerProps {
  loading?: boolean
  empty?: boolean
  emptyTitle?: string
  height?: number
  className?: string
  children: ReactNode
}

function ChartContainer({
  loading,
  empty,
  emptyTitle = 'No chart data',
  height = 280,
  className,
  children,
}: ChartContainerProps) {
  if (loading) {
    return <Skeleton className={cn('w-full rounded-2xl', className)} style={{ height }} />
  }

  if (empty) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <EmptyState title={emptyTitle} className="w-full border-none bg-transparent shadow-none" />
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

export interface GrowthLineChartProps {
  data: Array<{ label: string; value: number }>
  loading?: boolean
  className?: string
}

export function GrowthLineChart({ data, loading, className }: GrowthLineChartProps) {
  return (
    <ChartContainer loading={loading} empty={data.length === 0} className={className}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--primary)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export interface DistributionPieChartProps {
  data: Array<{ name: string; value: number }>
  loading?: boolean
  className?: string
}

export function DistributionPieChart({ data, loading, className }: DistributionPieChartProps) {
  return (
    <ChartContainer loading={loading} empty={data.length === 0} className={className}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}

export interface ActivityTimelineChartProps {
  data: Array<{ label: string; events: number }>
  loading?: boolean
  className?: string
}

export function ActivityTimelineChart({ data, loading, className }: ActivityTimelineChartProps) {
  return (
    <ChartContainer loading={loading} empty={data.length === 0} className={className}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="events" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ChartContainer>
  )
}

export interface UsageAreaChartProps {
  data: Array<{ label: string; usage: number }>
  loading?: boolean
  className?: string
}

export function UsageAreaChart({ data, loading, className }: UsageAreaChartProps) {
  return (
    <ChartContainer loading={loading} empty={data.length === 0} className={className}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="usage"
          stroke="var(--primary)"
          fill="url(#usageGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export interface RankingsBarChartProps {
  data: Array<{ name: string; score: number }>
  loading?: boolean
  className?: string
}

export function RankingsBarChart({ data, loading, className }: RankingsBarChartProps) {
  return (
    <ChartContainer loading={loading} empty={data.length === 0} className={className}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="score" fill="var(--primary)" radius={[0, 8, 8, 0]} maxBarSize={20} />
      </BarChart>
    </ChartContainer>
  )
}

export interface MultiSeriesGrowthChartProps {
  series: Array<{
    key: string
    label: string
    data: Array<{ label: string; value: number }>
  }>
  activeKey?: string
  loading?: boolean
  className?: string
}

export function MultiSeriesGrowthChart({
  series,
  activeKey,
  loading,
  className,
}: MultiSeriesGrowthChartProps) {
  const active = series.find((item) => item.key === activeKey) ?? series[0]
  const chartData = active?.data ?? []

  return (
    <ChartContainer loading={loading} empty={chartData.length === 0} className={className}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--primary)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
