# Feature Specification: A004 — Platform Management

**Feature Branch**: `004-platform-management`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "A004 Platform Management — central internal administration of companies, owners, administrators, subscriptions, notes, reports, activity, search, settings, exports, and password resets (business requirements and REST resource contracts only)"

## Vision

Provide a centralized platform administration module that allows the Scrappy team to efficiently manage customers, administrators, subscriptions, operational monitoring data, reporting, and platform configuration from a single application.

## Objectives

Authorized administrators MUST be able to:

- Manage companies
- Manage company owners
- Manage platform administrators
- Manage company subscriptions
- Record internal notes
- Reset passwords
- View login history
- View activity history
- Generate reports
- Search platform data
- Configure platform settings
- Export platform data

## Scope Alignment *(mandatory for Admin Console)*

- **Primary actors**: Internal Scrappy administrators with console access (MVP: Super Admin per A002). Never Company Owner, Manager, or Employee as Admin Console actors.
- **In scope**: Company lifecycle administration; company owner administration (including lock/unlock and password reset); platform administrator administration (including roles and security actions); subscription lifecycle administration (aligned with subscription product rules); internal administrative notes; administrative timelines; platform reports (informational); immutable activity logs; global search; platform settings; data export; password reset for owners and administrators.
- **Out of scope (Non-Goals)**: Customer business operations (purchasing, selling, inventory, warehouse workflows, trip/expense operations, attendance, payroll, POS, customer daily workflows); editing customer operational transaction records; support tickets, billing/invoices/payments, messaging, maintenance mode, feature flags, API keys, webhooks, impersonation, and notification center (Future Considerations only).
- **Read vs write**: Platform administration writes are allowed for company/owner/admin/subscription lifecycle, notes, settings, password resets, and exports. Customer operational records remain **read-only** (summaries/statistics only). Prefer observe for operational data.
- **Audit impact**: Every administrative mutation MUST produce an immutable audit/activity record (create/update/activate/deactivate/lock/unlock/password reset/subscription changes/settings changes/exports initiated).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage companies end-to-end (Priority: P1)

A Super Admin creates, finds, views, updates, activates/deactivates companies; reviews statistics and administrative timeline; and adds internal notes.

**Why this priority**: Company lifecycle is the core of platform administration.

**Independent Test**: Create company → search/filter → open details (stats, notes, timeline) → update → deactivate → activate → confirm audit entries.

**Acceptance Scenarios**:

1. **Given** a Super Admin, **When** they create a valid company, **Then** the company is stored with Active or Registered status per policy and an audit event is recorded.
2. **Given** many companies, **When** they search/filter/sort/paginate, **Then** results remain usable and accurate.
3. **Given** a company detail view, **When** opened, **Then** details, monitoring statistics, notes, and administrative timeline are available without enabling customer operational workflows.
4. **Given** activate/deactivate, **When** confirmed, **Then** status changes and the action is audited.

---

### User Story 2 - Manage company owners and password resets (Priority: P1)

A Super Admin manages company owners (create/view/update/activate/deactivate/lock/unlock), resets owner passwords without seeing credentials, and views owner login history and activity summary.

**Why this priority**: Owner access control is essential for customer support and security.

**Independent Test**: Open owner → lock → unlock → reset password → confirm no credential display and audit/login history updates.

**Acceptance Scenarios**:

1. **Given** a company, **When** an owner is created with valid data, **Then** the owner is associated to the company and audited.
2. **Given** an owner, **When** locked or unlocked, **Then** status updates and access rules apply; action is audited.
3. **Given** password reset, **When** initiated, **Then** reset proceeds through secure channel and credentials are never displayed to the administrator.
4. **Given** an owner profile, **When** login history and activity summary are opened, **Then** historical entries are visible and immutable.

---

### User Story 3 - Manage platform administrators (Priority: P1)

A Super Admin manages other platform administrators including profile, role assignment, activate/deactivate, lock/unlock, password reset, and views administrator login/activity history.

**Why this priority**: Controls who can operate the Admin Console.

**Independent Test**: Create admin with Super Admin role → update → lock → reset password → view histories → confirm audits.

**Acceptance Scenarios**:

1. **Given** valid administrator data and an allowed role, **When** created, **Then** the administrator can authenticate only when Active (per A002) and creation is audited.
2. **Given** role assignment, **When** updated, **Then** subsequent authorization reflects the new role after next session validation rules.
3. **Given** deactivate/lock, **When** applied, **Then** the administrator cannot successfully use the console while Inactive/Locked.
4. **Given** administrator login/activity history, **When** viewed, **Then** records are immutable and complete for retained events.

