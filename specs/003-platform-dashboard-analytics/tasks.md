---
description: "Task list for A003 Platform Dashboard & Analytics"
---

# Tasks: A003 — Platform Dashboard & Analytics

**Input**: Design documents from `/specs/003-platform-dashboard-analytics/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — no test tasks generated.

**Organization**: User stories in priority order (US1 → US2 → US4 → US3 → US5). Evolves A001 dashboard under `src/features/dashboard/`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelizable (different files, no incomplete dependencies)
- **[Story]**: [US1]–[US5] maps to spec.md user stories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align A003 types and docs for DASH-01–DASH-08

- [x] T001 Document A003 dashboard filter defaults (30-day range, expiringWithinDays=14) in `.env.example`
- [x] T002 [P] Replace provisional dashboard domain types with A003 read models in `src/features/dashboard/types.ts`
- [x] T003 [P] Add DashboardFilterSet and related Zod-ready filter field types in `src/features/dashboard/types.ts`

**Checkpoint**: Types ready for foundational API/filter work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API client, query keys, filter store/URL sync, page scaffold — BLOCKS all stories

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T004 Align dashboard API module to DASH-01–DASH-08 in `src/features/dashboard/api/dashboard-api.ts`
- [x] T005 [P] Add dashboard query-key factory including filters in `src/features/dashboard/lib/query-keys.ts`
- [x] T006 [P] Add dashboard filter Zod schema in `src/features/dashboard/validation/filter-schema.ts`
- [x] T007 Implement dashboard filter Zustand store (draft + applied mirror) in `src/features/dashboard/store/filter-store.ts`
- [x] T008 [P] Implement URL search-param sync helpers for filters in `src/features/dashboard/lib/filter-url.ts`
- [x] T009 Build dashboard filter bar UI (date range, statuses, company, apply/reset) in `src/features/dashboard/components/dashboard-filter-bar.tsx`
- [x] T010 Compose dashboard page scaffold with filter bar and section slots in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T011 [P] Extend mock handlers for DASH-01–DASH-08 parity in `src/shared/mocks/handlers.ts`
- [x] T012 [P] Seed mock dashboard fixtures (overview, stats, growth, attention cases) in `src/shared/mocks/data.ts`
- [x] T013 [P] Extend shared chart wrappers for pie/donut and multi-series growth as needed in `src/shared/ui/charts/index.tsx`

**Checkpoint**: Foundation ready — stories can proceed

---

## Phase 3: User Story 1 — View platform overview on landing (Priority: P1) 🎯 MVP

**Goal**: Super Admin lands on dashboard and sees Platform Overview company health metrics with independent loading/error

**Independent Test**: Sign in → `/dashboard` → overview metrics (total/active/trial/grace/expired/suspended + new today/month) visible

### Implementation for User Story 1

- [x] T014 [P] [US1] Add useDashboardSummary query hook (DASH-01) in `src/features/dashboard/hooks/use-dashboard-summary.ts`
- [x] T015 [US1] Build Platform Overview summary cards widget in `src/features/dashboard/components/platform-overview-widget.tsx`
- [x] T016 [US1] Mount Platform Overview on dashboard page with skeleton/error/retry in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T017 [US1] Ensure post-login default landing remains `/dashboard` in `src/app/router.tsx`

**Checkpoint**: US1 independently usable (overview MVP)

---

## Phase 4: User Story 2 — Monitor growth and operational statistics (Priority: P1)

**Goal**: User statistics, operational statistics, and growth trend charts as informational aggregates

**Independent Test**: Dashboard shows user stats, ops stats, and growth series for six families without opening customer workflows

### Implementation for User Story 2

- [x] T018 [P] [US2] Add usePlatformStatistics query hook (DASH-02) in `src/features/dashboard/hooks/use-platform-statistics.ts`
- [x] T019 [P] [US2] Add useGrowthAnalytics query hook (DASH-03) in `src/features/dashboard/hooks/use-growth-analytics.ts`
- [x] T020 [US2] Build User Statistics widget in `src/features/dashboard/components/user-statistics-widget.tsx`
- [x] T021 [US2] Build Operational Statistics widget in `src/features/dashboard/components/operational-statistics-widget.tsx`
- [x] T022 [US2] Build Growth Analytics chart widgets in `src/features/dashboard/components/growth-analytics-widget.tsx`
- [x] T023 [US2] Retire/replace provisional `platform-stats-widget` / `growth-metrics-widget` usage in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T024 [US2] Verify metrics are display-only (no ops workflow links) in `src/features/dashboard/components/operational-statistics-widget.tsx`

**Checkpoint**: US1 + US2 health + trends

---

## Phase 5: User Story 4 — Recent activity and companies requiring attention (Priority: P1)

**Goal**: Recent activity feed and attention companies with reasons; empty states when none

**Independent Test**: Activity newest-first; attention list with reasons or clear empty state

### Implementation for User Story 4

- [x] T025 [P] [US4] Add useRecentActivities query hook (DASH-06) in `src/features/dashboard/hooks/use-recent-activities.ts`
- [x] T026 [P] [US4] Add useAttentionCompanies query hook (DASH-07) in `src/features/dashboard/hooks/use-attention-companies.ts`
- [x] T027 [US4] Rebuild Recent Activity widget with deep-links to admin modules in `src/features/dashboard/components/recent-activity-widget.tsx`
- [x] T028 [US4] Build Companies Requiring Attention widget with reason badges in `src/features/dashboard/components/attention-companies-widget.tsx`
- [x] T029 [P] [US4] Update Recent Companies widget to use summary preview or activity-derived list in `src/features/dashboard/components/recent-companies-widget.tsx`
- [x] T030 [US4] Mount activity + attention (+ recent companies) sections on dashboard page in `src/features/dashboard/pages/dashboard-page.tsx`

**Checkpoint**: US1/US2/US4 answer “what needs attention?”

---

## Phase 6: User Story 3 — Monitor subscriptions and rankings (Priority: P2)

**Goal**: Subscription overview (distribution + lists) and five company ranking lists with admin deep-links

**Independent Test**: Subscription overview + all ranking types render; row click goes to company/subscription admin routes

### Implementation for User Story 3

- [x] T031 [P] [US3] Add useSubscriptionAnalytics query hook (DASH-04) in `src/features/dashboard/hooks/use-subscription-analytics.ts`
- [x] T032 [P] [US3] Add useCompanyRankings query hook (DASH-05) in `src/features/dashboard/hooks/use-company-rankings.ts`
- [x] T033 [US3] Build Subscription Overview widget (pie + lists + duration/breakdown) in `src/features/dashboard/components/subscription-overview-widget.tsx`
- [x] T034 [US3] Build Company Rankings widget (five lists/bars) in `src/features/dashboard/components/company-rankings-widget.tsx`
- [x] T035 [US3] Replace provisional `subscription-status-widget` with Subscription Overview on page in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T036 [US3] Wire ranking/subscription item navigation to `/companies/:id` or `/subscriptions/:id` in ranking/overview widgets

**Checkpoint**: US3 commercial/activity concentration visible

---

## Phase 7: User Story 5 — Quick actions and dashboard filters (Priority: P2)

**Goal**: Quick Actions navigate to modules only; filters validate and consistently refresh all filter-sensitive widgets

**Independent Test**: Each Quick Action navigates correctly; valid filters refresh sections; invalid date range blocked

### Implementation for User Story 5

- [x] T037 [P] [US5] Add useQuickActions query hook (DASH-08) with static fallback catalog in `src/features/dashboard/hooks/use-quick-actions.ts`
- [x] T038 [US5] Build Quick Actions widget (navigation-only cards) in `src/features/dashboard/components/quick-actions-widget.tsx`
- [x] T039 [US5] Mount Quick Actions on dashboard page in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T040 [US5] Wire filter bar Apply to URL + applied store and Reset defaults in `src/features/dashboard/components/dashboard-filter-bar.tsx`
- [x] T041 [US5] Ensure all dashboard hooks read applied filters via query keys in `src/features/dashboard/hooks/`
- [x] T042 [US5] Surface filter validation errors (inverted range, bad enums) in `src/features/dashboard/components/dashboard-filter-bar.tsx`
- [x] T043 [US5] Map Quick Action destinations to console routes in `src/features/dashboard/lib/quick-action-routes.ts`

**Checkpoint**: All user stories independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, a11y, constitution sweep, quickstart

- [x] T044 Tune TanStack Query staleTimes for dashboard keys in `src/app/providers.tsx` or dashboard hooks
- [x] T045 [P] Verify section independence (one failing query does not blank page) in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T046 [P] Accessibility pass on charts/cards (visible values, focusable links) in `src/features/dashboard/components/`
- [x] T047 Confirm Non-Goals: no customer workflow routes from dashboard widgets in `src/features/dashboard/`
- [x] T048 Motion polish with reduced-motion respect on dashboard page in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T049 Remove obsolete provisional dashboard API paths/hooks if unused under `src/features/dashboard/`
- [x] T050 Run quickstart scenarios from `specs/003-platform-dashboard-analytics/quickstart.md` and record results in `specs/003-platform-dashboard-analytics/quickstart-results.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: None
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS stories
- **US1 (Phase 3)**: Foundational — MVP
- **US2 (Phase 4)**: Foundational; benefits from US1 layout
- **US4 (Phase 5)**: Foundational; parallelizable with US2/US3 after Foundational
- **US3 (Phase 6)**: Foundational
- **US5 (Phase 7)**: Needs widgets from US1–US4 to demonstrate filter refresh (filter bar shell exists in Phase 2)
- **Polish (Phase 8)**: After target stories

