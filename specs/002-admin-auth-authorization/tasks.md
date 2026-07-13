---
description: "Task list for A002 Administrator Authentication & Authorization"
---

# Tasks: A002 — Administrator Authentication & Authorization

**Input**: Design documents from `/specs/002-admin-auth-authorization/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story (priority order: US1 → US2 → US5 → US3 → US4). Builds on A001 auth shell under `src/features/auth/` and `src/shared/`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelizable (different files, no incomplete dependencies)
- **[Story]**: [US1]–[US5] maps to spec.md user stories
- Paths assume existing Vite React SPA feature layout

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align A002 docs/env and auth feature scaffolding for AUTH-01–AUTH-07

- [x] T001 Document A002 auth env expectations (API base URL, mock flag, Remember Me storage notes) in `.env.example`
- [x] T002 [P] Extend administrator auth domain types for A002 (status, fullName, session metadata) in `src/features/auth/types.ts`
- [x] T003 [P] Add login-history and password-flow types in `src/features/auth/types.ts`
- [x] T004 Ensure Super Admin role constant and console-entry helper exist in `src/shared/lib/rbac.ts`

**Checkpoint**: Types/RBAC ready for foundational API work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Auth client, errors, token storage, auth layout — MUST complete before user stories

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T005 Align auth API module to AUTH-01–AUTH-07 URIs in `src/features/auth/api/auth-api.ts`
- [x] T006 [P] Implement token refresh client call in `src/features/auth/api/auth-api.ts`
- [x] T007 [P] Map auth HTTP errors (401/403 inactive-locked/429) to user-safe messages in `src/features/auth/lib/auth-errors.ts`
- [x] T008 Implement token storage helpers (memory access; refresh persistence + Remember Me) in `src/features/auth/lib/token-storage.ts`
- [x] T009 Evolve auth Zustand store for hydrate/authenticated/administrator/rememberMe in `src/features/auth/store/auth-store.ts`
- [x] T010 Wire Axios bearer attach + single-flight refresh using A002 store/storage in `src/shared/api/interceptors.ts`
- [x] T011 [P] Create authentication layout wrapper for public auth pages in `src/features/auth/components/auth-layout.tsx`
- [x] T012 [P] Create accessible password input (show/hide) in `src/features/auth/components/password-input.tsx`
- [x] T013 [P] Create auth startup loading screen in `src/features/auth/components/auth-loading-screen.tsx`
- [x] T014 Update mock handlers for AUTH-01–AUTH-07 parity (sign-in, session, reset, history, locked/inactive) in `src/shared/mocks/handlers.ts`
- [x] T015 [P] Update mock seed administrators (Active Super Admin, Inactive, Locked) in `src/shared/mocks/data.ts`

**Checkpoint**: Foundation ready — user stories can proceed

---

## Phase 3: User Story 1 — Sign in as Super Admin (Priority: P1) 🎯 MVP

**Goal**: Active Super Admin signs in with email/password (+ optional Remember Me) and reaches the Admin Console; Inactive/Locked/invalid credentials denied without email enumeration

**Independent Test**: Active Super Admin → dashboard; Inactive/Locked/wrong password → denied with correct messaging; attempt recorded server-side

### Implementation for User Story 1

- [x] T016 [P] [US1] Update login Zod schema (email, password, rememberMe) in `src/features/auth/validation/login-schema.ts`
- [x] T017 [US1] Implement sign-in action using AUTH-01 and token storage in `src/features/auth/store/auth-store.ts`
- [x] T018 [US1] Build login form component with loading/error states in `src/features/auth/components/login-form.tsx`
- [x] T019 [US1] Redesign login page on auth layout with Remember Me and forgot-password link in `src/features/auth/pages/login-page.tsx`
- [x] T020 [US1] Register/confirm public `/login` route and post-login redirect to dashboard in `src/app/router.tsx`
- [x] T021 [US1] Map inactive/locked/invalid credential errors to UI via `src/features/auth/lib/auth-errors.ts` on login page

**Checkpoint**: US1 independently usable (sign-in MVP)

---

## Phase 4: User Story 2 — Maintain and end sessions (Priority: P1)

**Goal**: Valid sessions allow access; expiry/invalidation deny access; logout clears session; Remember Me persistence respected; startup validates session

**Independent Test**: Sign in → use protected resource → logout or expire → access denied; reload with valid refresh still authenticated per policy

### Implementation for User Story 2

- [x] T022 [US2] Implement AUTH-03 session validate + clear-on-failure in `src/features/auth/store/auth-store.ts`
- [x] T023 [US2] Implement startup hydrate gate using auth loading screen in `src/app/app.tsx`
- [x] T024 [US2] Implement AUTH-02 logout, clear tokens, and reset sidebar state in `src/features/auth/store/auth-store.ts` and `src/shared/stores/sidebar-store.ts`
- [x] T025 [US2] Ensure logout button/user menu calls A002 logout flow in `src/features/auth/components/logout-button.tsx`
- [x] T026 [P] [US2] Create session-expired dialog component in `src/features/auth/components/session-expired-dialog.tsx`
- [x] T027 [US2] Trigger session-expired dialog / redirect on unrecoverable refresh failure in `src/shared/api/interceptors.ts`
- [x] T028 [US2] Confirm authenticated API traffic uses refreshed access tokens without full reload in `src/shared/api/interceptors.ts`

**Checkpoint**: US1 + US2 session lifecycle solid

---

## Phase 5: User Story 5 — Role-based authorization gate (Priority: P1)

**Goal**: Unauthenticated callers denied; only Active Super Admin sessions enter console modules; others see unauthorized

**Independent Test**: No session → login redirect; Super Admin → allowed; non–Super Admin session → unauthorized

### Implementation for User Story 5

- [x] T029 [US5] Enforce RequireAuth redirect-to-login with return URL in `src/shared/routing/require-auth.tsx`
- [x] T030 [US5] Enforce RequireRole Super Admin for console shell routes in `src/shared/routing/require-role.tsx`
- [x] T031 [US5] Wrap authenticated app shell routes with Super Admin gate in `src/app/router.tsx`
- [x] T032 [P] [US5] Polish unauthorized page messaging for missing Super Admin role in `src/shared/pages/unauthorized-page.tsx`
- [x] T033 [US5] Redirect authenticated Super Admin away from `/login` to dashboard in `src/features/auth/pages/login-page.tsx`
- [x] T034 [US5] Deny console entry when session profile role is not Super Admin after AUTH-03 in `src/features/auth/store/auth-store.ts`

**Checkpoint**: US1/US2/US5 secure entry complete (recommended MVP+)

---

## Phase 6: User Story 3 — Change password while signed in (Priority: P2)

**Goal**: Authenticated Super Admin changes password with current + policy-compliant new password; failures leave prior password unchanged; no secrets rendered

**Independent Test**: Wrong current → fail; policy fail → fail; success → new password required for next sign-in (per API)

### Implementation for User Story 3

- [x] T035 [P] [US3] Add change-password Zod schema (current, new, confirm) in `src/features/auth/validation/change-password-schema.ts`
- [x] T036 [P] [US3] Add AUTH-04 change-password API function in `src/features/auth/api/auth-api.ts`
- [x] T037 [US3] Build change-password form component in `src/features/auth/components/change-password-form.tsx`
- [x] T038 [US3] Create change-password page under auth layout/shell in `src/features/auth/pages/change-password-page.tsx`
- [x] T039 [US3] Register protected `/account/change-password` (or `/settings/password`) route with Super Admin guard in `src/app/router.tsx`
- [x] T040 [US3] Add navigation entry to change password from user menu in `src/features/auth/components/user-menu.tsx`
- [x] T041 [US3] Handle post-change session posture (keep or clear per API) in `src/features/auth/store/auth-store.ts`

**Checkpoint**: US3 independently testable with authenticated Super Admin

---

## Phase 7: User Story 4 — Forgot and reset password (Priority: P2)

**Goal**: Request reset with generic acknowledgment; complete reset with valid proof; invalid/expired proof fails; sessions cleared after success

**Independent Test**: Request → generic success; valid proof → password updated + must login; invalid proof → no change

### Implementation for User Story 4

- [x] T042 [P] [US4] Add forgot-password Zod schema in `src/features/auth/validation/forgot-password-schema.ts`
- [x] T043 [P] [US4] Add reset-password Zod schema (resetProof, new, confirm) in `src/features/auth/validation/reset-password-schema.ts`
- [x] T044 [P] [US4] Add AUTH-05/AUTH-06 API functions in `src/features/auth/api/auth-api.ts`
- [x] T045 [US4] Build forgot-password form in `src/features/auth/components/forgot-password-form.tsx`
- [x] T046 [US4] Build reset-password form in `src/features/auth/components/reset-password-form.tsx`
- [x] T047 [US4] Create forgot-password page with generic success UX in `src/features/auth/pages/forgot-password-page.tsx`
- [x] T048 [US4] Create reset-password page reading reset proof from route/query in `src/features/auth/pages/reset-password-page.tsx`
- [x] T049 [US4] Register public `/forgot-password` and `/reset-password` routes in `src/app/router.tsx`
- [x] T050 [US4] After successful reset, clear any local session and route to login in `src/features/auth/pages/reset-password-page.tsx`

**Checkpoint**: All user stories independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Login history (AUTH-07), error hardening, security/UX polish, quickstart validation

- [x] T051 [P] Implement AUTH-07 login-history API in `src/features/auth/api/auth-api.ts`
- [x] T052 [P] Add login-history query hook in `src/features/auth/hooks/use-login-history.ts`
- [x] T053 Build login-history page with shared data table filters/pagination in `src/features/auth/pages/login-history-page.tsx`
- [x] T054 Register protected `/security/login-history` Super Admin route and sidebar/nav link in `src/app/router.tsx` and `src/shared/layout/sidebar.tsx`
- [x] T055 Unify auth toast/error handling across auth pages using `src/features/auth/lib/auth-errors.ts`
- [x] T056 Accessibility pass on auth forms/layout (labels, focus, keyboard) in `src/features/auth/components/`
- [x] T057 Verify tokens/passwords never rendered in auth UI under `src/features/auth/`
- [x] T058 Confirm Non-Goals unchanged (no MFA/SSO/customer auth routes) in `src/app/router.tsx`
- [x] T059 Run quickstart scenarios from `specs/002-admin-auth-authorization/quickstart.md` and record results in `specs/002-admin-auth-authorization/quickstart-results.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all stories
- **US1 (Phase 3)**: Depends on Foundational — MVP sign-in
- **US2 (Phase 4)**: Depends on Foundational; needs US1 for integrated demo
- **US5 (Phase 5)**: Depends on Foundational; needs US1 session for integrated demo
- **US3 (Phase 6)**: Depends on US1 + US5 (authenticated Super Admin)
- **US4 (Phase 7)**: Depends on Foundational; independent of US3
- **Polish (Phase 8)**: Depends on completed target stories