---

### User Story 4 - Manage subscriptions (Priority: P2)

A Super Admin views current subscription and history for a company, and performs create/renew/suspend/expire with notes, following subscription product rules.

**Why this priority**: Commercial lifecycle is central but builds on company context.

**Independent Test**: Open company subscription → renew/suspend/expire → history and notes update; audits recorded.

**Acceptance Scenarios**:

1. **Given** a company, **When** subscription detail is opened, **Then** current subscription and history are visible.
2. **Given** an allowed lifecycle action, **When** confirmed, **Then** status transitions per subscription rules and the action is audited.
3. **Given** subscription notes, **When** added, **Then** notes are internal-only and audited.

---

### User Story 5 - Reports, activity, search, settings, and exports (Priority: P2)

A Super Admin runs informational reports, browses immutable activity logs, uses global search, updates platform settings, and exports selected platform datasets.

**Why this priority**: Completes operational visibility and configuration after core entity management.

**Independent Test**: Run a companies report → search a company → open activity log → change a setting → export activity → confirm audits for mutating/export actions.

**Acceptance Scenarios**:

1. **Given** report types (companies, subscriptions, users, transactions, trips, expenses, growth, usage, administrative activities), **When** generated with valid filters, **Then** informational results are returned without enabling operational workflows.
2. **Given** activity logs, **When** filtered, **Then** administrator logins, company/subscription events, password resets, status changes, and admin actions appear; records cannot be edited/deleted by administrators.
3. **Given** global search, **When** querying with keyword and filters, **Then** results across companies, owners, administrators, subscriptions, notes, and activity logs paginate/sort correctly and deep-link to details.
4. **Given** settings (general, branding, preferences, defaults, security/password/session policies), **When** updated by an authorized admin, **Then** changes persist and are audited.
5. **Given** export of companies/users/subscriptions/reports/activity logs, **When** requested with valid scope, **Then** an export artifact is produced and the initiation is audited.

### Edge Cases

- Duplicate company/owner/admin emails rejected with clear validation.
- Actions on Inactive/Locked targets follow status rules (e.g., cannot activate while conflicting locks without unlock).
- Search with no matches returns empty state, not error.
- Invalid export scope or oversized range rejected with validation guidance.
- Unauthorized caller denied on all Platform Management resources.
- Concurrent updates: last successful write wins; both attempts audited where both succeed/fail distinctly.
- Customer operational detail screens are not available; only summaries/statistics.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authorized administrators to create, view, update, activate, and deactivate companies, including details, statistics, notes, administrative timeline, search, and filters.
- **FR-002**: System MUST allow authorized administrators to create, view, update, activate, deactivate, lock, and unlock company owners, and to view owner login history and activity summary.
- **FR-003**: System MUST allow authorized administrators to reset passwords for company owners and platform administrators without ever displaying credentials.
- **FR-004**: System MUST allow authorized administrators to create, view, update, activate, deactivate, lock, unlock platform administrators, assign roles, and view administrator profile plus login/activity history.
- **FR-005**: System MUST allow authorized administrators to view current subscription and history, create/renew/suspend/expire subscriptions, and record subscription notes, following subscription product rules.
- **FR-006**: System MUST provide informational reports for companies, subscriptions, users, transactions, trips, expenses, platform growth, platform usage, and administrative activities.
- **FR-007**: System MUST provide immutable platform-wide activity logs covering administrator logins, company events, subscription events, password resets, account status changes, and administrative actions.
- **FR-008**: System MUST provide global search across companies, owners, administrators, subscriptions, notes, and activity logs with keyword search, filtering, sorting, and pagination.
- **FR-009**: System MUST allow authorized administrators to view and update platform settings including general, branding, system preferences, defaults, security policies, password policies, session policies, and extension points for future settings.
- **FR-010**: System MUST allow authorized administrators to export companies, users, subscriptions, reports, and activity logs within validated scopes.
- **FR-011**: System MUST keep customer operational records read-only and MUST NOT enable customer operational workflows from Platform Management.
- **FR-012**: System MUST audit every administrative mutation and export initiation with immutable records.
- **FR-013**: System MUST treat internal notes as private to Scrappy administrators (not visible to customer application users).
- **FR-014**: System MUST expose REST resources for companies, owners, administrators, subscriptions, reports, activity logs, global search, settings, exports, and password reset as defined in API Contracts.
- **FR-015**: Only authenticated administrators authorized for the console MAY access Platform Management resources.

