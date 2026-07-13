# Feature Specification: A003 — Platform Dashboard & Analytics

**Feature Branch**: `003-platform-dashboard-analytics`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "A003 Platform Dashboard & Analytics — read-only landing overview of Scrappy platform health, growth, subscriptions, activity, and attention items for internal administrators (business requirements and REST resource contracts only)"

## Vision

Provide a centralized dashboard that gives administrators immediate visibility into platform health, customer growth, subscriptions, operational trends, and recent activity.

## Objectives

Authorized administrators MUST be able to:

- Monitor overall platform health
- Track customer growth
- Monitor subscription status
- View platform usage
- View operational statistics
- Identify customers requiring attention
- Quickly navigate to important platform resources via Quick Actions

## Scope Alignment *(mandatory for Admin Console)*

- **Primary actors**: Internal Scrappy administrators with console access (MVP: Super Admin per A002). Never Company Owner, Manager, or Employee.
- **In scope**: Dashboard as Admin Console landing experience; platform overview metrics; user statistics; operational statistics (aggregated monitoring counts only); subscription overview; growth trends; company rankings; recent activity feed; companies requiring attention; quick-action navigation shortcuts; dashboard filtering; REST resource contracts for dashboard/analytics reads.
- **Out of scope (Non-Goals)**: Creating, editing, or executing customer business operations (purchasing, selling, inventory, warehouse workflows, trip operations, expense operations, attendance, payroll, POS, customer daily workflows); mutating company/subscription/user records from the dashboard itself; custom widget builders, personalization, real-time push, notifications, revenue/MRR/ARR/churn, health scores, and predictive insights (Future Considerations only).
- **Read vs write**: This module is **read-only**. Quick Actions only navigate to other management modules; they do not perform writes on the dashboard.
- **Audit impact**: Viewing the dashboard does not require a new audit event. Navigation via Quick Actions may result in audited actions only after the administrator acts in the destination module. Underlying platform events shown in Recent Activity are already audited elsewhere.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View platform overview on landing (Priority: P1)

An authenticated Super Admin opens the Admin Console and lands on the dashboard showing platform overview metrics (companies by status and new-company counts) sufficient to answer “how healthy is the platform right now?”

**Why this priority**: Constitution Dashboard First — the landing page must communicate platform health immediately.

**Independent Test**: Sign in → land on dashboard → verify overview metrics for total/active/trial/grace/expired/suspended companies and new companies today/this month are visible without navigating elsewhere.

**Acceptance Scenarios**:

1. **Given** an authenticated Super Admin, **When** they open the Admin Console home, **Then** they see the Platform Overview section with company summary metrics.
2. **Given** the dashboard is loading overview data, **When** the administrator waits, **Then** they receive clear loading feedback and then populated metrics or an empty/error state with retry.
3. **Given** overview data is unavailable, **When** the section fails, **Then** other dashboard sections may still load independently where possible.

---

### User Story 2 - Monitor growth and operational statistics (Priority: P1)

The administrator reviews growth trends and operational/user statistics that aggregate across all companies for monitoring (not for running customer operations).

**Why this priority**: Cross-company visibility is a core Admin Console responsibility.

**Independent Test**: Open dashboard → confirm user statistics, operational statistics, and at least one growth trend series are displayed as informational aggregates.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** the administrator views User Statistics, **Then** totals for users by type/status and new users this month are shown.
2. **Given** the dashboard, **When** the administrator views Operational Statistics, **Then** aggregated transaction, trip, expense, branch, warehouse, and vehicle monitoring counts are shown.
3. **Given** the dashboard, **When** the administrator views Platform Growth, **Then** trends for company, user, transaction, trip, expense, and subscription growth are available for the selected filter context.
4. **Given** any operational metric, **When** displayed, **Then** it is informational only and does not open customer operational workflows.

---

### User Story 3 - Monitor subscriptions and rankings (Priority: P2)

The administrator reviews subscription distribution, expiring/expired/renewed signals, and company rankings to understand commercial and activity concentration.

**Why this priority**: Subscription attention and rankings drive follow-up in management modules.

**Independent Test**: Open dashboard → Subscription Overview and Company Rankings sections show distribution, attention lists, and ranking lists.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** Subscription Overview is viewed, **Then** distribution, companies expiring soon, recently expired, recently renewed, average duration, and status breakdown are available.
2. **Given** the dashboard, **When** Company Rankings are viewed, **Then** rankings such as most/least active, newest, most users, and highest transaction volume are available.
3. **Given** a ranking or subscription attention item, **When** the administrator selects it (if selectable), **Then** they are taken to the related company or subscription management context—not a customer business workflow.

