<!--
Sync Impact Report:
- Version change: (template/unversioned) → 1.0.0
- Modified principles: N/A (initial ratification from placeholders)
  - [PRINCIPLE_1_NAME] → I. Platform Administration Only
  - [PRINCIPLE_2_NAME] → II. Internal Use Only
  - [PRINCIPLE_3_NAME] → III. Read-First Philosophy
  - [PRINCIPLE_4_NAME] → IV. Customer Lifecycle Management
  - [PRINCIPLE_5_NAME] → V. Platform Analytics
  - Added: VI–XIV (Operational Support through Extensibility)
- Added sections: Vision, Non-Goals, User Experience Principles,
  Technology Principles; expanded Core Principles to XIV
- Removed sections: generic [SECTION_2_NAME], [SECTION_3_NAME]
  placeholders (replaced by Non-Goals, UX, Technology)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates)
  - ✅ .specify/templates/spec-template.md (scope / non-goals / actors)
  - ✅ .specify/templates/tasks-template.md (principle-driven task types)
  - ✅ .specify/templates/checklist-template.md (constitution compliance category)
  - N/A .specify/templates/commands/*.md (directory not present)
  - N/A README.md / docs/quickstart.md (not present in repo)
- Follow-up TODOs: none
-->

# Scrappy Admin Console Constitution

## Vision

The Scrappy Admin Console is the internal administration platform used
exclusively by the Scrappy team to operate, monitor, and support the
Scrappy SaaS platform.

It is NOT part of the customer-facing Scrappy application.

Its primary responsibility is platform administration, customer
management, subscription management, reporting, analytics, and
operational support.

The Admin Console MUST provide complete visibility across every company
while remaining isolated from company business operations.

## Core Principles

### I. Platform Administration Only

This application exists to manage the Scrappy platform. It MUST never
become a replacement for the customer application. Company operational
workflows MUST remain inside the Scrappy application.

Prohibited features include purchasing, selling, transactions, trips,
expenses, inventory operations, warehouse workflows, employee
attendance, and business reports.

The Admin Console MAY display summarized information from these modules
for monitoring purposes only.

**Rationale**: Clear product boundary prevents scope creep and keeps
customer operations in the product designed for them.

### II. Internal Use Only

Only internal Scrappy personnel MAY access this application. Company
Owners, Managers, and Employees MUST never have access.

The system MUST be designed to support additional internal roles
(including Super Admin, Admin, Support, Finance, Sales, and Read Only
Analyst) without major redesign.

**Rationale**: Isolating admin access protects customer data and enables
role growth without architectural rework.

### III. Read-First Philosophy

Whenever possible, administrators MUST observe rather than modify
customer data. Customer operational records are business records and
MUST NOT be editable through the Admin Console unless explicitly
required for platform support.

The console prioritizes visibility over intervention.

**Rationale**: Minimizing write paths reduces risk of accidental or
unauthorized changes to customer business data.

### IV. Customer Lifecycle Management

The Admin Console is responsible for managing the complete customer
lifecycle, including company registration, activation, and
deactivation; subscription management, renewal, suspension, and
expiration; customer notes and status; and platform access.

**Rationale**: Lifecycle ownership is a core admin responsibility and
must remain complete and coherent in one place.

### V. Platform Analytics

The Admin Console serves as the single source of truth for
platform-wide analytics. Analytics MUST aggregate data across all
companies.

Examples include company and user growth, subscription metrics,
platform usage, activity trends, transaction/trip/expense volume,
branch/warehouse/vehicle counts, login statistics, platform health,
and customer engagement.

Analytics are informational only.

**Rationale**: Cross-company visibility requires a dedicated,
read-oriented analytics surface that does not live in tenant apps.

### VI. Operational Support

The console MUST provide support tools including password reset,
account unlock, user and company search, administrative notes,
customer timeline, administrative activity, and support history.

These actions exist to assist customers while maintaining
accountability.

**Rationale**: Support efficacy depends on discoverable tools with
traceable administrative actions.

### VII. Complete Auditability

Every administrative action MUST be recorded. Examples include company
and subscription lifecycle events, password reset, user lock/unlock,
administrator login, administrative note changes, and platform setting
changes.

Audit records MUST be immutable.

**Rationale**: Immutable audit trails are required for accountability,
compliance, and incident investigation.

### VIII. Scalability

The platform MUST support thousands of companies without redesign.
Dashboard metrics, search, reports, and analytics MUST remain usable as
the customer base grows. Features SHOULD be designed to support future
expansion.

**Rationale**: Admin tooling that degrades with growth becomes
operationally unusable at the scale the business targets.

### IX. Search First

Administrators MUST be able to locate information quickly. Global
search MUST support companies, users, subscriptions, administrators,
notes, activity logs, reports, and future entities. Search SHOULD be
available throughout the application.

**Rationale**: Support and ops workflows start with findability;
search is a primary navigation path, not a secondary feature.

### X. Dashboard First

The landing page MUST immediately communicate platform health. The
dashboard MUST surface answers such as: how many customers are active,
which subscriptions expire soon, how many users exist, how many
companies registered recently, how many transactions occurred today,
which companies are inactive, and what requires administrator
attention.

**Rationale**: Operators need immediate situational awareness before
drilling into modules.

### XI. Consistency

All management modules MUST provide a consistent experience. Standard
capabilities include list, search, filter, sort, view details, create,
update, activate, deactivate, notes, activity history, pagination, and
exports (future).

Consistency reduces administrator training time.

**Rationale**: Uniform patterns lower cognitive load and accelerate
safe, correct admin work.

### XII. Security

The Admin Console manages sensitive platform information. Security
requirements include least privilege, strong authentication, session
management, administrative audit logs, role-based access control,
secure password management, and restricted administrative actions.

Customer credentials MUST never be visible.

**Rationale**: A compromised or overly privileged admin surface
endangers the entire platform and all tenants.

### XIII. Separation of Responsibilities

Business operations belong to the Scrappy application. Platform
operations belong to the Admin Console.

The Admin Console MUST consume platform APIs and services rather than
duplicating business logic.

**Rationale**: Duplicated business logic drifts, creates inconsistent
behavior, and blurs product boundaries.

### XIV. Extensibility

The architecture MUST allow future modules—including billing,
invoices, online payments, support tickets, customer messaging,
feature flags, maintenance mode, API keys and usage, system
announcements, email broadcasts, webhook monitoring, license
management, CRM, sales pipeline, marketing dashboard, and platform
monitoring—without requiring significant redesign.

**Rationale**: Known growth areas must fit the modular shape of the
console without forcing structural rewrites.

## Non-Goals

The Admin Console MUST NOT perform:

- Inventory management
- Business transactions
- Trip operations
- Expense operations
- Employee attendance
- Payroll
- Warehouse operations
- Customer daily workflows
- Point-of-sale operations

These remain inside the Scrappy customer application.

## User Experience Principles

The application MUST prioritize:

- Fast navigation
- Clear information hierarchy
- Minimal clicks
- Powerful search
- High information density
- Responsive layouts
- Consistent interfaces
- Actionable dashboards
- Professional visual design
- Accessibility

## Technology Principles

The implementation MUST emphasize:

- Maintainability
- Scalability
- Reliability
- Performance
- Security
- Observability
- Testability
- Loose coupling
- Modularity
- Clear separation of concerns
- API-first design

This constitution intentionally avoids prescribing specific frameworks
or technologies. Technology choices MAY evolve while preserving these
architectural principles.

## Governance

This constitution supersedes conflicting informal practices for the
Scrappy Admin Console. All feature specifications, implementation
plans, and reviews MUST verify compliance with these principles.

Amendments MUST:

1. Document the change and rationale in this file
2. Update the Sync Impact Report comment at the top of this file
3. Increment `CONSTITUTION_VERSION` using semantic versioning:
   - MAJOR: backward-incompatible principle removals or redefinitions
   - MINOR: new principle/section or materially expanded guidance
   - PATCH: clarifications, wording, and non-semantic refinements
4. Propagate material changes to dependent templates under
   `.specify/templates/`
5. Set **Last Amended** to the amendment date (ISO YYYY-MM-DD)

Compliance review expectations:

- Plans MUST pass the Constitution Check gate before Phase 0 research
  and again after Phase 1 design
- Specs MUST declare scope against Non-Goals and actor constraints
  (internal-only)
- Tasks that mutate customer or platform state MUST include audit
  logging where Principle VII applies
- Complexity that appears to violate a principle MUST be recorded in
  the plan Complexity Tracking table with justification

**Version**: 1.0.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-13