### Key Entities

- **Company**: Customer organization under platform administration (identity, status, details, statistics summary).
- **CompanyOwner**: Primary customer-side owner identity linked to a company (status, lock state, login history).
- **PlatformAdministrator**: Internal Scrappy operator (profile, role, status, lock state, histories).
- **Subscription**: Commercial entitlement for a company (current state, history, notes).
- **AdministrativeNote**: Internal private note on company/subscription/owner/admin contexts.
- **AdministrativeTimelineEvent**: Chronological admin-relevant events for a company (or entity).
- **ReportDefinition / ReportResult**: Informational report type and generated result set.
- **ActivityLogEntry**: Immutable platform-wide administrative/activity record.
- **SearchResult**: Normalized hit across searchable entity types with deep-link target.
- **PlatformSetting**: Configurable platform key/value (grouped by category).
- **ExportJob**: Requested export of a dataset with scope and completion artifact reference.
- **PasswordResetAction**: Administrative initiation of credential reset for owner or administrator.

## API Contracts

Product interface contracts only—not deployment or persistence design. Authenticated administrator session required unless noted.

### Companies

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-CO-01 | List/search companies | `GET` | `/admin/companies` | Auth; `q`, filters, sort, page | Paginated companies | 400, 401, 403 |
| PM-CO-02 | Create company | `POST` | `/admin/companies` | Auth; company payload | Created company | 400, 401, 403, 409 |
| PM-CO-03 | Get company | `GET` | `/admin/companies/{id}` | Auth | Company details | 401, 403, 404 |
| PM-CO-04 | Update company | `PATCH` | `/admin/companies/{id}` | Auth; patch payload | Updated company | 400, 401, 403, 404, 409 |
| PM-CO-05 | Activate company | `POST` | `/admin/companies/{id}/activate` | Auth | Updated company | 400, 401, 403, 404 |
| PM-CO-06 | Deactivate company | `POST` | `/admin/companies/{id}/deactivate` | Auth | Updated company | 400, 401, 403, 404 |
| PM-CO-07 | Company statistics | `GET` | `/admin/companies/{id}/statistics` | Auth | Monitoring statistics | 401, 403, 404 |
| PM-CO-08 | Company timeline | `GET` | `/admin/companies/{id}/timeline` | Auth; pagination | Timeline events | 401, 403, 404 |
| PM-CO-09 | List company notes | `GET` | `/admin/companies/{id}/notes` | Auth | Notes list | 401, 403, 404 |
| PM-CO-10 | Add company note | `POST` | `/admin/companies/{id}/notes` | Auth; body | Created note | 400, 401, 403, 404 |

### Company Owners

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-OW-01 | List owners | `GET` | `/admin/companies/{companyId}/owners` | Auth; pagination/filters | Paginated owners | 400, 401, 403, 404 |
| PM-OW-02 | Create owner | `POST` | `/admin/companies/{companyId}/owners` | Auth; owner payload | Created owner | 400, 401, 403, 404, 409 |
| PM-OW-03 | Get owner | `GET` | `/admin/owners/{id}` | Auth | Owner profile | 401, 403, 404 |
| PM-OW-04 | Update owner | `PATCH` | `/admin/owners/{id}` | Auth; patch | Updated owner | 400, 401, 403, 404, 409 |
| PM-OW-05 | Activate owner | `POST` | `/admin/owners/{id}/activate` | Auth | Updated owner | 400, 401, 403, 404 |
| PM-OW-06 | Deactivate owner | `POST` | `/admin/owners/{id}/deactivate` | Auth | Updated owner | 400, 401, 403, 404 |
| PM-OW-07 | Lock owner | `POST` | `/admin/owners/{id}/lock` | Auth | Updated owner | 400, 401, 403, 404 |
| PM-OW-08 | Unlock owner | `POST` | `/admin/owners/{id}/unlock` | Auth | Updated owner | 400, 401, 403, 404 |
| PM-OW-09 | Owner login history | `GET` | `/admin/owners/{id}/login-history` | Auth; pagination | Paginated history | 401, 403, 404 |
| PM-OW-10 | Owner activity summary | `GET` | `/admin/owners/{id}/activity-summary` | Auth | Summary payload | 401, 403, 404 |