---

### User Story 4 - Recent activity and companies requiring attention (Priority: P1)

The administrator scans recent platform administrative events and a highlighted list of companies needing attention.

**Why this priority**: Answers “what requires administrator attention?” on the landing page.

**Independent Test**: Dashboard shows Recent Activity entries and a Companies Requiring Attention list with at least the defined attention categories when such companies exist (or empty states when none).

**Acceptance Scenarios**:

1. **Given** recent platform events exist, **When** Recent Activity is viewed, **Then** events such as company/subscription lifecycle and administrator security actions appear in reverse chronological order.
2. **Given** companies match attention rules (expired/suspended subscription, grace ending soon, no recent activity, locked owner accounts), **When** Companies Requiring Attention is viewed, **Then** those companies are listed with the reason for attention.
3. **Given** no companies require attention, **When** the section is viewed, **Then** an empty state communicates that clearly.

---

### User Story 5 - Quick actions and dashboard filters (Priority: P2)

The administrator uses Quick Actions to jump to management modules and applies filters (date range, subscription status, company status, company) to refine dashboard information.

**Why this priority**: Speeds navigation and focuses analysis without leaving the informational model.

**Independent Test**: Click each Quick Action → lands on the correct module entry point; change filters → affected dashboard sections refresh to the filtered context.

**Acceptance Scenarios**:

1. **Given** Quick Actions, **When** the administrator chooses Create Company, View Companies, Manage Subscriptions, Manage Administrators, View Reports, or View Activity Logs, **Then** they are redirected to the corresponding management module entry point.
2. **Given** valid filters (date range, subscription status, company status, company), **When** applied, **Then** dashboard sections that support filtering update to reflect the filter set.
3. **Given** an invalid date range (end before start), **When** applied, **Then** the filter is rejected with clear validation guidance and prior valid results remain until corrected.

### Edge Cases

- Partial section failure: one analytics resource fails while others succeed; failed section shows error/retry without blanking the entire dashboard.
- Empty platform (new environment): overview shows zeros/empty states, not errors.
- Very large platforms: dashboard remains usable; lists (activity, attention, rankings) are limited to a sensible first page/top-N with navigation to full modules as needed.
- Filter yields no data: empty states, not errors.
- Unauthorized caller: dashboard resources deny access.
- Stale display: metrics reflect current platform data at retrieval time; historical series are informational snapshots for the requested range.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present the Platform Dashboard as the default landing experience after successful administrator authentication.
- **FR-002**: System MUST display Platform Overview metrics: total, active, trial, grace period, expired, and suspended companies; new companies today; new companies this month.
- **FR-003**: System MUST display User Statistics: total users, owners, managers, employees, active, inactive, locked, and new users this month.
- **FR-004**: System MUST display Operational Statistics as cross-company monitoring aggregates for transactions (total/today/week/month, inbound/outbound), trips (total/completed/active/cancelled), expenses, branches, warehouses, and vehicles.
- **FR-005**: System MUST display Subscription Overview: distribution, companies expiring soon, recently expired, recently renewed, average subscription duration, and status breakdown.
- **FR-006**: System MUST display Platform Growth trends for companies, users, transactions, trips, expenses, and subscriptions.
- **FR-007**: System MUST display Company Rankings: most active, least active, newest, most users, highest transaction volume.
- **FR-008**: System MUST display Recent Activity including company lifecycle, subscription lifecycle, administrator login, password reset, and other administrator actions.
- **FR-009**: System MUST highlight Companies Requiring Attention for expired subscription, suspended subscription, grace period ending soon, no recent activity, and locked owner accounts.
- **FR-010**: System MUST provide Quick Actions that only navigate to Create Company, View Companies, Manage Subscriptions, Manage Administrators, View Reports, and View Activity Logs modules.
- **FR-011**: System MUST support filtering dashboard information by date range, subscription status, company status, and company.
- **FR-012**: System MUST treat all dashboard statistics as read-only aggregates across companies; the dashboard MUST NOT perform customer business operations.
- **FR-013**: System MUST expose REST resources for dashboard summary, platform statistics, growth analytics, subscription analytics, company rankings, recent activities, companies requiring attention, and quick actions catalog as defined in API Contracts.
- **FR-014**: System MUST validate dashboard filters (including date range ordering and allowed status values) before applying them.
- **FR-015**: Dashboard sections SHOULD load such that a failure in one informational section does not prevent display of successfully loaded sections.

### Key Entities