### User Story Dependencies

- **US1 (P1)**: After Foundational
- **US2 (P1)**: After Foundational
- **US4 (P1)**: After Foundational
- **US3 (P2)**: After Foundational
- **US5 (P2)**: After Foundational; best after other sections exist for filter demo

### Parallel Opportunities

- Phase 2: API, query keys, schema, mocks, charts marked [P]
- After Foundational: US2/US3/US4 hooks/widgets in parallel
- US5 quick actions parallel with filter wiring

---

## Parallel Example: User Story 2

```bash
Task: "Add usePlatformStatistics query hook in src/features/dashboard/hooks/use-platform-statistics.ts"
Task: "Add useGrowthAnalytics query hook in src/features/dashboard/hooks/use-growth-analytics.ts"
```

## Parallel Example: User Story 4

```bash
Task: "Add useRecentActivities query hook in src/features/dashboard/hooks/use-recent-activities.ts"
Task: "Add useAttentionCompanies query hook in src/features/dashboard/hooks/use-attention-companies.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phases 1–2
2. Phase 3 US1 overview
3. **STOP and VALIDATE** landing health metrics

### Incremental Delivery

1. US1 → overview
2. US2 → stats + growth
3. US4 → activity + attention
4. US3 → subscriptions + rankings
5. US5 → filters + quick actions
6. Polish

### Parallel Team Strategy

After Foundational: Dev A US2, Dev B US4, Dev C US3; then US5 integrates filters across widgets.

---

## Notes

- [P] = different files, no incomplete dependencies
- [USn] on story-phase tasks only
- No test tasks
- TanStack Query for all DASH data; Zustand only for filter draft/UI
- Read-only dashboard; Quick Actions navigate only
- Commit after each task or logical group
