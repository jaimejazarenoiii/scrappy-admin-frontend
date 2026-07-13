---
description: "Task list for A001 Scrappy Admin Console Foundation"
---

# Tasks: A001 — Scrappy Admin Console Foundation

**Input**: Design documents from `/specs/001-admin-console-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — no test tasks generated (per plan/research).

**Organization**: Tasks grouped by user story for independent implementation and validation.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[Story]**: US1–US4 maps to spec.md user stories
- Paths assume Vite React SPA under `src/` with feature-based modules

## Path Conventions

- Features: `src/features/<feature>/` (pages, components, hooks, api, types, validation)
- Shared: `src/shared/` (ui kits, api client, stores, layout, lib)
- App shell: `src/app/` (providers, router, error boundary)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap the Vite + React 19 + TypeScript application and tooling

- [x] T001 Scaffold Vite React TypeScript app at repository root with `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`
- [x] T002 [P] Add core dependencies in `package.json` (react-router, zustand, @tanstack/react-query, axios, react-hook-form, zod, @hookform/resolvers, @tanstack/react-table, recharts, framer-motion, lucide-react)
- [x] T003 [P] Configure Tailwind CSS v4 and global styles in `src/index.css` and `vite.config.ts`
- [x] T004 [P] Initialize shadcn/ui config in `components.json` and base UI primitives under `src/shared/ui/`
- [x] T005 [P] Configure path aliases (`@/` → `src/`) in `vite.config.ts` and `tsconfig.app.json`
- [x] T006 [P] Add env example and typed env helper in `.env.example` and `src/shared/config/env.ts`
- [x] T007 [P] Configure ESLint/Prettier in `eslint.config.js` and related config files
- [x] T008 Create feature-module convention notes in `README.md`

**Checkpoint**: App boots with empty root render

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cross-cutting infrastructure required before ANY user story

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T009 Create app providers (QueryClient, theme) in `src/app/providers.tsx`
- [x] T010 [P] Implement Axios client with base URL in `src/shared/api/client.ts`
- [x] T011 [P] Implement typed API error mapping in `src/shared/api/errors.ts`
- [x] T012 [P] Implement request/response interceptors stub (auth header + refresh queue hooks) in `src/shared/api/interceptors.ts`
- [x] T013 [P] Add idempotent GET retry helpers in `src/shared/api/retry.ts`
- [x] T014 [P] Create theme Zustand store in `src/shared/stores/theme-store.ts`
- [x] T015 [P] Create sidebar Zustand store in `src/shared/stores/sidebar-store.ts`
- [x] T016 [P] Create role/permission helpers in `src/shared/lib/rbac.ts`
- [x] T017 [P] Create shared domain types (Role, paginated response) in `src/shared/types/api.ts`
- [x] T018 Implement authenticated app shell layout in `src/shared/layout/app-shell.tsx`
- [x] T019 [P] Implement sidebar navigation skeleton in `src/shared/layout/sidebar.tsx`
- [x] T020 [P] Implement top bar with placeholders for search/user menu in `src/shared/layout/top-bar.tsx`
- [x] T021 [P] Implement `RequireAuth` guard in `src/shared/routing/require-auth.tsx`
- [x] T022 [P] Implement `RequireRole` guard in `src/shared/routing/require-role.tsx`
- [x] T023 [P] Implement 404 page in `src/shared/pages/not-found-page.tsx`
- [x] T024 [P] Implement unauthorized page in `src/shared/pages/unauthorized-page.tsx`
- [x] T025 Wire router shell with lazy route slots in `src/app/router.tsx`
- [x] T026 [P] Implement global error boundary in `src/app/error-boundary.tsx`
- [x] T027 [P] Implement toast notification helpers in `src/shared/ui/toast.ts`
- [x] T028 [P] Implement confirmation dialog primitive in `src/shared/ui/confirmation-dialog.tsx`
- [x] T029 [P] Implement empty state primitive in `src/shared/ui/empty-state.tsx`
- [x] T030 [P] Implement skeleton loaders in `src/shared/ui/skeleton.tsx`
- [x] T031 Implement reusable data table kit in `src/shared/ui/data-table/data-table.tsx`
- [x] T032 [P] Add data table column visibility controls in `src/shared/ui/data-table/column-visibility.tsx`
- [x] T033 [P] Add data table toolbar (search/filter slots) in `src/shared/ui/data-table/data-table-toolbar.tsx`
- [x] T034 [P] Add pagination controls in `src/shared/ui/data-table/data-table-pagination.tsx`
- [x] T035 Implement form field helpers (RHF + Zod) in `src/shared/ui/form/form.tsx`
- [x] T036 [P] Implement chart wrappers (growth, distribution, timeline, usage, rankings) in `src/shared/ui/charts/`
- [x] T037 [P] Implement dashboard widget frame in `src/shared/ui/widgets/widget-frame.tsx`
- [x] T038 [P] Implement summary card widget in `src/shared/ui/widgets/summary-card.tsx`
- [x] T039 Mount app entry with providers/router/error boundary in `src/main.tsx` and `src/app/app.tsx`

**Checkpoint**: Foundation ready — user stories can proceed

---

## Phase 3: User Story 1 — Authenticate and land on platform health (Priority: P1) 🎯 MVP

**Goal**: Internal admin signs in with JWT/refresh, reaches a health dashboard, and is blocked from unauthorized routes

**Independent Test**: Sign in → dashboard widgets show health signals → role without access hits unauthorized → sign-out clears session

### Implementation for User Story 1

- [x] T040 [P] [US1] Define auth/admin types in `src/features/auth/types.ts`
- [x] T041 [P] [US1] Define login Zod schema in `src/features/auth/validation/login-schema.ts`
- [x] T042 [P] [US1] Implement auth API (login/refresh/logout/me) in `src/features/auth/api/auth-api.ts`
- [x] T043 [US1] Implement auth session Zustand store in `src/features/auth/store/auth-store.ts`
- [x] T044 [US1] Wire token attach + single-flight refresh in `src/shared/api/interceptors.ts` using auth store
- [x] T045 [US1] Implement login page/form in `src/features/auth/pages/login-page.tsx`
- [x] T046 [P] [US1] Implement logout control in `src/features/auth/components/logout-button.tsx`
- [x] T047 [US1] Register public `/login` and auth redirects in `src/app/router.tsx`
- [x] T048 [P] [US1] Define dashboard metric types in `src/features/dashboard/types.ts`
- [x] T049 [P] [US1] Implement dashboard metrics API in `src/features/dashboard/api/dashboard-api.ts`
- [x] T050 [P] [US1] Implement dashboard query hooks in `src/features/dashboard/hooks/use-dashboard-metrics.ts`
- [x] T051 [P] [US1] Build summary cards widget in `src/features/dashboard/components/summary-cards-widget.tsx`
- [x] T052 [P] [US1] Build subscription status widget in `src/features/dashboard/components/subscription-status-widget.tsx`
- [x] T053 [P] [US1] Build growth metrics widget in `src/features/dashboard/components/growth-metrics-widget.tsx`
- [x] T054 [P] [US1] Build platform statistics widget in `src/features/dashboard/components/platform-stats-widget.tsx`
- [x] T055 [P] [US1] Build recent activity widget in `src/features/dashboard/components/recent-activity-widget.tsx`
- [x] T056 [P] [US1] Build recent companies widget in `src/features/dashboard/components/recent-companies-widget.tsx`
- [x] T057 [US1] Compose dashboard page with independent widgets in `src/features/dashboard/pages/dashboard-page.tsx`
- [x] T058 [US1] Register protected `/dashboard` lazy route and `/` redirect in `src/app/router.tsx`
- [x] T059 [US1] Add Dashboard nav item and user menu session display in `src/shared/layout/sidebar.tsx` and `src/shared/layout/top-bar.tsx`

**Checkpoint**: US1 independently usable (auth + dashboard MVP)

---

## Phase 4: User Story 2 — Manage companies end-to-end (Priority: P1)

**Goal**: Find companies via list/search/filter, open details (stats/notes/owners), activate/deactivate with audited notes

**Independent Test**: Search company → open details → add note → change status → confirm activity/audit entry

### Implementation for User Story 2

- [x] T060 [P] [US2] Define company domain types in `src/features/companies/types.ts`
- [x] T061 [P] [US2] Define note Zod schema in `src/features/companies/validation/note-schema.ts`
- [x] T062 [P] [US2] Implement companies API in `src/features/companies/api/companies-api.ts`
- [x] T063 [P] [US2] Implement company query hooks in `src/features/companies/hooks/use-companies.ts`
- [x] T064 [US2] Build companies list page with data table (search/filter/sort/pagination) in `src/features/companies/pages/companies-list-page.tsx`
- [x] T065 [P] [US2] Build company table columns/row actions in `src/features/companies/components/company-columns.tsx`
- [x] T066 [US2] Build company detail page shell in `src/features/companies/pages/company-detail-page.tsx`
- [x] T067 [P] [US2] Build company statistics panel in `src/features/companies/components/company-statistics-panel.tsx`
- [x] T068 [P] [US2] Build company owners panel (read-only) in `src/features/companies/components/company-owners-panel.tsx`
- [x] T069 [P] [US2] Build company notes list/form in `src/features/companies/components/company-notes-panel.tsx`
- [x] T070 [US2] Implement activate/deactivate with confirmation dialog in `src/features/companies/components/company-lifecycle-actions.tsx`
- [x] T071 [US2] Register `/companies` and `/companies/:id` lazy routes with role guards in `src/app/router.tsx`
- [x] T072 [US2] Add Companies nav item in `src/shared/layout/sidebar.tsx`

**Checkpoint**: US1 + US2 independently functional

---

## Phase 5: User Story 3 — Manage subscriptions (Priority: P2)

**Goal**: List/filter subscriptions, perform renew/suspend/expire lifecycle actions with audit, align with company deep-links

**Independent Test**: Open subscriptions → filter expiring soon → suspend → verify status and audit

### Implementation for User Story 3

- [x] T073 [P] [US3] Define subscription types in `src/features/subscriptions/types.ts`
- [x] T074 [P] [US3] Define create/renew Zod schemas in `src/features/subscriptions/validation/subscription-schema.ts`
- [x] T075 [P] [US3] Implement subscriptions API in `src/features/subscriptions/api/subscriptions-api.ts`
- [x] T076 [P] [US3] Implement subscription query/mutation hooks in `src/features/subscriptions/hooks/use-subscriptions.ts`
- [x] T077 [US3] Build subscriptions list page with status/expiry filters in `src/features/subscriptions/pages/subscriptions-list-page.tsx`
- [x] T078 [P] [US3] Build subscription table columns/row actions in `src/features/subscriptions/components/subscription-columns.tsx`
- [x] T079 [US3] Build subscription detail page in `src/features/subscriptions/pages/subscription-detail-page.tsx`
- [x] T080 [US3] Implement renew/suspend/expire confirmation actions in `src/features/subscriptions/components/subscription-lifecycle-actions.tsx`
- [x] T081 [P] [US3] Add company→subscription deep-link affordance in `src/features/companies/pages/company-detail-page.tsx`
- [x] T082 [US3] Register `/subscriptions` and `/subscriptions/:id` lazy routes in `src/app/router.tsx`
- [x] T083 [US3] Add Subscriptions nav item in `src/shared/layout/sidebar.tsx`

**Checkpoint**: US1–US3 independently functional

---

## Phase 6: User Story 4 — Support, search, and administration (Priority: P2)

**Goal**: Global search, password reset/unlock, activity logs, administrator management, analytics, reports, settings — consistent patterns, no credential exposure

**Independent Test**: Search user → unlock/reset → view activity → open analytics/report → update setting (authorized role)

### Implementation for User Story 4

- [x] T084 [P] [US4] Define search result types in `src/features/search/types.ts`
- [x] T085 [P] [US4] Implement search API in `src/features/search/api/search-api.ts`
- [x] T086 [P] [US4] Implement search query hook in `src/features/search/hooks/use-global-search.ts`
- [x] T087 [US4] Build global search command/overlay in `src/features/search/components/global-search.tsx`
- [x] T088 [P] [US4] Build dedicated search results page in `src/features/search/pages/search-page.tsx`
- [x] T089 [US4] Wire global search into top bar in `src/shared/layout/top-bar.tsx`
- [x] T090 [P] [US4] Define support action types in `src/features/support/types.ts`
- [x] T091 [P] [US4] Implement support API (password-reset/unlock/user search) in `src/features/support/api/support-api.ts`
- [x] T092 [US4] Build password reset/unlock dialogs (never render credentials) in `src/features/support/components/user-support-actions.tsx`
- [x] T093 [P] [US4] Define activity/audit types in `src/features/activity/types.ts`
- [x] T094 [P] [US4] Implement activity API in `src/features/activity/api/activity-api.ts`
- [x] T095 [US4] Build activity logs page with filters in `src/features/activity/pages/activity-list-page.tsx`
- [x] T096 [P] [US4] Define administrator types in `src/features/administrators/types.ts`
- [x] T097 [P] [US4] Define administrator Zod schemas in `src/features/administrators/validation/administrator-schema.ts`
- [x] T098 [P] [US4] Implement administrators API in `src/features/administrators/api/administrators-api.ts`
- [x] T099 [US4] Build administrators list page in `src/features/administrators/pages/administrators-list-page.tsx`
- [x] T100 [US4] Build administrator detail/create/update flows in `src/features/administrators/pages/administrator-detail-page.tsx`
- [x] T101 [P] [US4] Define analytics types in `src/features/analytics/types.ts`
- [x] T102 [P] [US4] Implement analytics API in `src/features/analytics/api/analytics-api.ts`
- [x] T103 [US4] Build analytics page with shared charts in `src/features/analytics/pages/analytics-page.tsx`
- [x] T104 [P] [US4] Define reports types in `src/features/reports/types.ts`
- [x] T105 [P] [US4] Implement reports API in `src/features/reports/api/reports-api.ts`
- [x] T106 [US4] Build reports page in `src/features/reports/pages/reports-page.tsx`
- [x] T107 [P] [US4] Define settings types in `src/features/settings/types.ts`
- [x] T108 [P] [US4] Implement settings API in `src/features/settings/api/settings-api.ts`
- [x] T109 [US4] Build settings page with RBAC-gated edits in `src/features/settings/pages/settings-page.tsx`
- [x] T110 [US4] Register lazy routes for search/activity/administrators/analytics/reports/settings in `src/app/router.tsx`
- [x] T111 [US4] Add nav items for US4 modules in `src/shared/layout/sidebar.tsx`
- [x] T112 [US4] Enforce Read Only Analyst write blocks on support/settings/admin mutations via `RequireRole` and disabled actions in feature components

**Checkpoint**: All user stories independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Performance, security, constitution compliance, validation

- [x] T113 [P] Verify route-level code splitting for all feature pages in `src/app/router.tsx`
- [x] T114 [P] Tune TanStack Query staleTimes/cache defaults in `src/app/providers.tsx`
- [x] T115 Audit UI for credential/token non-exposure across `src/features/auth/` and `src/features/support/`
- [x] T116 Verify immutable audit side-effects are surfaced after mutations in `src/features/companies/`, `src/features/subscriptions/`, `src/features/support/`, and `src/features/settings/`
- [x] T117 Confirm Non-Goals: no inventory/POS/trip/expense/attendance/warehouse workflow routes in `src/app/router.tsx` or `src/shared/layout/sidebar.tsx`
- [x] T118 [P] Accessibility pass on shared kits in `src/shared/ui/` (labels, focus, keyboard)
- [x] T119 [P] Dark-mode token verification via `src/shared/stores/theme-store.ts` and `src/index.css`
- [x] T120 Run quickstart validation scenarios from `specs/001-admin-console-foundation/quickstart.md` and record results in `specs/001-admin-console-foundation/quickstart-results.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP
- **US2 (Phase 4)**: Depends on Foundational; benefits from US1 shell/auth but independently testable with mocked session
- **US3 (Phase 5)**: Depends on Foundational; company deep-link (T081) soft-depends on US2 detail page
- **US4 (Phase 6)**: Depends on Foundational; deep-links benefit from US2/US3 routes existing
- **Polish (Phase 7)**: Depends on completed target stories