- **DashboardFilterSet**: Optional date range, subscription status, company status, and company identity used to scope dashboard reads.
- **PlatformOverviewMetrics**: Company counts by lifecycle/commercial status and new-company tallies.
- **UserStatistics**: Counts of platform users by role/type and status.
- **OperationalStatistics**: Aggregated monitoring volumes for transactions, trips, expenses, branches, warehouses, vehicles.
- **SubscriptionOverview**: Distribution, attention lists, renewals/expirations, average duration, status breakdown.
- **GrowthSeries**: Time-bucketed trend points for each growth metric family.
- **CompanyRankingSet**: Ordered company lists for each ranking type.
- **RecentActivityItem**: Summarized platform/admin event for the activity feed.
- **AttentionCompany**: Company identity plus attention reason(s).
- **QuickAction**: Named navigation target to a management module entry point.

## API Contracts

Product interface contracts for dashboard and analytics reads. Purpose and exchange shapes only—not deployment or persistence design.

### DASH-01 Dashboard Summary

| Field | Definition |
|-------|------------|
| **Purpose** | Return platform overview metrics for the landing summary |
| **HTTP Method** | `GET` |
| **URI** | `/admin/dashboard/summary` |
| **Required Request** | Authenticated administrator session; optional filters (`from`, `to`, `subscriptionStatus`, `companyStatus`, `companyId`) |
| **Successful Response** | Platform overview metrics (company totals by status; new companies today/month) |
| **Possible Errors** | `400` invalid filters; `401` unauthenticated; `403` unauthorized |

### DASH-02 Platform Statistics

| Field | Definition |
|-------|------------|
| **Purpose** | Return user statistics and operational statistics aggregates |
| **HTTP Method** | `GET` |
| **URI** | `/admin/dashboard/statistics` |
| **Required Request** | Authenticated session; optional filters as in DASH-01 |
| **Successful Response** | User statistics and operational statistics payloads |
| **Possible Errors** | `400`, `401`, `403` |

### DASH-03 Growth Analytics

| Field | Definition |
|-------|------------|
| **Purpose** | Return growth trend series for companies, users, transactions, trips, expenses, subscriptions |
| **HTTP Method** | `GET` |
| **URI** | `/admin/analytics/growth` |
| **Required Request** | Authenticated session; optional `from`, `to`, granularity (`day`\|`week`\|`month`), and other dashboard filters |
| **Successful Response** | One or more labeled time series with points `{ period, value }` |
| **Possible Errors** | `400`, `401`, `403` |

### DASH-04 Subscription Analytics

| Field | Definition |
|-------|------------|
| **Purpose** | Return subscription overview analytics for the dashboard |
| **HTTP Method** | `GET` |
| **URI** | `/admin/analytics/subscriptions` |
| **Required Request** | Authenticated session; optional filters; optional `expiringWithinDays` |
| **Successful Response** | Distribution, status breakdown, average duration, expiring soon, recently expired, recently renewed lists |
| **Possible Errors** | `400`, `401`, `403` |

### DASH-05 Company Rankings

| Field | Definition |
|-------|------------|
| **Purpose** | Return company ranking lists for dashboard |
| **HTTP Method** | `GET` |
| **URI** | `/admin/analytics/company-rankings` |
| **Required Request** | Authenticated session; optional filters; optional `limit` (top N) |
| **Successful Response** | Ranked lists: most active, least active, newest, most users, highest transaction volume |
| **Possible Errors** | `400`, `401`, `403` |

### DASH-06 Recent Activities

| Field | Definition |
|-------|------------|
| **Purpose** | Return recent platform/admin activity items for the dashboard feed |
| **HTTP Method** | `GET` |
| **URI** | `/admin/dashboard/recent-activities` |
| **Required Request** | Authenticated session; optional filters; pagination or `limit` |
| **Successful Response** | Ordered activity items (type, subject, actor if applicable, timestamp, deep-link identifiers) |
| **Possible Errors** | `400`, `401`, `403` |

### DASH-07 Companies Requiring Attention

| Field | Definition |
|-------|------------|
| **Purpose** | Return companies that match attention rules |
| **HTTP Method** | `GET` |
| **URI** | `/admin/dashboard/attention-companies` |
| **Required Request** | Authenticated session; optional filters; optional `limit` |
| **Successful Response** | Companies with one or more attention reasons (expired subscription, suspended subscription, grace ending soon, no recent activity, locked owner accounts) |
| **Possible Errors** | `400`, `401`, `403` |

### DASH-08 Quick Actions Catalog

