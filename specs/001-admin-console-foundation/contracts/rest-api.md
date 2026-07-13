# REST API Contract (Admin Console ↔ Scrappy API)

**Date**: 2026-07-13  
**Style**: Conventional REST. Paths are planning contracts; align exact prefixes with Scrappy API when integrating.  
**Auth**: `Authorization: Bearer <access_token>` unless noted.

## Conventions

- JSON request/response bodies
- List endpoints support: `page`, `pageSize`, `sort`, `order`, `q`, plus resource-specific filters
- Errors: `{ "code": string, "message": string, "details"?: object }`
- Mutating admin endpoints MUST create an immutable `AuditEvent` server-side
- Responses MUST NEVER include customer passwords or password hashes

## Auth

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/admin/auth/login` | Exchange email/password → access + refresh + admin profile |
| POST | `/admin/auth/refresh` | Exchange refresh → new access (and optionally rotated refresh) |
| POST | `/admin/auth/logout` | Invalidate refresh/session |
| GET | `/admin/auth/me` | Current administrator profile + roles |

## Dashboard / Metrics

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/metrics/summary` | Active companies, users, attention counts |
| GET | `/admin/metrics/growth` | Time-series growth |
| GET | `/admin/metrics/subscriptions` | Subscription distribution / expiring soon |
| GET | `/admin/metrics/platform` | Platform usage / health stats |
| GET | `/admin/activity/recent` | Recent administrative activity feed |

## Companies

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/companies` | List/search/filter/sort/paginate |
| GET | `/admin/companies/:id` | Detail |
| GET | `/admin/companies/:id/statistics` | Monitoring summaries |
| GET | `/admin/companies/:id/owners` | Owners (read) |
| GET | `/admin/companies/:id/notes` | Notes list |
| POST | `/admin/companies/:id/notes` | Add note |
| PATCH | `/admin/companies/:id/notes/:noteId` | Update note |
| POST | `/admin/companies/:id/activate` | Activate |
| POST | `/admin/companies/:id/deactivate` | Deactivate |

## Subscriptions

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/subscriptions` | List/filter |
| GET | `/admin/subscriptions/:id` | Detail |
| POST | `/admin/subscriptions` | Create |
| POST | `/admin/subscriptions/:id/renew` | Renew |
| POST | `/admin/subscriptions/:id/suspend` | Suspend |
| POST | `/admin/subscriptions/:id/expire` | Mark expired (if supported) |

## Administrators

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/administrators` | List |
| GET | `/admin/administrators/:id` | Detail |
| POST | `/admin/administrators` | Create |
| PATCH | `/admin/administrators/:id` | Update roles/status |
| POST | `/admin/administrators/:id/deactivate` | Deactivate |

## Support actions

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/admin/users/:id/password-reset` | Trigger reset; no password returned |
| POST | `/admin/users/:id/unlock` | Unlock account |
| GET | `/admin/users` | User search for support |

## Search, activity, settings, analytics, reports

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/search` | `q` + optional `types[]` → SearchResult[] |
| GET | `/admin/activity` | Filterable activity/audit log |
| GET | `/admin/settings` | List settings |
| PATCH | `/admin/settings/:key` | Update setting (RBAC) |
| GET | `/admin/analytics/:reportKey` | Analytics payloads |
| GET | `/admin/reports/:reportKey` | Report payloads |

## Non-goals (MUST NOT exist on admin console clients)

Endpoints that perform inventory, POS, trip ops, expense ops, attendance, payroll, or warehouse workflows as customer business operations. Summary metric fields only.
