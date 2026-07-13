# Data Model: A004 — Platform Management

**Date**: 2026-07-13  
**Note**: Conceptual client-facing models. Authoritative persistence lives on Scrappy API.

## Core entities

### Company

| Field | Type | Notes |
|-------|------|-------|
| id | string | Stable id |
| name | string | Required |
| status | `registered` \| `active` \| `inactive` \| … | Platform policy enums |
| createdAt / updatedAt | datetime | |
| metadata | object | Optional identity fields (contact, locale, etc.) |

**Relationships**: has many Owners, Subscriptions, Notes, TimelineEvents; statistics are derived read model.

**Transitions**: activate ↔ deactivate via dedicated actions (not free-form status patch).

---

### CompanyOwner

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| companyId | string | Required |
| name | string | |
| email | string | Unique per policy |
| status | `active` \| `inactive` | |
| locked | boolean | |
| lastLoginAt | datetime \| null | |

**Transitions**: activate/deactivate; lock/unlock; password reset (side-effect, no password field on model).

---

### PlatformAdministrator

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| name | string | |
| email | string | Unique |
| roles | string[] | At least one; includes `super_admin` |
| status | `active` \| `inactive` | |
| locked | boolean | |
| lastLoginAt | datetime \| null | |

**Rules**: Cannot deactivate/lock last Active Super Admin (API + UI).

---

### Subscription

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| companyId | string | |
| planKey / planName | string | |
| status | `active` \| `suspended` \| `expired` \| `grace` \| … | Per subscription rules |
| currentPeriodStart / End | datetime | |
| history | SubscriptionHistoryItem[] | On detail |

**Transitions**: create; renew; suspend; expire — only from allowed current states.

---

### AdministrativeNote

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| targetType | `company` \| `subscription` \| `owner` \| `administrator` | |
| targetId | string | |
| body | string | Private to Scrappy admins |
| createdAt | datetime | |
| createdBy | actor ref | |

---

### AdministrativeTimelineEvent

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| companyId | string | |
| type | string | Admin-relevant event |
| summary | string | |
| at | datetime | |
| actorLabel | string \| null | |

Immutable from client perspective.

---

### CompanyStatistics

Read-only monitoring aggregates for a company (users, volume summaries, branches/warehouses/vehicles counts as provided). **Not** editable operational records.

---

### ReportDefinition / ReportResult

- **ReportDefinition**: `key`, `name`, `description`, `filterSchema`
- **ReportResult**: `columns`, `rows`, `generatedAt`, optional summary metrics

Informational only. Keys include companies, subscriptions, users, transactions, trips, expenses, growth, usage, administrative activities.

---

### ActivityLogEntry

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| at | datetime | |
| actorType / actorId / actorLabel | | |
| actionType | enum-like | login, company_event, subscription_event, password_reset, status_change, admin_action, … |
| targetType / targetId | | |
| summary | string | |

**Immutable**; no client update/delete.

---

### SearchResult

| Field | Type | Notes |
|-------|------|-------|
| type | `company` \| `owner` \| `administrator` \| `subscription` \| `note` \| `activity` | |
| id | string | |
| title | string | |
| subtitle | string \| null | |
| href | route key / path | Deep-link |
| updatedAt | datetime \| null | |

---

### PlatformSetting

| Field | Type | Notes |
|-------|------|-------|
| key | string | |
| category | `general` \| `branding` \| `preferences` \| `defaults` \| `security` \| `password` \| `session` \| `future` | |
| value | typed JSON | |
| constraints | schema fragment | For validation |

---

### ExportJob

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| dataset | `companies` \| `users` \| `subscriptions` \| `reports` \| `activity` | |
| scope | object | Filters/date range |
| status | `pending` \| `running` \| `ready` \| `failed` | |
| downloadRef | string \| null | When ready |
| createdAt / completedAt | datetime | |

---

### PasswordResetAction

Client does not persist; API returns acknowledgment `{ accepted: true, message? }` with **no secrets**.

---

### LoginHistoryItem

| Field | Type | Notes |
|-------|------|-------|
| at | datetime | |
| success | boolean | |
| ip / userAgent | string \| null | If provided |
| subjectType | `owner` \| `administrator` | |

---

## List / filter value objects

### ListQuery

`q`, `status[]`, `sort`, `page`, `pageSize`, plus resource-specific filters (e.g., `companyId`, `locked`, `role`, `subscriptionStatus`, `actionType`, `from`, `to`).

### Page[T]

`items: T[]`, `page`, `pageSize`, `total`, optional `nextPage`.

---

## Relationships

```text
Company ──< CompanyOwner
Company ──< Subscription ──< AdministrativeNote
Company ──< AdministrativeNote
Company ──< AdministrativeTimelineEvent
Company ──  CompanyStatistics (1:1 read model)
PlatformAdministrator ──< LoginHistoryItem / Activity (admin-scoped)
CompanyOwner ──< LoginHistoryItem / ActivitySummary
ActivityLogEntry (platform-wide)
SearchResult → deep-links to entities
PlatformSetting (flat keyed config)
ExportJob → dataset snapshots
ReportDefinition → ReportResult
```

## Validation summary

See spec Validation Rules. Client Zod mirrors: required identity fields; email formats; role ≥1; search min length; export scope caps; settings type bounds; subscription transition prerequisites (UX); password reset eligibility (target exists, not already pending if API says so).
