# Implementation Plan: A003 — Platform Dashboard & Analytics

**Branch**: `003-platform-dashboard-analytics` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-platform-dashboard-analytics/spec.md`

**Note**: Planning only. No application code or source file trees are generated here.

## Summary

Evolve the A001 provisional dashboard into the full A003 Platform Dashboard & Analytics experience: independent, reusable read-only widgets for overview, user/operational statistics, subscription analytics, growth charts, rankings, recent activity, attention companies, and quick actions—driven by Scrappy REST DASH-01–DASH-08, with shared dashboard filters (date range, subscription status, company status, company) that consistently refresh Query-backed widgets.

Preserve Apple-like SaaS UX (skeletons, empty/error/retry, motion-safe stagger) and constitution rules: informational aggregates only; no customer business operations from the dashboard.

## Technical Context

**Language/Version**: TypeScript (strict) on React 19

**Primary Dependencies**: Vite, Tailwind CSS v4, shadcn/ui, React Router v7, Zustand, TanStack Query, React Hook Form, Zod, Axios, TanStack Table (list cards where useful), Recharts, Framer Motion, Lucide React

**Storage**: No server entity caches in Zustand. Dashboard filter UI state in Zustand (or URL-synced filters). All metrics/feeds via TanStack Query.

**Testing**: Recommend widget/chart/filter/navigation/Query integration tests later. Do not generate tests in this plan.

**Target Platform**: Modern browsers; desktop-first dense dashboard; tablet-responsive; dark-mode-ready tokens from A001

**Project Type**: Frontend SPA consuming Scrappy REST API

**Performance Goals**: Overview visible under 5s (AC-001/SC-003); filter refresh under 3s (SC-004); independent widget queries; skeleton loading; stale-while-revalidate caching

**Constraints**: Read-only; Super Admin console access (A002); DASH-01–DASH-08 contracts; no customer workflows; monitoring aggregates only for transactions/trips/expenses

**Scale/Scope**: Thousands of companies; bounded top-N feeds/rankings on landing; full lists in destination modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Pre-research | Post-design |
|------|--------------|-------------|
| Platform administration only | PASS — monitoring aggregates + nav only | PASS — contracts are GET analytics |
| Internal use only | PASS — authenticated console admins | PASS — 401/403 on contracts |
| Read-first | PASS — dashboard read-only | PASS — Quick Actions navigate only |
| Non-goals | PASS — no ops workflows | PASS — deep-links to admin modules only |
| Separation of responsibilities | PASS — Scrappy REST consumer | PASS — DASH-* URIs |
| Auditability | PASS — view not newly audited; activity is display | PASS |
| Security | PASS — auth required; no secrets | PASS |
| Search / dashboard / consistency | PASS — Dashboard First | PASS — widget/filter patterns |
| Scalability & extensibility | PASS — independent widgets; top-N | PASS — future widgets noted |
| UX & technology principles | PASS — stack locked | PASS — phases cover polish |

**Gate result**: PASS. Complexity Tracking not required.

## Architecture Decisions (no source tree)

### Relationship to A001 / A002

A001 shipped a starter dashboard with provisional metrics widgets. A003 replaces/extends that surface to match DASH-01–DASH-08 and full section inventory. A002 ensures only authorized Super Admins reach the console landing route.

### Dashboard composition

Landing page composes **independent section widgets**. Each widget owns (or receives) a TanStack Query key including the active filter set. One widget failure shows local error/retry; siblings keep working (FR-015).

### Sections → widgets

| Section | Widget types |
|---------|----------------|
| Platform Overview | Summary metric cards |
| User Statistics | Summary / statistics cards |
| Operational Statistics | Summary / statistics cards |
| Subscription Overview | Chart card (distribution) + list cards (expiring/expired/renewed) + stats |
| Growth Analytics | Chart cards (line/area) per growth family or multi-series |
| Company Rankings | Ranking cards (bar or ordered lists) |
| Recent Activity | Activity card / compact list |
| Companies Requiring Attention | Attention cards / list with reasons |
| Quick Actions | Quick action cards (navigation only) |
| Recent Companies | Optional list card if supplied by summary/activity APIs or derived |

### Chart kit (reuse / extend A001 Recharts wrappers)

Line · Area · Bar · Pie/Donut for: company/user/transaction/trip/expense/subscription growth; subscription distribution; rankings; activity volume if exposed.

Charts: loading skeleton, empty series, error+retry, accessible text values (not color-only), reduced-motion safe.

### Filters

Shared filter model: `from`, `to`, `subscriptionStatus`, `companyStatus`, `companyId`.

- Validate with Zod (date order, enums, id format) before applying.
- Store applied filters in Zustand **and/or** URL search params (research preference: URL as source of truth for shareable state; Zustand mirror for UI convenience).
- On apply: invalidate/refetch all filter-sensitive Query keys consistently.
- Quick Actions and pure nav targets ignore filters except where destination accepts query handoff (optional later).

### Zustand vs TanStack Query

| Zustand | TanStack Query |
|---------|----------------|
| Draft/applied dashboard filters | DASH-01–DASH-08 responses |
| Collapsible section UI prefs (optional) | — |
| Selected company filter chip | — |

Never put metric payloads, rankings, or activity arrays in Zustand.

### API integration UX

Per resource: loading (skeleton), success, empty, error+retry. Mutations: none on dashboard. Caching: moderate `staleTime` for summary/stats; shorter for attention/activity if freshness matters; `refetchOnWindowFocus` optional/throttled. Background refetch allowed without blanking UI.

### Navigation

Widget deep-links / Quick Actions navigate to:

- Companies (list/create entry)
- Subscriptions
- Administrators
- Reports
- Activity logs
- Company detail / subscription detail when item selected

Never to customer operational modules.

### Performance

- Route already lazy from A001; keep section code-splitting if bundle grows
- Query caching + parallel section fetches
- Widget independence (separate queries)
- Avoid unnecessary parent re-renders: filter context subscription granularity
- Skeleton loading; Framer stagger with `prefers-reduced-motion`

### Error handling

API/network failures → section error+retry; invalid filters → block apply + inline validation; 401/403 → existing auth/unauthorized flows; empty analytics → empty states (not errors).

### Testing recommendations (no tests generated)

Dashboard section components · charts · filter validation/apply · widget isolation · Quick Action navigation · Query key/filter integration

## Implementation Phases

### Phase 1 — Dashboard Foundation

**Objectives**: Align dashboard API client to DASH-01–DASH-08; shared filter types/schema; filter bar shell; page composition scaffold with independent widget slots; Query key factory including filters.

**Dependencies**: A001 shell, A002 auth, approved A003 spec.

**Deliverables**: Typed dashboard/analytics API functions; filter model + Zod; dashboard page layout regions; mock parity for new endpoints.

**Completion criteria**: Authenticated landing renders scaffold; filters can be applied without crashing; at least one live/mock summary query succeeds.

---

### Phase 2 — Summary Widgets

**Objectives**: Platform Overview, User Statistics, Operational Statistics summary cards from DASH-01/DASH-02.

**Dependencies**: Phase 1.

**Deliverables**: Summary metric widgets with skeleton/empty/error/retry; overview answers constitution health questions for companies/users/ops counts.

**Completion criteria**: AC-002/AC-003 observable; section independence verified (force one failure).

---

### Phase 3 — Analytics Charts

**Objectives**: Growth Analytics (DASH-03) and Subscription Overview charts/lists (DASH-04).

**Dependencies**: Phase 1; Phase 2 preferred for layout consistency.

**Deliverables**: Line/area/bar/pie chart cards; subscription distribution + expiring/expired/renewed lists; average duration / status breakdown.

**Completion criteria**: AC-004/AC-005; charts accessible (values visible); no ops workflow links.

---

### Phase 4 — Activity, Rankings & Attention

**Objectives**: Company Rankings (DASH-05), Recent Activity (DASH-06), Attention Companies (DASH-07), Quick Actions (DASH-08), optional Recent Companies card.

**Dependencies**: Phase 1.

**Deliverables**: Ranking cards; activity feed; attention list with reasons; quick action navigation cards; deep-links to admin modules.

**Completion criteria**: AC-006–AC-009/AC-012; empty attention state works.

---

### Phase 5 — Filtering

**Objectives**: Full filter UX (date range, subscription status, company status, company); consistent refresh of all filter-sensitive widgets; invalid range handling.

**Dependencies**: Phases 2–4 widgets consuming filter keys.

**Deliverables**: Filter bar apply/reset; URL sync (per research); validation messages; coordinated refetch.

**Completion criteria**: AC-010/SC-004; filtered vs unfiltered data visibly differs in mock/live.

---

### Phase 6 — Performance & Polish

**Objectives**: Cache tuning, skeleton consistency, motion polish, a11y, constitution Non-Goals sweep, quickstart validation.

**Dependencies**: Phases 1–5.

**Deliverables**: Polished landing dashboard; quickstart results recorded.

**Completion criteria**: AC-001–AC-012 and SC-001–SC-006 checked for frontend scope; constitution post-design PASS.

## Milestones

| Milestone | After | Meaning |
|-----------|-------|---------|
| M1 Shell | Phase 1 | Filters + API + layout |
| M2 Health glance | Phase 2 | Overview/stats cards |
| M3 Trends | Phase 3 | Growth + subscription analytics |
| M4 Attention | Phase 4 | Rankings/activity/attention/actions |
| M5 Focused view | Phase 5 | Filters consistent |
| M6 A003 done | Phase 6 | Polished + validated |

## Project Structure

### Documentation (this feature)

```text
specs/003-platform-dashboard-analytics/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # /speckit-tasks — not created here
```

### Source Code (repository root)

Per product-owner direction: **no concrete source file tree is prescribed**. Implement within existing A001 feature-based dashboard/shared widget/chart conventions. Paths deferred to `/speckit-tasks`.

**Structure Decision**: Frontend-only changes in Admin Console SPA; backend remains Scrappy REST API.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