### User Story Dependencies

- **US1 (P1)**: After Foundational — no story dependencies
- **US2 (P1)**: After Foundational — integrates with US1 login/logout
- **US5 (P1)**: After Foundational — integrates with US1 session profile
- **US3 (P2)**: After US1 + US5
- **US4 (P2)**: After Foundational — parallelizable with US3

### Parallel Opportunities

- Phase 1: T002–T004 in parallel after T001
- Phase 2: error mapper, token storage, layout, password input, mocks marked [P]
- After Foundational: US4 can proceed in parallel with US3 once US1/US5 done for US3
- Polish: T051–T052 parallel

---

## Parallel Example: User Story 1

```bash
Task: "Update login Zod schema in src/features/auth/validation/login-schema.ts"
# Then sequential store → form → page → router
```

## Parallel Example: User Story 4

```bash
Task: "Add forgot-password Zod schema in src/features/auth/validation/forgot-password-schema.ts"
Task: "Add reset-password Zod schema in src/features/auth/validation/reset-password-schema.ts"
Task: "Add AUTH-05/AUTH-06 API functions in src/features/auth/api/auth-api.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1–2
2. Complete Phase 3 (US1 login)
3. **STOP and VALIDATE** US1 independent test
4. Demo Active Super Admin sign-in

### Recommended secure MVP+ (US1 + US2 + US5)

1. Add session lifecycle (US2) and Super Admin gate (US5)
2. Validate AC-003–AC-005 before password stories

### Incremental Delivery

1. US1 → sign-in
2. US2 → session trust
3. US5 → authorization gate
4. US3 → change password
5. US4 → forgot/reset
6. Polish → login history + a11y/security sweep

---

## Notes

- [P] = different files, no incomplete dependencies
- [USn] required on story-phase tasks only
- No test tasks (not requested)
- Prefer TanStack Query for login history; Zustand for session shell only
- Never render tokens or passwords
- Commit after each task or logical group
