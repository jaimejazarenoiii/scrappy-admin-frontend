# Implementation Plan: A001 — Scrappy Admin Console Foundation

**Branch**: `001-admin-console-foundation` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-admin-console-foundation/spec.md`

**Note**: Planning artifact only. No application code or source file trees are generated here.

## Summary

Build the Scrappy Admin Console as an internal-only React SPA that consumes the existing Scrappy REST API. Deliver a feature-based frontend foundation (auth, shell, reusable UI primitives, API client) then ship core admin modules in dependency order: Dashboard → Companies → Subscriptions → Analytics/Reports → Administration/Support → Polish.

Optimize for maintainability (feature encapsulation), scalability (server-driven lists/metrics), developer experience (typed API + shared table/form/chart kits), and rapid feature development (consistent module patterns).

## Technical Context

**Language/Version**: TypeScript (strict) on React 19

**Primary Dependencies**: Vite, Tailwind CSS v4, shadcn/ui, React Router v7, Zustand, TanStack Query, React Hook Form, Zod, Axios, TanStack Table, Recharts, Framer Motion, Lucide Icons

**Storage**: None in the frontend. Session tokens in secure browser storage strategy (see research.md). Server state via TanStack Query cache only.

**Testing**: Vitest for unit tests; React Testing Library for component tests. Apply to shared kits (API client, auth guards, table/form primitives) and critical flows (login, role guards). Do not generate tests in this planning phase.

**Target Platform**: Modern browsers; desktop-first admin SPA with tablet support; dark-mode-ready theming

**Project Type**: Frontend web application (SPA) consuming existing Scrappy REST backend

**Performance Goals**: Dashboard interactive after login under 3s typical; first-page search/list under 2s at thousands of companies; route-level code splitting for all feature modules; skeleton loading for async surfaces

**Constraints**: REST only; JWT + refresh; no customer credentials visible; no duplicated Scrappy business logic; immutable audit for admin writes; constitution Non-Goals enforced

**Scale/Scope**: Thousands of companies; internal admin users (not customer scale); modules listed in Core Features below

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Pre-research | Post-design |
|------|--------------|-------------|
| Platform administration only | PASS — modules are admin/ops only; analytics are summaries | PASS — contracts expose monitoring aggregates, not operational CRUD for trips/expenses/etc. |
| Internal use only | PASS — JWT admin auth + RBAC; no company-user access | PASS — role model limited to internal roles |
| Read-first | PASS — mutations limited to lifecycle/support/settings | PASS — data model marks operational records read-only |
| Non-goals | PASS — explicitly excluded | PASS — out of scope in contracts |
| Separation of responsibilities | PASS — Axios client to Scrappy API | PASS — no local business-rule engines |
| Auditability | PASS — FR-017 | PASS — AuditEvent entity + mutating endpoints require audit side-effect |
| Security | PASS — least privilege, RBAC, no credential display | PASS — auth/refresh/guards in contracts |
| Search / dashboard / consistency | PASS — first-class modules + shared kits | PASS — widget/table/form/chart contracts defined |
| Scalability & extensibility | PASS — server pagination, feature modules | PASS — feature architecture + extension points documented |
| UX & technology principles | PASS — stack chosen; a11y via shadcn patterns | PASS — performance/error UX planned |

**Gate result**: PASS (no unjustified violations). Complexity Tracking not required.

## Architecture Decisions (no source tree)

### Feature-based frontend

Each feature owns its pages, components, hooks, services/API calls, types, validation schemas, local UI store slices (if any), and utilities. Shared modules hold only cross-cutting UI kits, API client, auth session, layout shell, and design tokens.

Future modules (billing, tickets, feature flags, etc.) MUST plug in as new features without redesigning the shell.

### State management

| Concern | Store |
|---------|--------|
| Auth session shell (tokens present, current admin profile, roles) | Zustand |
| Theme / dark mode | Zustand |
| Sidebar open/collapsed | Zustand |
| Global filter chips that span modules (optional) | Zustand |
| Server entities, lists, metrics, search results | TanStack Query only |

Never mirror server lists/entities into Zustand.

### API layer

Single Axios instance with: auth header injection, refresh-token queue on 401, response normalization, typed error mapping, retry for idempotent GETs, and feature-level API functions returning typed DTOs. Backend remains source of truth.

### Routing

Nested layout under authenticated shell. Route modules lazy-loaded. Guards: `RequireAuth`, `RequireRole`. Public: login. System: 404, unauthorized.

### Reusable kits (build once, use everywhere)

- **Dashboard widgets**: summary card, chart widget, list widget (recent activity/companies), subscription status, growth, platform stats — independently composable.
- **Data table**: pagination, sorting, filtering, searching, column visibility, row actions, loading/empty; bulk actions reserved.
- **Forms**: RHF + Zod, error display, loading, success toasts, confirmation dialogs for destructive/support actions.
- **Charts**: growth trends, subscription distribution, activity timeline, platform usage, company rankings.

### UI/UX

Modern SaaS admin: responsive, desktop-first, tablet support, dark-mode ready, consistent spacing, accessible components, professional hierarchy, Framer Motion for intentional presence (not noise).

### Performance

Route lazy loading / code splitting; Query caching + staleTimes per resource; optimistic updates only for low-risk UI-confirmable actions (e.g., note add) where rollback is clear; skeleton loading; avoid premature memoization—prefer React 19 defaults unless profiling demands it.

### Error handling

Global error boundary; Axios error → toast + optional retry; empty states; route-level unauthorized/404.

### Testing strategy (recommend only)

- **Unit**: token refresh queue, role-guard helpers, Zod schemas, table filter/query param mappers.
- **Component**: shared table/form/widget kits; login form; confirmation dialogs.
- **Skip generating tests in planning/implementation tasks unless explicitly requested later.**

## Core Features (delivery scope)

Foundation · Authentication · Dashboard · Company Management · Company Details · Company Statistics · Company Notes · Company Owners · Administrator Management · Subscription Management · Analytics · Reports · Activity Logs · Global Search · Password Reset · Settings

## Implementation Phases

### Phase 1 — Project Foundation

**Objectives**: Bootstrap Vite/React/TS app, Tailwind v4 + shadcn/ui, design tokens (incl. dark-mode readiness), layout shell, feature-module conventions, Axios + TanStack Query baselines, routing shell with 404/unauthorized placeholders.

**Dependencies**: None (start).

**Deliverables**: Runnable app shell; shared providers; API client stub wired to env base URL; lint/format; path aliases; feature folder convention documented in README for implementers.

**Completion criteria**: App boots; empty authenticated layout renders; Query/Axios providers live; no feature business logic yet.

---

### Phase 2 — Authentication & Authorization

**Objectives**: Login, JWT + refresh, protected routes, role guards, session Zustand store, logout, unauthorized page.

**Dependencies**: Phase 1.

**Deliverables**: Auth feature module; session persistence strategy; interceptor refresh; role helper utilities.

**Completion criteria**: Valid admin can log in/out; expired access token refreshes; invalid refresh forces login; role guard blocks unauthorized routes; login audited (server-side event visible when API available).

---

### Phase 3 — Shared Interaction Kits

**Objectives**: Ship reusable data table, form primitives, chart wrappers, dashboard widget frames, toast/error patterns, confirmation dialogs—before domain modules proliferate.

**Dependencies**: Phase 1 (Phase 2 preferred for realistic auth headers in Storybook-less manual checks).

**Deliverables**: Table/form/chart/widget kits with loading/empty/error states; documented usage contracts in `contracts/ui-kits.md`.

**Completion criteria**: A sample page can compose table + form + chart + widget without domain coupling; a11y basics (labels, focus, keyboard) verified on kits.

---

### Phase 4 — Dashboard

**Objectives**: Dashboard-first landing with independent widgets answering constitution “platform health” questions.

**Dependencies**: Phases 2–3; dashboard metrics API availability (mock or real).

**Deliverables**: Dashboard page composing summary cards, charts, recent activity, recent companies, subscription status, growth, platform statistics.

**Completion criteria**: Post-login landing shows health signals; widgets load independently (one failure does not blank the page); skeletons while loading.

---

### Phase 5 — Company Management

**Objectives**: Company list + detail (statistics, notes, owners) + activate/deactivate with confirmations and audit visibility.

**Dependencies**: Phases 2–3; company APIs.

**Deliverables**: Company feature module with consistent list/search/filter/sort/detail patterns; notes CRUD (admin notes); owners read view; lifecycle actions.

**Completion criteria**: Search/filter/paginate works; detail tabs/sections for stats/notes/owners; mutations confirm + toast + audit entry observable; read-first preserved for operational records.

---

### Phase 6 — Subscription Management

**Objectives**: Subscription list/detail and lifecycle actions (create/renew/suspend/expire as API allows).

**Dependencies**: Phase 5 (company context linkage); Phases 2–3.

**Deliverables**: Subscription feature module; status filters; dashboard widget data alignment.

**Completion criteria**: Expiring-soon filter works; lifecycle transitions confirmed and audited; company deep-links bidirectional.

---

### Phase 7 — Analytics & Reports

**Objectives**: Platform-wide informational analytics and report views (aggregates only).

**Dependencies**: Phases 2–3; analytics/report APIs.

**Deliverables**: Analytics feature; Reports feature; chart kit reuse; export reserved as future.

**Completion criteria**: Cross-company metrics render; no operational workflow screens; empty/error states handled.

---

### Phase 8 — Administration, Search & Support

**Objectives**: Administrator management, global search, activity logs, password reset/unlock, settings.

**Dependencies**: Phases 2–3; preferably Phase 5 for company/user deep-links.

**Deliverables**: Admin users module; global search entry points; activity log browser; support actions; settings screens with RBAC.

**Completion criteria**: Search hits deep-link; support actions never show credentials; settings changes audited; activity log filters by actor/action/date.

---

### Phase 9 — Polish

**Objectives**: Performance pass (lazy routes, cache tuning), UX consistency, accessibility, error-boundary coverage, dark-mode verification, constitution compliance sweep.

**Dependencies**: Phases 1–8 functionally complete for MVP scope.

**Deliverables**: Hardened UX; known-issue list; quickstart validation executed.

**Completion criteria**: SC-001–SC-006 checklist pass; Non-Goals still excluded; no credential leakage; route splitting verified; skeleton/empty/error consistency across modules.

## Milestones

| Milestone | After phase | Meaning |
|-----------|-------------|---------|
| M0 Shell | 1 | App boots with providers |
| M1 Secure entry | 2 | Auth + RBAC usable |
| M2 Kit complete | 3 | Tables/forms/charts/widgets reusable |
| M3 Ops day-one | 4–5 | Dashboard + companies |
| M4 Revenue ops | 6 | Subscriptions |
| M5 Insight | 7 | Analytics/reports |
| M6 Full foundation | 8–9 | Support/admin/search/settings + polish |

## Project Structure

### Documentation (this feature)

```text
specs/001-admin-console-foundation/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
└── tasks.md             # Phase 2 (/speckit-tasks — not created here)
```

### Source Code (repository root)

Per product owner direction for this plan: **no concrete source file tree is prescribed here**. Implementation MUST follow feature-based encapsulation and shared-kit rules in Architecture Decisions. Concrete paths are deferred to `/speckit-tasks` / implementers once the repo scaffold exists.

**Structure Decision**: Single frontend SPA (Vite + React) consuming Scrappy REST API. Feature modules + shared cross-cutting modules. No backend code in this repository’s foundation scope.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
