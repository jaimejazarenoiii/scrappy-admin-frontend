# Feature Specification: A001 — Scrappy Admin Console Foundation

**Feature Branch**: `001-admin-console-foundation`

**Created**: 2026-07-13

**Status**: Approved

**Input**: User description: "A001 Scrappy Admin Console Foundation — internal admin platform for Scrappy SaaS operation, monitoring, and support"

## Scope Alignment *(mandatory for Admin Console)*

- **Primary actors**: Internal Scrappy roles only (Super Admin, Admin, Support, Finance, Sales, Read Only Analyst). Never Company Owner, Manager, or Employee.
- **In scope**: Project foundation, authentication, dashboard, company management (details, statistics, notes, owners), administrator management, subscription management, analytics, reports, activity logs, global search, password reset (support), settings.
- **Out of scope (Non-Goals)**: Inventory, business transactions, trip/expense operations, employee attendance, payroll, warehouse operations, customer daily workflows, point-of-sale.
- **Read vs write**: Prefer observe. Allowed writes are platform-support actions (lifecycle, subscriptions, password reset/unlock, admin notes, administrator CRUD, settings) with audit.
- **Audit impact**: All administrative mutations MUST produce immutable audit records (login, lifecycle, subscription changes, password reset, lock/unlock, notes, settings).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticate and land on platform health (Priority: P1)

An internal administrator signs in with JWT credentials, lands on a dashboard that communicates platform health, and can navigate protected areas according to their role.

**Why this priority**: Without auth and an actionable landing surface, no other admin capability is usable.

**Independent Test**: Sign in as an internal admin → dashboard shows summary health widgets → unauthorized roles cannot access restricted routes → sign-out clears session.

**Acceptance Scenarios**:

1. **Given** valid internal credentials, **When** the admin signs in, **Then** they receive access tokens and reach the dashboard.
2. **Given** an expired access token and valid refresh token, **When** an API call is made, **Then** the session refreshes without forcing re-login.
3. **Given** a role without access to a module, **When** they navigate to that route, **Then** they see an unauthorized experience.
4. **Given** an authenticated session, **When** they open the app, **Then** the dashboard answers active customers, expiring subscriptions, recent registrations, and attention items.

---

### User Story 2 - Manage companies end-to-end (Priority: P1)

An administrator finds companies via list/search/filter, opens details (statistics, notes, owners), and performs lifecycle actions (activate/deactivate) with notes and audit trail.

**Why this priority**: Customer lifecycle is a core Admin Console responsibility.

**Independent Test**: Search a company → open details → add a note → change status → confirm activity history and audit entry.

**Acceptance Scenarios**:

1. **Given** many companies, **When** the admin searches/filters/sorts, **Then** results paginate and remain usable at scale.
2. **Given** a company detail view, **When** the admin reviews statistics, notes, and owners, **Then** data is read-oriented except for allowed support writes.
3. **Given** activation/deactivation, **When** confirmed, **Then** status updates and an immutable audit event is recorded.

---

### User Story 3 - Manage subscriptions (Priority: P2)

An administrator views and updates subscription lifecycle (create/renew/suspend/expire) and sees status on lists and dashboard widgets.

**Why this priority**: Subscription operations are central to platform administration and revenue operations.

**Independent Test**: Open subscriptions → filter by expiring soon → suspend a subscription → verify status and audit.

**Acceptance Scenarios**:

1. **Given** subscriptions across companies, **When** filtered by status/expiry, **Then** the admin can act on attention items.
2. **Given** a renew/suspend/expire action, **When** confirmed, **Then** state transitions and audit events are recorded.

---

### User Story 4 - Support, search, and administration (Priority: P2)

An administrator uses global search, password reset/unlock, activity logs, administrator management, analytics, reports, and settings without leaving the console’s consistent patterns.

**Why this priority**: Completes operational support and platform visibility after core lifecycle modules.

**Independent Test**: Global search finds a user → unlock/reset password → view activity log → open analytics/report summary → update a setting (authorized role).

**Acceptance Scenarios**:

