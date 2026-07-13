# Data Model: A003 — Platform Dashboard & Analytics

**Date**: 2026-07-13  
**Note**: Conceptual client-facing read models. Authoritative aggregation lives on Scrappy API.

## Filter & preference entities

### DashboardFilterSet

| Field | Type | Notes |
|-------|------|-------|
| from | date \| null | Inclusive start |
| to | date \| null | Inclusive end; >= from |
| subscriptionStatus | string \| null | Allowed enum from API |
| companyStatus | string \| null | Allowed enum from API |
| companyId | string \| null | Optional company scope |
| granularity | `day` \| `week` \| `month` | Growth series |
| expiringWithinDays | number | Default 14 |

**Validation**: date order; positive limits; enums from allow-lists.

---

## Metric entities

### PlatformOverviewMetrics

Company totals: total, active, trial, gracePeriod, expired, suspended; newCompaniesToday; newCompaniesThisMonth.

### UserStatistics

totalUsers, owners, managers, employees, activeUsers, inactiveUsers, lockedUsers, newUsersThisMonth.

### OperationalStatistics

transactions (total/today/week/month, inbound, outbound); trips (total/completed/active/cancelled); totalExpenses; totalBranches; totalWarehouses; totalVehicles.

All values: non-negative numbers (monitoring only).

### SubscriptionOverview

distribution: `{ status, count }[]`; statusBreakdown; averageDurationDays; expiringSoon[]; recentlyExpired[]; recentlyRenewed[] (company refs + dates).

### GrowthSeriesBundle

Map/list of series keyed by metric family (companies, users, transactions, trips, expenses, subscriptions); each point `{ period, value }`.

### CompanyRankingSet

mostActive, leastActive, newest, mostUsers, highestTransactionVolume — each `CompanyRankItem[]` (`companyId`, `name`, `value`, optional meta).

### RecentActivityItem

id, type, title, timestamp, actorLabel?, targetType?, targetId?, href?

### AttentionCompany

companyId, name, reasons: (`expired_subscription` \| `suspended_subscription` \| `grace_ending_soon` \| `no_recent_activity` \| `locked_owner`)[]

### QuickAction

key, label, destination (module route key), iconKey?

### RecentCompanyItem (optional card)

companyId, name, status, registeredAt

## Relationships

```text
DashboardFilterSet ──scopes──► all DASH reads
PlatformOverviewMetrics ◄── DASH-01
UserStatistics + OperationalStatistics ◄── DASH-02
GrowthSeriesBundle ◄── DASH-03
SubscriptionOverview ◄── DASH-04
CompanyRankingSet ◄── DASH-05
RecentActivityItem[] ◄── DASH-06
AttentionCompany[] ◄── DASH-07
QuickAction[] ◄── DASH-08
```

## State notes

No mutable domain transitions on the dashboard. Filter apply is the only client state transition (draft → applied → query keys update).
