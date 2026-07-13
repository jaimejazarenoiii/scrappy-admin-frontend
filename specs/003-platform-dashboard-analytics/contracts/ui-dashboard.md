# UI Contracts: A003 Dashboard

**Date**: 2026-07-13

## Landing route

- `/dashboard` (default post-login home)
- Requires authenticated Super Admin console access (A002)

## Layout regions (logical)

1. Filter bar (sticky or top of page)
2. Platform Overview summary cards
3. User + Operational statistics
4. Growth charts
5. Subscription overview (chart + lists)
6. Rankings + Attention (two-column on desktop)
7. Recent Activity (+ optional Recent Companies)
8. Quick Actions

## Widget contract

Every widget MUST support: title, loading skeleton, empty state, error + retry, optional “view all” link to module. Failures MUST NOT unmount siblings.

## Filter bar contract

- Fields: date range, subscription status, company status, company picker/search
- Actions: Apply, Reset
- Invalid range: inline error; do not update URL/applied filters
- Apply updates URL → all filter-sensitive widgets refetch

## Navigation rules

| Source | Allowed destinations |
|--------|----------------------|
| Quick Actions | companies, company create, subscriptions, administrators, reports, activity |
| Attention / rankings / activity rows | company detail, subscription detail, activity module |
| Forbidden | customer operational apps/workflows |

## Motion / a11y

- Stagger section enter with reduced-motion fallback
- Charts expose numeric values in UI (not color-only)
- Cards keyboard-focusable when clickable