1. **Given** global search, **When** querying companies/users/subscriptions/admins/notes/logs, **Then** results deep-link to detail views.
2. **Given** a locked user, **When** Support resets password or unlocks, **Then** credentials are never displayed and the action is audited.
3. **Given** analytics and reports, **When** opened, **Then** they show cross-company informational aggregates only (no customer business workflows).

### Edge Cases

- Invalid/expired refresh token forces re-authentication.
- Empty search/list results show actionable empty states.
- API failures show toast + retry without losing navigation context.
- Concurrent admin edits: last successful write wins; both actions audited.
- Read Only Analyst cannot perform mutating support actions.
- Customer credentials are never returned or rendered.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate internal administrators via JWT with refresh-token support.
- **FR-002**: System MUST protect routes with authentication and role-based authorization guards.
- **FR-003**: System MUST provide a dashboard with reusable widgets for summary cards, charts, recent activity, recent companies, subscription status, growth metrics, and platform statistics.
- **FR-004**: System MUST support company list/search/filter/sort/pagination and company detail including statistics, notes, and owners.
- **FR-005**: System MUST support company activation/deactivation and administrative notes with audit.
- **FR-006**: System MUST support subscription lifecycle management and visibility.
- **FR-007**: System MUST support administrator management for internal roles.
- **FR-008**: System MUST provide platform analytics and reports that aggregate across companies (informational only).
- **FR-009**: System MUST provide activity logs and global search across core entities.
- **FR-010**: System MUST support password reset and account unlock for customer users without exposing credentials.
- **FR-011**: System MUST provide settings for platform configuration changes with audit.
- **FR-012**: System MUST standardize reusable data tables (pagination, sorting, filtering, searching, column visibility, row actions, loading/empty states; bulk actions future).
- **FR-013**: System MUST standardize reusable forms (validation, errors, loading, success, confirmation dialogs).
- **FR-014**: System MUST standardize reusable charts for growth, subscription distribution, activity timeline, platform usage, and company rankings.
- **FR-015**: System MUST use TanStack Query for server state and Zustand only for client UI/session concerns (auth session shell, theme, sidebar, global filters).
- **FR-016**: System MUST use a typed Axios API layer with auth, token refresh, interceptors, error handling, retry, and typed responses against the existing Scrappy REST API.
- **FR-017**: System MUST record immutable audit events for every administrative mutation.
- **FR-018**: System MUST NOT implement customer-application business workflows (see Non-Goals).

### Key Entities *(include if feature involves data)*

- **Administrator**: Internal user identity, role(s), session, status.
- **Company**: Tenant organization, lifecycle status, owners, notes, statistics summary.
- **Subscription**: Plan linkage, status, renewal/expiry dates, company association.
- **AdministrativeNote**: Free-text support note attached to a company/user with author and timestamps.
- **ActivityLog / AuditEvent**: Immutable record of administrative actions.
- **PlatformMetric**: Aggregated cross-company analytics datapoint for dashboards/reports.
- **SearchResult**: Normalized hit across searchable entity types with deep-link target.
- **AppSetting**: Platform configuration key/value managed by authorized admins.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated admins reach a health dashboard in under 3 seconds on typical internal networks after login.
- **SC-002**: Company and user search returns first-page results in under 2 seconds for datasets representing thousands of companies.
- **SC-003**: 100% of mutating admin actions produce a visible activity/audit entry.
- **SC-004**: Role guards block unauthorized module access in 100% of tested role permutations for MVP roles.
- **SC-005**: Core management modules share the same list → filter → detail → action patterns (consistency checklist passes).
- **SC-006**: No customer credentials appear in UI, network responses rendered by the console, or logs emitted by the frontend.

## Assumptions

- Existing Scrappy REST API exposes (or will expose) admin endpoints for auth, companies, subscriptions, admins, analytics, reports, activity, search, support actions, and settings.
- Backend owns business rules; the console is an API consumer only.
- Initial MVP roles may be a subset (e.g., Super Admin, Admin, Support, Read Only Analyst) with remaining roles added without redesign.
- Desktop-first responsive layouts with tablet support; mobile is secondary.
- Dark mode is architecture-ready (theme tokens) even if default light ships first.
- Product specification and constitution v1.0.0 are approved governance inputs for this plan.