### User Story Dependencies

- **US1 (P1)**: After Foundational — no story dependencies
- **US2 (P1)**: After Foundational — uses shared table/form kits; auth from US1 in integrated runs
- **US3 (P2)**: After Foundational — optional company deep-link to US2
- **US4 (P2)**: After Foundational — optional deep-links to US2/US3 entities

### Within Each User Story

- Types/validation → API → hooks → pages/components → router/nav wiring
- Confirmations before destructive/support mutations
- No server entity lists in Zustand

### Parallel Opportunities

- Phase 1: T002–T007 in parallel after T001
- Phase 2: API/store/layout/kit clusters marked [P]
- After Foundational: US2/US3/US4 can proceed in parallel once US1 MVP is stable (or fully parallel with mocked auth)
- Within stories: type/API/widget tasks marked [P]

---

## Parallel Example: User Story 1

```bash
# Parallel after auth store exists:
Task: "Build summary cards widget in src/features/dashboard/components/summary-cards-widget.tsx"
Task: "Build subscription status widget in src/features/dashboard/components/subscription-status-widget.tsx"
Task: "Build growth metrics widget in src/features/dashboard/components/growth-metrics-widget.tsx"
Task: "Build recent activity widget in src/features/dashboard/components/recent-activity-widget.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "Implement search API in src/features/search/api/search-api.ts"
Task: "Implement activity API in src/features/activity/api/activity-api.ts"
Task: "Implement analytics API in src/features/analytics/api/analytics-api.ts"
Task: "Implement settings API in src/features/settings/api/settings-api.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (auth + dashboard)
4. **STOP and VALIDATE** using US1 independent test + quickstart V1/V2
5. Demo secure entry + platform health

### Incremental Delivery

1. Setup + Foundational → shell ready
2. US1 → MVP demo
3. US2 → company lifecycle
4. US3 → subscriptions
5. US4 → support/search/admin/insights/settings
6. Polish → SC-001–SC-006 + constitution sweep

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Then:
   - Dev A: US1 polish / dashboard widgets
   - Dev B: US2 companies
   - Dev C: US3 subscriptions
   - Dev D: US4 modules (split by feature folders)

---

## Notes

- [P] = different files, no incomplete dependencies
- [USn] required on story-phase tasks only
- Tests omitted (not requested)
- Prefer TanStack Query for server state; Zustand only for auth shell/theme/sidebar
- Commit after each task or logical group
- Stop at checkpoints to validate independently
