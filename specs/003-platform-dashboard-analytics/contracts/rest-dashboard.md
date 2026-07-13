# REST Contracts: A003 Dashboard & Analytics (Frontend Integration)

**Date**: 2026-07-13  
**Source of truth**: [spec.md](../spec.md) DASH-01–DASH-08  
**Auth**: `Authorization: Bearer <access_token>`

## Common query filters

`from`, `to`, `subscriptionStatus`, `companyStatus`, `companyId` — as supported per endpoint.

## DASH-01 Summary

- `GET /admin/dashboard/summary`
- **200**: PlatformOverviewMetrics (+ optional recentCompanies preview)
- **Errors**: 400, 401, 403

## DASH-02 Statistics

- `GET /admin/dashboard/statistics`
- **200**: `{ users: UserStatistics, operations: OperationalStatistics }`
- **Errors**: 400, 401, 403

## DASH-03 Growth

- `GET /admin/analytics/growth`
- **Query**: filters + `granularity`
- **200**: GrowthSeriesBundle
- **Errors**: 400, 401, 403

## DASH-04 Subscriptions

- `GET /admin/analytics/subscriptions`
- **Query**: filters + `expiringWithinDays`
- **200**: SubscriptionOverview
- **Errors**: 400, 401, 403

## DASH-05 Rankings

- `GET /admin/analytics/company-rankings`
- **Query**: filters + `limit`
- **200**: CompanyRankingSet
- **Errors**: 400, 401, 403

## DASH-06 Recent activities

- `GET /admin/dashboard/recent-activities`
- **Query**: filters + `limit`/`page`/`pageSize`
- **200**: `{ items: RecentActivityItem[], total? }`
- **Errors**: 400, 401, 403

## DASH-07 Attention companies

- `GET /admin/dashboard/attention-companies`
- **Query**: filters + `limit`
- **200**: `{ items: AttentionCompany[] }`
- **Errors**: 400, 401, 403

## DASH-08 Quick actions

- `GET /admin/dashboard/quick-actions`
- **200**: `{ items: QuickAction[] }`
- **Errors**: 401, 403

## Error envelope

`{ code, message, details? }` — filter validation errors return field-level `details` when available.