### Platform Administrators

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-AD-01 | List administrators | `GET` | `/admin/administrators` | Auth; filters/page | Paginated admins | 400, 401, 403 |
| PM-AD-02 | Create administrator | `POST` | `/admin/administrators` | Auth; profile + role | Created admin | 400, 401, 403, 409 |
| PM-AD-03 | Get administrator | `GET` | `/admin/administrators/{id}` | Auth | Profile | 401, 403, 404 |
| PM-AD-04 | Update administrator | `PATCH` | `/admin/administrators/{id}` | Auth; patch incl. roles | Updated admin | 400, 401, 403, 404, 409 |
| PM-AD-05 | Activate | `POST` | `/admin/administrators/{id}/activate` | Auth | Updated admin | 400, 401, 403, 404 |
| PM-AD-06 | Deactivate | `POST` | `/admin/administrators/{id}/deactivate` | Auth | Updated admin | 400, 401, 403, 404 |
| PM-AD-07 | Lock | `POST` | `/admin/administrators/{id}/lock` | Auth | Updated admin | 400, 401, 403, 404 |
| PM-AD-08 | Unlock | `POST` | `/admin/administrators/{id}/unlock` | Auth | Updated admin | 400, 401, 403, 404 |
| PM-AD-09 | Login history | `GET` | `/admin/administrators/{id}/login-history` | Auth; page | Paginated history | 401, 403, 404 |
| PM-AD-10 | Activity history | `GET` | `/admin/administrators/{id}/activity` | Auth; page | Paginated activity | 401, 403, 404 |

### Subscriptions

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-SU-01 | List subscriptions | `GET` | `/admin/subscriptions` | Auth; filters/page | Paginated subscriptions | 400, 401, 403 |
| PM-SU-02 | Get subscription | `GET` | `/admin/subscriptions/{id}` | Auth | Subscription + history summary | 401, 403, 404 |
| PM-SU-03 | Create subscription | `POST` | `/admin/subscriptions` | Auth; company + plan payload | Created subscription | 400, 401, 403, 404, 409 |
| PM-SU-04 | Renew | `POST` | `/admin/subscriptions/{id}/renew` | Auth; renew payload | Updated subscription | 400, 401, 403, 404 |
| PM-SU-05 | Suspend | `POST` | `/admin/subscriptions/{id}/suspend` | Auth | Updated subscription | 400, 401, 403, 404 |
| PM-SU-06 | Expire | `POST` | `/admin/subscriptions/{id}/expire` | Auth | Updated subscription | 400, 401, 403, 404 |
| PM-SU-07 | Subscription notes list | `GET` | `/admin/subscriptions/{id}/notes` | Auth | Notes | 401, 403, 404 |
| PM-SU-08 | Add subscription note | `POST` | `/admin/subscriptions/{id}/notes` | Auth; body | Created note | 400, 401, 403, 404 |
| PM-SU-09 | Company subscription history | `GET` | `/admin/companies/{companyId}/subscriptions` | Auth | History list | 401, 403, 404 |

### Password Reset

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-PW-01 | Reset owner password | `POST` | `/admin/owners/{id}/password-reset` | Auth | Acknowledgment (no secrets) | 400, 401, 403, 404 |
| PM-PW-02 | Reset administrator password | `POST` | `/admin/administrators/{id}/password-reset` | Auth | Acknowledgment (no secrets) | 400, 401, 403, 404 |

### Reports

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-RP-01 | List report types | `GET` | `/admin/reports` | Auth | Report catalog | 401, 403 |
| PM-RP-02 | Run report | `POST` | `/admin/reports/{reportKey}/run` | Auth; filters | Report result (informational) | 400, 401, 403, 404 |

### Activity Logs

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-AC-01 | List activity logs | `GET` | `/admin/activity` | Auth; filters/page | Paginated immutable entries | 400, 401, 403 |

### Global Search

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-SE-01 | Global search | `GET` | `/admin/search` | Auth; `q`, types, sort, page | Paginated SearchResult hits | 400, 401, 403 |

### Settings

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-ST-01 | List settings | `GET` | `/admin/settings` | Auth; optional category | Settings groups | 401, 403 |
| PM-ST-02 | Update setting | `PATCH` | `/admin/settings/{key}` | Auth; value | Updated setting | 400, 401, 403, 404 |

### Exports

