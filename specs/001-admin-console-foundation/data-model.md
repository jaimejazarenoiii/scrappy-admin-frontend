# Data Model: A001 — Scrappy Admin Console Foundation

**Date**: 2026-07-13  
**Note**: Conceptual client-side domain model mirroring Scrappy Admin REST resources. Persistence and authoritative validation live on the API.

## Entities

### Administrator

| Field | Type | Notes |
|-------|------|-------|
| id | string | Stable identifier |
| email | string | Login identity |
| name | string | Display name |
| roles | Role[] | One or more internal roles |
| status | `active` \| `inactive` \| `locked` | |
| lastLoginAt | datetime \| null | |
| createdAt / updatedAt | datetime | |

**Roles**: `super_admin` \| `admin` \| `support` \| `finance` \| `sales` \| `read_only_analyst`

**Validation**: email required; at least one role; customer-facing roles NEVER assigned.

**Relationships**: authors AdministrativeNotes; produces AuditEvents.

---

### Company

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| name | string | |
| status | `registered` \| `active` \| `inactive` \| `deactivated` | Lifecycle |
| registeredAt | datetime | |
| activatedAt | datetime \| null | |
| deactivatedAt | datetime \| null | |
| ownerCount | number | Summary |
| userCount | number | Summary |
| branchCount / warehouseCount / vehicleCount | number | Monitoring summaries only |
| subscriptionId | string \| null | Current subscription |
| stats | CompanyStatistics | Nested or separate fetch |

**Validation**: name required; status transitions restricted (see below).

**Relationships**: has many Owners, Notes; has one current Subscription; appears in SearchResults and metrics.

**State transitions**:
`registered` → `active` → `inactive`/`deactivated`; `inactive` → `active`; terminal policies per API.

**Read-first**: Operational business records (trips, expenses, inventory, etc.) are NOT entities in this console—only aggregated counts may appear in statistics.

---

### CompanyOwner

| Field | Type | Notes |
|-------|------|-------|
| id | string | User id in customer app |
| companyId | string | |
| name | string | |
| email | string | |
| status | string | Display only |

**Writes**: None from Admin Console except support unlock/reset via UserSupportAction (not editing owner profile as business data).

---

### CompanyStatistics

| Field | Type | Notes |
|-------|------|-------|
| companyId | string | |
| transactionVolume | number | Informational |
| tripVolume | number | Informational |
| expenseVolume | number | Informational |
| activeUsers | number | |
| lastActivityAt | datetime \| null | |

---

### AdministrativeNote

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| companyId | string | Target (user-targeted notes optional later) |
| body | string | |
| authorAdminId | string | |
| createdAt / updatedAt | datetime | |

**Validation**: body non-empty; max length per API.

---

### Subscription

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| companyId | string | |
| planCode | string | |
| status | `active` \| `suspended` \| `expired` \| `pending` | |
| startsAt / endsAt | datetime | |
| renewedAt | datetime \| null | |
| suspendedAt | datetime \| null | |

**State transitions**: `pending` → `active`; `active` → `suspended` \| `expired`; `suspended` → `active` (renew/reactivate); renew extends `endsAt`.

---

### AuditEvent (Activity Log)

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| action | AuditAction | Enum of admin actions |
| actorAdminId | string | |
| targetType | string | e.g. company, user, subscription, setting |
| targetId | string | |
| metadata | object | Non-sensitive context |
| createdAt | datetime | Immutable |

**Validation**: append-only; frontend NEVER edits/deletes.

**Example actions**: company created/updated/activated/deactivated; subscription created/renewed/suspended/expired; password reset; user locked/unlocked; admin login; note added/updated; setting changed.

---

### PlatformMetric

| Field | Type | Notes |
|-------|------|-------|
| key | string | e.g. `active_companies`, `users_total` |
| value | number | |
| asOf | datetime | |
| series | MetricPoint[] \| null | For charts |

Used by dashboard widgets, analytics, reports.

---

### SearchResult

| Field | Type | Notes |
|-------|------|-------|
| entityType | `company` \| `user` \| `subscription` \| `administrator` \| `note` \| `activity` \| `report` | Extensible |
| entityId | string | |
| title | string | |
| subtitle | string \| null | |
| deepLink | string | In-app route |

---

### AppSetting

| Field | Type | Notes |
|-------|------|-------|
| key | string | |
| value | string \| number \| boolean \| object | |
| updatedAt | datetime | |
| updatedByAdminId | string | |

Mutations require elevated roles + audit.

---

### AuthSession (client)

| Field | Type | Notes |
|-------|------|-------|
| accessToken | string | Not logged |
| refreshToken | string \| managed by cookie | Not displayed |
| admin | Administrator | Profile |
| expiresAt | datetime | |

## Entity relationship summary

```text
Administrator ──authors──► AdministrativeNote ──► Company
Administrator ──performs──► AuditEvent ──targets──► Company | Subscription | User | Setting
Company ──has──► Subscription
Company ──has──► CompanyOwner (read)
Company ──has──► CompanyStatistics (read)
PlatformMetric ──feeds──► Dashboard / Analytics / Reports
SearchResult ──links──► any searchable entity
```