| Field | Definition |
|-------|------------|
| **Purpose** | Return the authorized set of dashboard quick actions (navigation targets only) |
| **HTTP Method** | `GET` |
| **URI** | `/admin/dashboard/quick-actions` |
| **Required Request** | Authenticated session |
| **Successful Response** | List of actions with key, label, and destination module identifier (create company, view companies, manage subscriptions, manage administrators, view reports, view activity logs) |
| **Possible Errors** | `401`, `403` |

## Validation Rules

| Area | Rules |
|------|--------|
| **Dashboard filters** | Subscription status and company status MUST be from allowed enumerations; `companyId` MUST be well-formed when provided |
| **Date range** | If both `from` and `to` provided, `from` MUST be less than or equal to `to`; ranges MUST NOT exceed the maximum historical window defined by platform policy |
| **Analytics** | Growth granularity MUST be one of the allowed values; `limit`/`pageSize` MUST be positive and within maximum caps |
| **Statistics** | Response metric values MUST be non-negative counts/volumes; missing series return empty arrays, not null errors |

## Business Rules

1. The Dashboard is read-only.
2. Dashboard statistics aggregate information across all companies (subject to applied filters).
3. Quick Actions redirect administrators to the appropriate management modules; they do not mutate data on the dashboard.
4. Dashboard information reflects current platform data at the time of retrieval.
5. Historical metrics are informational only.
6. Operational figures (transactions, trips, expenses, etc.) are monitoring summaries only and MUST NOT enable customer operational workflows.
7. Attention lists MUST explain why a company appears (at least one attention reason).

## Acceptance Criteria

- **AC-001**: After sign-in, Super Admins land on the dashboard as the default home experience in under 5 seconds under normal conditions.
- **AC-002**: Platform Overview displays all required company summary metrics when data is available.
- **AC-003**: User Statistics and Operational Statistics sections each render their required metrics as aggregates.
- **AC-004**: Growth Analytics returns series for all six growth families for a valid date range.
- **AC-005**: Subscription Overview includes distribution, status breakdown, and attention-oriented lists (expiring/expired/renewed).
- **AC-006**: Company Rankings include all five ranking types (or empty lists when no companies qualify).
- **AC-007**: Recent Activity shows newest events first and includes company/subscription/admin security action types when present in the retention window.
- **AC-008**: Companies Requiring Attention lists only companies matching defined attention rules, each with reason(s).
- **AC-009**: Every Quick Action navigates to the correct management module entry point and performs no dashboard-side write.
- **AC-010**: Invalid filters (e.g., inverted date range) are rejected with validation errors; valid filters refresh applicable sections.
- **AC-011**: A failure of one dashboard resource does not blank the entire dashboard when other resources succeed.
- **AC-012**: No dashboard interaction opens or executes customer business operational workflows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can answer “how many customers are active / expiring / needing attention?” from the landing dashboard within 30 seconds of arrival without leaving the page.
- **SC-002**: 100% of Quick Actions tested navigate to the intended module and 0% perform writes on the dashboard itself.
- **SC-003**: Under normal conditions, the primary overview metrics become visible within 5 seconds of landing.
- **SC-004**: When filters are applied, affected sections refresh to the filtered context in under 3 seconds under normal conditions.
- **SC-005**: In moderated acceptance trials, at least 90% of Super Admins correctly identify at least one attention company (when present) from the attention section without coaching.
- **SC-006**: Verification finds 0 paths from dashboard widgets into prohibited customer operational workflows.

## Future Considerations

Future versions MAY introduce without redesigning the Dashboard:

- Custom dashboard widgets
- Saved dashboard layouts
- Administrator personalization
- Real-time updates
- Notifications
- Announcements
- Goals tracking
- Revenue analytics
- MRR / ARR
- Churn analytics
- Customer health score
- Predictive insights

## Assumptions

- A001 foundation and A002 authentication are available; only authenticated console-authorized administrators reach the dashboard.
- “Trial” and “Grace Period” company/subscription states exist in platform data or are mappable from equivalent commercial statuses already used by Scrappy.
- “No recent activity” uses a configurable inactivity threshold (default on the order of 30 days) defined by platform policy.
- “Grace period ending soon” and “expiring soon” use a configurable day window (commonly 7–14 days).
- Rankings and feeds return a bounded top-N / first page suitable for a landing page; full lists live in dedicated modules.
- Quick Action “Create Company” navigates to the company management create entry point even if create is completed in that module, not on the dashboard.
- Metrics that count transactions/trips/expenses are monitoring aggregates only, consistent with the constitution’s summarized-monitoring allowance.

## Constraints

- Business requirements and REST resource contracts only.
- No implementation details, frameworks, middleware, project structure, database design, testing strategy, or code examples.
- This specification defines the Platform Dashboard & Analytics module only.
