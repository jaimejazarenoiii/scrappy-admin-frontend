---
description: "Task list for A004 Platform Management"
---

# Tasks: A004 — Platform Management

**Input**: Design documents from `/specs/004-platform-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — no test tasks generated.

**Organization**: User stories in priority order (US1 → US2 → US3 → US4 → US5). Evolves A001 provisional modules under `src/features/{companies,administrators,subscriptions,activity,search,settings,reports,support}/` plus new exports feature. Final MVP slice after A001–A003.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelizable (different files, no incomplete dependencies)
- **[Story]**: [US1]–[US5] maps to spec.md user stories
- Paths assume existing Vite React SPA feature layout

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align A004 domain types, capabilities, and env notes for PM-* contracts

- [x] T001 Document A004 Platform Management mock/API expectations in `.env.example`
- [x] T002 [P] Align Company / CompanyStatistics / AdministrativeNote / timeline types to A004 data-model in `src/features/companies/types.ts`
- [x] T003 [P] Align CompanyOwner types (status, locked, lastLoginAt) in `src/features/companies/types.ts`
- [x] T004 [P] Align PlatformAdministrator types (roles, status, locked) in `src/features/administrators/types.ts`
- [x] T005 [P] Align Subscription types and allowed lifecycle statuses in `src/features/subscriptions/types.ts`
- [x] T006 [P] Align ActivityLogEntry / SearchResult / PlatformSetting / Report types in `src/features/activity/types.ts`, `src/features/search/types.ts`, `src/features/settings/` (add `types.ts` if missing), `src/features/reports/` (add `types.ts` if missing)
- [x] T007 [P] Add ExportJob domain types in `src/features/exports/types.ts`
- [x] T008 Extend RBAC capability helpers (`can`) for future roles while MVP Super Admin allows all in `src/shared/lib/rbac.ts`

**Checkpoint**: Types/capabilities ready for foundational shared kit + API work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared management UI kit, list URL sync, confirm-action patterns, mock PM-* skeleton, routing shells — BLOCKS all user stories

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T009 [P] Add shared list-query URL sync helpers (q, page, sort, filters) in `src/shared/lib/list-url.ts`
- [x] T010 [P] Add shared management page header component in `src/shared/ui/management/page-header.tsx`
- [x] T011 [P] Add shared entity status badge component in `src/shared/ui/management/status-badge.tsx`
- [x] T012 [P] Extend ConfirmationDialog usage helpers / lifecycle confirm copy defaults in `src/shared/ui/confirmation-dialog.tsx` (or `src/shared/ui/management/lifecycle-confirm.tsx`)
- [x] T013 [P] Add shared notes composer component in `src/shared/ui/management/notes-composer.tsx`
- [x] T014 [P] Add shared timeline list component in `src/shared/ui/management/timeline-list.tsx`
- [x] T015 [P] Add shared login-history table component in `src/shared/ui/management/login-history-table.tsx`
- [x] T016 [P] Add pm query-key factory conventions in `src/shared/lib/pm-query-keys.ts`
- [x] T017 Wire sidebar nav entries for Companies, Subscriptions, Administrators, Reports, Activity, Settings, Exports in `src/shared/layout/sidebar.tsx`
- [x] T018 Register lazy routes for company create, owner detail, admin create, exports center (keep existing routes) in `src/app/router.tsx`
- [x] T019 [P] Extend mock fixtures for companies/owners/admins/subscriptions/activity/settings/reports/exports in `src/shared/mocks/data.ts`
- [x] T020 Extend mock handlers skeleton covering all PM-* IDs (stub or partial OK until story completes) in `src/shared/mocks/handlers.ts`
- [x] T021 [P] Align dashboard Quick Action destinations to A004 routes in `src/features/dashboard/lib/quick-action-routes.ts`

**Checkpoint**: Foundation ready — user stories can proceed

---

## Phase 3: User Story 1 — Manage companies end-to-end (Priority: P1) 🎯 MVP

**Goal**: Super Admin creates, searches, views, updates, activates/deactivates companies; reviews statistics, notes, and administrative timeline

**Independent Test**: Create company → search/filter → open details (stats, notes, timeline) → update → deactivate → activate → confirm audit entries in activity (when activity mock records mutations)

### Implementation for User Story 1

- [x] T022 [P] [US1] Implement full PM-CO-* API client (list/create/get/patch/activate/deactivate/statistics/timeline/notes) in `src/features/companies/api/companies-api.ts`
- [x] T023 [P] [US1] Add company Zod schemas (create/update) in `src/features/companies/validation/company-schema.ts`
- [x] T024 [P] [US1] Add companies list query-key helpers in `src/features/companies/lib/query-keys.ts`
- [x] T025 [US1] Add useCompanies list hook with URL-synced filters in `src/features/companies/hooks/use-companies.ts`
- [x] T026 [P] [US1] Add useCompany / useCompanyStatistics / useCompanyTimeline / useCompanyNotes hooks in `src/features/companies/hooks/use-company-detail.ts`
- [x] T027 [US1] Add company create/update/activate/deactivate/note mutations with invalidation in `src/features/companies/hooks/use-company-mutations.ts`
- [x] T028 [US1] Rebuild company columns (status, subscription summary, sorting affordances) in `src/features/companies/components/company-columns.tsx`
- [x] T029 [US1] Rebuild companies list page (search, filters, pagination, empty/error) in `src/features/companies/pages/companies-list-page.tsx`
- [x] T030 [P] [US1] Build company create form page in `src/features/companies/pages/company-create-page.tsx`
- [x] T031 [P] [US1] Build company edit form component in `src/features/companies/components/company-form.tsx`
- [x] T032 [US1] Evolve company lifecycle actions (confirm activate/deactivate, non-optimistic) in `src/features/companies/components/company-lifecycle-actions.tsx`
- [x] T033 [US1] Rebuild company statistics panel (read-only monitoring) in `src/features/companies/components/company-statistics-panel.tsx`
- [x] T034 [US1] Rebuild company notes panel using shared notes composer in `src/features/companies/components/company-notes-panel.tsx`
- [x] T035 [P] [US1] Build company timeline panel in `src/features/companies/components/company-timeline-panel.tsx`
- [x] T036 [US1] Rebuild company detail page with tabs (Overview, Statistics, Owners stub, Subscriptions stub, Notes, Timeline) in `src/features/companies/pages/company-detail-page.tsx`
- [x] T037 [US1] Complete mock PM-CO-* parity including audits side-effects in `src/shared/mocks/handlers.ts`
- [x] T038 [US1] Ensure `/companies` and `/companies/new` and `/companies/:id` routes work under Super Admin in `src/app/router.tsx`

**Checkpoint**: US1 independently usable (companies MVP)

---

## Phase 4: User Story 2 — Manage company owners and password resets (Priority: P1)

**Goal**: Manage owners (CRUD, activate/deactivate, lock/unlock), reset passwords without showing credentials, view login history and activity summary

**Independent Test**: Open owner → lock → unlock → reset password → confirm no credential display; login history / activity summary visible

### Implementation for User Story 2

- [x] T039 [P] [US2] Implement PM-OW-* and PM-PW-01 API client methods in `src/features/companies/api/owners-api.ts`
- [x] T040 [P] [US2] Add owner Zod schemas in `src/features/companies/validation/owner-schema.ts`
- [x] T041 [P] [US2] Add owner query keys in `src/features/companies/lib/owner-query-keys.ts`
- [x] T042 [US2] Add owner list/detail/history/activity hooks in `src/features/companies/hooks/use-owners.ts`
- [x] T043 [US2] Add owner mutations (create/update/activate/deactivate/lock/unlock/password-reset) in `src/features/companies/hooks/use-owner-mutations.ts`
- [x] T044 [US2] Rebuild company owners panel (table + create entry) in `src/features/companies/components/company-owners-panel.tsx`
- [x] T045 [P] [US2] Build owner create/edit form in `src/features/companies/components/owner-form.tsx`
- [x] T046 [US2] Build owner lifecycle + password-reset actions (confirm; no secrets in UI) in `src/features/companies/components/owner-support-actions.tsx`
- [x] T047 [US2] Build owner detail page (profile, histories, actions) in `src/features/companies/pages/owner-detail-page.tsx`
- [x] T048 [US2] Wire `/owners/:id` (or `/companies/:companyId/owners/:id`) route in `src/app/router.tsx`
- [x] T049 [US2] Retire or thin `src/features/support/components/user-support-actions.tsx` in favor of owner-support-actions if duplicated
- [x] T050 [US2] Complete mock PM-OW-* / PM-PW-01 (ack only, audit events) in `src/shared/mocks/handlers.ts`
- [x] T051 [US2] Mount Owners tab content on company detail to use full panel in `src/features/companies/pages/company-detail-page.tsx`

**Checkpoint**: US1 + US2 company + owner support flows

---

## Phase 5: User Story 3 — Manage platform administrators (Priority: P1)

**Goal**: Create/view/update administrators, role assignment, activate/deactivate/lock/unlock, password reset, login/activity history; last Super Admin protection UX

**Independent Test**: Create admin → update roles → lock → reset password → view histories; sole Active Super Admin cannot be deactivated/locked

### Implementation for User Story 3

- [x] T052 [P] [US3] Align administrators API to full PM-AD-* + PM-PW-02 in `src/features/administrators/api/administrators-api.ts`
- [x] T053 [P] [US3] Extend administrator Zod schemas (create/update/roles) in `src/features/administrators/validation/administrator-schema.ts`
- [x] T054 [P] [US3] Add administrator query keys in `src/features/administrators/lib/query-keys.ts`
- [x] T055 [US3] Evolve list/detail hooks for filters + histories in `src/features/administrators/hooks/use-administrators.ts`
- [x] T056 [US3] Add administrator mutations (CRUD lifecycle, roles, password-reset) with invalidation in `src/features/administrators/hooks/use-administrator-mutations.ts`
- [x] T057 [US3] Rebuild administrator columns and row actions in `src/features/administrators/components/administrator-columns.tsx`
- [x] T058 [US3] Rebuild administrators list page (search/filter/pagination) in `src/features/administrators/pages/administrators-list-page.tsx`
- [x] T059 [P] [US3] Build administrator create page/form in `src/features/administrators/pages/administrator-create-page.tsx`
- [x] T060 [P] [US3] Build administrator form (profile + role assignment) in `src/features/administrators/components/administrator-form.tsx`
- [x] T061 [US3] Build administrator lifecycle + password-reset actions with last-SA error surfacing in `src/features/administrators/components/administrator-lifecycle-actions.tsx`
- [x] T062 [US3] Rebuild administrator detail page (profile, roles, login history, activity history) in `src/features/administrators/pages/administrator-detail-page.tsx`
- [x] T063 [US3] Wire `/administrators/new` route in `src/app/router.tsx`
- [x] T064 [US3] Complete mock PM-AD-* / PM-PW-02 including last Super Admin rule in `src/shared/mocks/handlers.ts`

**Checkpoint**: US1–US3 core people/company administration

---

## Phase 6: User Story 4 — Manage subscriptions (Priority: P2)

**Goal**: Current subscription + history; create/renew/suspend/expire; subscription notes; transitions follow subscription rules

**Independent Test**: Open company subscription → renew/suspend/expire → history and notes update; invalid transitions rejected

### Implementation for User Story 4

- [x] T065 [P] [US4] Align subscriptions API to full PM-SU-* in `src/features/subscriptions/api/subscriptions-api.ts`
- [x] T066 [P] [US4] Add subscription Zod schemas (create/renew) in `src/features/subscriptions/validation/subscription-schema.ts`
- [x] T067 [P] [US4] Add subscription query keys in `src/features/subscriptions/lib/query-keys.ts`
- [x] T068 [US4] Evolve subscription list/detail/history/notes hooks in `src/features/subscriptions/hooks/use-subscriptions.ts`
- [x] T069 [US4] Add subscription mutations (create/renew/suspend/expire/notes) in `src/features/subscriptions/hooks/use-subscription-mutations.ts`
- [x] T070 [P] [US4] Add client allow-map helper for lifecycle actions by status in `src/features/subscriptions/lib/lifecycle-allow.ts`
- [x] T071 [US4] Rebuild subscription columns in `src/features/subscriptions/components/subscription-columns.tsx`
- [x] T072 [US4] Rebuild subscriptions list page in `src/features/subscriptions/pages/subscriptions-list-page.tsx`
- [x] T073 [P] [US4] Build subscription create page/form in `src/features/subscriptions/pages/subscription-create-page.tsx`
- [x] T074 [US4] Evolve lifecycle actions (confirm renew/suspend/expire; non-optimistic) in `src/features/subscriptions/components/subscription-lifecycle-actions.tsx`
- [x] T075 [P] [US4] Build subscription notes panel in `src/features/subscriptions/components/subscription-notes-panel.tsx`
- [x] T076 [US4] Rebuild subscription detail page (current, history, notes, actions) in `src/features/subscriptions/pages/subscription-detail-page.tsx`
- [x] T077 [US4] Add company subscriptions tab/panel on company detail in `src/features/companies/components/company-subscriptions-panel.tsx`
- [x] T078 [US4] Mount subscriptions panel on company detail tabs in `src/features/companies/pages/company-detail-page.tsx`
- [x] T079 [US4] Wire `/subscriptions/new` route in `src/app/router.tsx`
- [x] T080 [US4] Complete mock PM-SU-* with transition enforcement + audits in `src/shared/mocks/handlers.ts`

**Checkpoint**: US1–US4 commercial lifecycle complete

---

## Phase 7: User Story 5 — Reports, activity, search, settings, and exports (Priority: P2)

**Goal**: Informational reports; immutable activity browser; global search; platform settings; export jobs

**Independent Test**: Run a companies report → search a company → open activity → change a setting → export activity → confirm audits for mutating/export actions

### Implementation for User Story 5

#### Activity

- [x] T081 [P] [US5] Align activity API to PM-AC-01 (filters/pagination; no mutations) in `src/features/activity/api/activity-api.ts`
- [x] T082 [P] [US5] Add activity query keys + filter Zod in `src/features/activity/lib/query-keys.ts` and `src/features/activity/validation/activity-filter-schema.ts`
- [x] T083 [US5] Evolve useActivity hook with URL-synced filters in `src/features/activity/hooks/use-activity.ts`
- [x] T084 [US5] Rebuild activity columns (immutable; navigate-to-target) in `src/features/activity/components/activity-columns.tsx`
- [x] T085 [US5] Rebuild activity list page (filters, empty/error, no edit/delete) in `src/features/activity/pages/activity-list-page.tsx`

#### Global search

- [x] T086 [P] [US5] Align search API to PM-SE-01 in `src/features/search/api/search-api.ts`
- [x] T087 [US5] Evolve useSearch (debounce, type filters, pagination) in `src/features/search/hooks/use-search.ts`
- [x] T088 [US5] Rebuild header GlobalSearch component deep-linking to `/search` in `src/features/search/components/global-search.tsx`
- [x] T089 [US5] Rebuild search page (results, type badges, pagination) in `src/features/search/pages/search-page.tsx`

#### Reports

- [x] T090 [P] [US5] Align reports API to PM-RP-01/02 in `src/features/reports/api/reports-api.ts`
- [x] T091 [P] [US5] Add report filter Zod schemas per report key in `src/features/reports/validation/report-filter-schema.ts`
- [x] T092 [US5] Add report catalog/run hooks in `src/features/reports/hooks/use-reports.ts`
- [x] T093 [US5] Rebuild reports page (catalog, filters, run, informational results table/charts) in `src/features/reports/pages/reports-page.tsx`

#### Settings

- [x] T094 [P] [US5] Align settings API to PM-ST-01/02 in `src/features/settings/api/settings-api.ts`
- [x] T095 [P] [US5] Add settings value Zod validators by category in `src/features/settings/validation/settings-schema.ts`
- [x] T096 [US5] Add settings query/mutation hooks with invalidation in `src/features/settings/hooks/use-settings.ts`
- [x] T097 [US5] Rebuild settings page (category nav + editors + confirm for security policies) in `src/features/settings/pages/settings-page.tsx`

#### Exports

- [x] T098 [P] [US5] Implement PM-EX-01/02 API client in `src/features/exports/api/exports-api.ts`
- [x] T099 [P] [US5] Add export scope Zod schema in `src/features/exports/validation/export-schema.ts`
- [x] T100 [US5] Add export create + poll-status hooks in `src/features/exports/hooks/use-exports.ts`
- [x] T101 [US5] Build exports center page (dataset, scope, job status, download) in `src/features/exports/pages/exports-page.tsx`
- [x] T102 [P] [US5] Build reusable export-trigger control for module contexts in `src/features/exports/components/export-trigger.tsx`
- [x] T103 [US5] Wire `/exports` route and sidebar active state in `src/app/router.tsx` and `src/shared/layout/sidebar.tsx`

#### Mocks & cross-links

- [x] T104 [US5] Complete mock PM-AC / PM-SE / PM-RP / PM-ST / PM-EX parity in `src/shared/mocks/handlers.ts`
- [x] T105 [US5] Ensure dashboard Quick Actions reach reports/activity/settings/exports/companies in `src/features/dashboard/components/quick-actions-widget.tsx`

**Checkpoint**: All five user stories independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, a11y, constitution Non-Goals, DoD, quickstart

- [x] T106 [P] Verify password-reset success UIs never render credentials in `src/features/companies/components/owner-support-actions.tsx` and `src/features/administrators/components/administrator-lifecycle-actions.tsx`
- [x] T107 [P] Confirm activity UIs have zero edit/delete affordances in `src/features/activity/pages/activity-list-page.tsx` and `src/features/activity/components/activity-columns.tsx`
- [x] T108 Sweep Platform Management for customer operational workflow entry points (constitution Non-Goals) in `src/features/companies/`, `src/features/subscriptions/`, `src/features/reports/`, and `src/features/dashboard/`
- [x] T109 [P] Add loading skeletons / empty / error+retry consistency on list/detail pages under `src/features/companies/pages/`, `src/features/administrators/pages/`, and `src/features/subscriptions/pages/`
- [x] T110 [P] Keyboard/focus management pass on `src/shared/ui/confirmation-dialog.tsx` and management forms under `src/features/*/components/`
- [x] T111 Tune TanStack Query staleTime/keepPreviousData per research in `src/features/*/hooks/use-*.ts` for PM list/detail queries
- [x] T112 [P] Responsive pass: filter collapse and priority columns in `src/features/companies/pages/companies-list-page.tsx`, `src/features/administrators/pages/administrators-list-page.tsx`, and `src/features/subscriptions/pages/subscriptions-list-page.tsx`
- [x] T113 Invalidate activity queries after mutations in `src/features/companies/hooks/use-company-mutations.ts`, `src/features/companies/hooks/use-owner-mutations.ts`, `src/features/administrators/hooks/use-administrator-mutations.ts`, `src/features/subscriptions/hooks/use-subscription-mutations.ts`, `src/features/settings/hooks/use-settings.ts`, and `src/features/exports/hooks/use-exports.ts`
- [x] T114 Run `npm run build` and fix type errors introduced by A004 across `src/`
- [x] T115 Execute `specs/004-platform-management/quickstart.md` scenarios V1–V7 and record results in `specs/004-platform-management/quickstart-results.md`
- [x] T116 Mark A004 acceptance (AC-001–AC-012 / SC-001–SC-006 frontend-observable) in `specs/004-platform-management/quickstart-results.md` after validation

**Checkpoint**: A004 Definition of Done met — Scrappy Admin Console MVP complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: After Foundational — MVP
- **US2 (Phase 4)**: After Foundational; integrates with US1 company detail Owners tab (independently testable via owner routes + mocks)
- **US3 (Phase 5)**: After Foundational — parallelizable with US2/US4
- **US4 (Phase 6)**: After Foundational; company subscriptions tab integrates with US1
- **US5 (Phase 7)**: After Foundational; richer with US1–US4 seed data for search/activity
- **Polish (Phase 8)**: After desired stories complete (all stories for full MVP)

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|-------|
| US1 Companies | Foundation | MVP; no other stories |
| US2 Owners | Foundation (+ US1 for hub UX) | Standalone owner detail testable alone |
| US3 Administrators | Foundation | Parallel with US2/US4 |
| US4 Subscriptions | Foundation (+ US1 hub) | Parallel with US3 |
| US5 Reports/Activity/Search/Settings/Exports | Foundation | Prefer after US1+ for meaningful search/activity demos |

### Within Each Story

1. Types/API/validation/query keys  
2. Hooks (queries then mutations)  
3. Components/pages  
4. Routes + mock parity  
5. Checkpoint validation  

### Parallel Opportunities

- Phase 1: T002–T008 in parallel  
- Phase 2: T009–T016, T019, T021 in parallel after T017/T018 sequencing as needed  
- After Foundation: US2 / US3 / US4 can proceed in parallel by different agents  
- Within US5: Activity, Search, Reports, Settings, Exports streams largely parallel (T081–T103)

---

## Parallel Example: User Story 1

```bash
# Parallel after T022 API baseline:
Task: "Add company Zod schemas in src/features/companies/validation/company-schema.ts"
Task: "Add companies list query-key helpers in src/features/companies/lib/query-keys.ts"
Task: "Build company create form page in src/features/companies/pages/company-create-page.tsx"
Task: "Build company timeline panel in src/features/companies/components/company-timeline-panel.tsx"
```

---

## Parallel Example: User Story 5

```bash
# Parallel streams:
Task: "Align activity API in src/features/activity/api/activity-api.ts"
Task: "Align search API in src/features/search/api/search-api.ts"
Task: "Align reports API in src/features/reports/api/reports-api.ts"
Task: "Align settings API in src/features/settings/api/settings-api.ts"
Task: "Implement exports API in src/features/exports/api/exports-api.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: US1 Companies  
4. **STOP and VALIDATE** per US1 independent test  
5. Demo company lifecycle before continuing  

### Incremental Delivery (full MVP)

1. Setup + Foundational  
2. US1 Companies → validate  
3. US2 Owners → validate  
4. US3 Administrators → validate (or parallel with US2)  
5. US4 Subscriptions → validate  
6. US5 Activity/Search/Reports/Settings/Exports → validate  
7. Polish → quickstart → MVP complete  

### Parallel Team Strategy

- After Foundation: Dev A = US1→US2, Dev B = US3, Dev C = US4, then converge on US5 + Polish  

---

## Notes

- [P] = different files, no incomplete dependencies  
- No test tasks (not requested)  
- Prefer evolving existing A001 stubs over greenfield duplicates  
- Never display credentials on password reset  
- Activity is immutable — no write UI  
- Customer operational workflows remain Non-Goals  
- Commit after each task or logical group  
- Stop at any checkpoint to validate independently  