| ID | Purpose | Method | URI | Required Request | Successful Response | Possible Errors |
|----|---------|--------|-----|------------------|---------------------|-----------------|
| PM-EX-01 | Request export | `POST` | `/admin/exports` | Auth; dataset + scope | Export job accepted | 400, 401, 403, 429 |
| PM-EX-02 | Get export status/result | `GET` | `/admin/exports/{id}` | Auth | Status + download reference when ready | 401, 403, 404 |

## Validation Rules

| Area | Rules |
|------|--------|
| **Company** | Required identity fields (name, etc.); status transitions only via allowed activate/deactivate paths; unique business keys as defined by platform policy |
| **Owner** | Valid email; must belong to a company; lock/unlock/activate/deactivate only in allowed state pairs |
| **Administrator** | Valid email; at least one role; cannot remove last Super Admin if policy requires one active Super Admin |
| **Subscription** | Must reference existing company; lifecycle actions only from allowed current states per subscription rules |
| **Search** | `q` minimum length when provided; page size within caps; type filters from allow-list |
| **Settings** | Values must match setting type/constraints; security/password/session policy values within safe bounds |
| **Password reset** | Target must exist and be eligible; no password values in responses |
| **Export** | Dataset from allow-list; date/scope required where applicable; maximum range enforced |

## Business Rules

1. Only authenticated administrators may access Platform Management.
2. Company operational records are read-only.
3. Administrators cannot execute customer operational workflows.
4. Every administrative action must be audited.
5. Internal notes are private to Scrappy administrators.
6. Activity history is immutable.
7. Subscription management follows the Subscription product specification / subscription rules.
8. Password reset responses MUST NEVER include credentials.
9. Exports and settings changes are audited.

## Acceptance Criteria

- **AC-001**: Authorized Super Admin can complete company create → search → detail → note → deactivate/activate with audits for each mutation.
- **AC-002**: Owner lock/unlock and password reset succeed without displaying credentials; actions audited.
- **AC-003**: Administrator create/update/role/lock/deactivate behaviors enforce Active-only console access interactions consistent with authentication rules.
- **AC-004**: Subscription create/renew/suspend/expire follow allowed transitions; invalid transitions rejected; audited.
- **AC-005**: Reports return informational datasets for each supported report type with valid filters.
- **AC-006**: Activity log entries cannot be modified or deleted via Platform Management APIs.
- **AC-007**: Global search returns paginated multi-type results for matching keywords within 3 seconds under normal conditions for typical datasets.
- **AC-008**: Settings updates persist and appear on subsequent read; audited.
- **AC-009**: Export requests for allowed datasets produce a completable export job; initiation audited.
- **AC-010**: 100% of unauthenticated Platform Management requests are denied.
- **AC-011**: No Platform Management path enables prohibited customer operational workflows.
- **AC-012**: All PM-* contracts behave per Purpose/Method/URI/request/success/errors.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can locate a known company via search/filters and open details in under 1 minute in moderated trials.
- **SC-002**: 100% of tested administrative mutations create a corresponding immutable activity/audit entry.
- **SC-003**: 100% of password-reset responses inspected contain no credentials.
- **SC-004**: Support-style owner unlock + password reset completes in under 2 minutes in moderated trials.
- **SC-005**: At least 90% of Super Admins successfully run one report and one export without coaching in moderated acceptance.
- **SC-006**: Verification finds 0 customer operational workflow entry points from Platform Management.

## Future Considerations

Future versions MAY introduce without redesigning Platform Management:

- Support tickets
- Billing / invoices / payment gateway
- Customer messaging
- Maintenance mode
- Feature flags
- API keys
- Webhook management
- Platform monitoring
- Customer impersonation
- Audit reports
- Notification center

## Assumptions

- A001–A003 are available (console shell, authentication/authorization, dashboard).
- MVP console authorization is Super Admin; additional roles may be assigned in data model anticipating future access matrices.
- Subscription state machine details are governed by the platform’s Subscription Management rules; this spec requires those transitions to be enforced and audited.
- “Last Super Admin” protection is enabled by default (cannot deactivate/lock the sole remaining Active Super Admin).
- Export formats and delivery channel (download link vs async notification) are defined by platform policy; clients consume job status via PM-EX-02.
- Report “transactions/trips/expenses” are informational aggregates/lists for monitoring—not operational execution screens.
- Unlock of Locked administrators/owners is in scope for A004 (unlike A002’s deferred unlock for self-service lockouts).

## Constraints

- Business requirements and REST resource contracts only.
- No implementation details, frameworks, middleware, project structure, database design, testing strategy, or code examples.
- This specification defines Platform Management only.
