# Implementation Plan: A002 — Administrator Authentication & Authorization

**Branch**: `002-admin-auth-authorization` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-admin-auth-authorization/spec.md`

**Note**: Planning only. No application code or source file trees are generated here.

## Summary

Evolve the A001 Admin Console frontend authentication surface to fully satisfy A002: JWT access + refresh lifecycle, Super Admin–only authorization for MVP, public auth pages (login, forgot/reset password), authenticated change-password, session validation on startup, automatic token refresh, secure logout/expiry handling, and Super Admin login-history consumption—all against the existing Scrappy REST API contracts AUTH-01–AUTH-07.

Build on A001 shared Axios/Query/Zustand shell; replace mock-first shortcuts with production-aligned auth flows while preserving Apple-like UX (accessible forms, clear errors, motion-safe loading).

## Technical Context

**Language/Version**: TypeScript (strict) on React 19

**Primary Dependencies**: Vite, Tailwind CSS v4, shadcn/ui, React Router v7, Zustand, TanStack Query, React Hook Form, Zod, Axios, Framer Motion, Lucide React

**Storage**: Client session shell only (access/refresh token handling strategy per research.md). No domain entity caches in Zustand. Server auth/history via TanStack Query where reads apply.

**Testing**: Recommend component tests for forms/guards; flow tests for login→protect→logout; route-guard tests; Zod validation tests. Do not generate tests in this plan.

**Target Platform**: Modern browsers; desktop-first Admin Console; responsive auth screens

**Project Type**: Frontend SPA consuming Scrappy REST API

**Performance Goals**: Sign-in to authenticated console under 5 seconds (SC-001/AC-001); refresh without full-page disruption; startup session validation with loading gate

**Constraints**: JWT access + refresh; Super Admin only for A002 acceptance; no customer auth; tokens/passwords never rendered; constitution Non-Goals; API contracts AUTH-01–AUTH-07

**Scale/Scope**: Internal administrators (low concurrent user count); auth pages + guards + password flows + login history view

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Pre-research | Post-design |
|------|--------------|-------------|
| Platform administration only | PASS — auth for admin console only | PASS — no customer-app workflows |
| Internal use only | PASS — Super Admin MVP; customers denied | PASS — role gate Super Admin |
| Read-first | PASS — writes limited to auth/password/session | PASS — login history is read |
| Non-goals | PASS — MFA/SSO/etc. deferred | PASS — future section only |
| Separation of responsibilities | PASS — consumes Scrappy REST | PASS — contracts map AUTH-* |
| Auditability | PASS — login/password events server-audited; UI surfaces history | PASS — AUTH-07 integration planned |
| Security | PASS — JWT, lockout messaging, no credential display | PASS — token/session rules in research |
| Search / dashboard / consistency | PASS — auth UX consistent with A001 shell | PASS — shared form/toast patterns |
| Scalability & extensibility | PASS — role model extensible beyond Super Admin | PASS — RBAC helpers remain role-map ready |
| UX & technology principles | PASS — stack locked; a11y forms | PASS — phases cover polish |

**Gate result**: PASS. Complexity Tracking not required.

## Architecture Decisions (no source tree)

### Relationship to A001

A001 delivered a console shell with provisional auth/mock login. A002 is the authoritative authentication & authorization product slice: align client calls to AUTH-01–AUTH-07, add missing public password flows, harden session lifecycle, and enforce Super Admin–only console entry for MVP acceptance.

### Authentication lifecycle (frontend)

1. **Startup**: Hydrate session shell → if tokens present, validate session (AUTH-03) → allow shell or clear and send to login.
2. **Login**: Submit email/password (+ optional Remember Me) → store session proof → navigate to dashboard.
3. **Authenticated navigation**: Axios attaches access token; 401 triggers single-flight refresh; failure clears session → login.
4. **Logout**: Call AUTH-02 → clear client session → reset UI shell state (e.g., sidebar) → login.
5. **Expiry**: Detect expired/invalid session → session-expired dialog or redirect → re-auth.
6. **Unauthorized**: Authenticated but non–Super Admin → unauthorized experience.

### Pages

| Page | Access | Purpose |
|------|--------|---------|
| Login | Public | Sign-in + Remember Me + link to forgot password |
| Forgot Password | Public | Request reset (generic success) |
| Reset Password | Public | Complete reset with reset proof + new password |
| Change Password | Protected (Super Admin) | Current + new password |
| Unauthorized | Authenticated or system | Role denial |
| Login History (view) | Protected (Super Admin) | Consume AUTH-07 for security review |

### Components (logical, not paths)

Authentication layout · Login form · Password input (show/hide, a11y) · Forgot password form · Reset password form · Change password form · Auth guards (RequireAuth, RequireRole) · Startup/session loading screen · Unauthorized state · Session expired dialog

### Routing

- **Public**: login, forgot password, reset password (with reset proof param/query as API dictates)
- **Protected**: all console modules; change password; login history
- **Guards**: RequireAuth → RequireRole(Super Admin) for A002 MVP console
- **Redirects**: authenticated users hitting login → dashboard; unauthenticated hitting protected → login with return URL; role fail → unauthorized

### Zustand vs TanStack Query

| Zustand (client shell) | TanStack Query (server) |
|------------------------|-------------------------|
| Auth status (hydrated, authenticated) | Login history list |
| Current administrator profile snapshot post-login/validate | Optional session revalidation if modeled as query |
| Access/refresh token handles (never logged/rendered) | — |
| Derived permissions / role flags for guards | — |
| Coordinate sidebar reset on logout | — |

Never store login history lists or password reset server payloads long-term in Zustand.

### API integration states

For each AUTH operation: loading (disable submit, button spinner), success (toast + navigate or confirm), error (map 400/401/403/429 to human messages), retry only for idempotent reads (session validate, login history)—not for login/password mutations without user intent.

### Client validation (Zod + RHF)

Email format · password required · confirm password match on reset/change · reset proof required · password policy hints (min length/complexity as published by API or documented defaults) · required fields

### Error UX mapping

| Condition | Frontend behavior |
|-----------|-------------------|
| Invalid credentials | Generic failure; no email enumeration |
| Locked / Inactive | Explicit policy-safe messaging (403) |
| Expired session | Dialog + redirect to login |
| Unauthorized role | Unauthorized page |
| Network / 5xx | Toast + retry affordance where safe |
| Expired reset proof | Inline error; link back to forgot password |

### Security (frontend responsibilities)

- Store tokens per research decision; never surface in UI/DOM text
- Clear all auth state on logout/refresh failure/reset completion
- Automatic logout on unrecoverable 401
- Role checks in guards (defense in depth; API remains authority)
- Protect sensitive routes; block back-navigation into authenticated shell after logout via session gate
- Prefer memory for access token when feasible; refresh handling must not race

### UX

Responsive auth screens · loading indicators · skeleton for login history · toasts · accessible labeled forms · clear validation · professional unauthorized/expired states · Framer Motion consistent with A001, reduced-motion safe

### Testing recommendations (no tests generated)

- Component: forms, password field, guards
- Flow: login → protected → logout; refresh failure → login
- Route protection: deep-link without session
- Validation: Zod schemas for email/password/confirm/reset proof

## Implementation Phases

### Phase 1 — Authentication Foundation

**Objectives**: Align auth client contracts with AUTH-01–AUTH-07; typed errors; token attach + refresh queue; session hydrate helpers; auth layout shell for public pages.

**Dependencies**: A001 console foundation available.

**Deliverables**: Auth API client surface for all AUTH endpoints; shared auth error mapper; session hydrate/clear utilities; authentication layout experience.

**Completion criteria**: Client can call sign-in/session/refresh/sign-out against API (or mock parity); tokens never rendered; constitution gates still PASS.

---

### Phase 2 — Login

**Objectives**: Production login page with Remember Me, validation, loading/error states, post-login navigation.

**Dependencies**: Phase 1.

**Deliverables**: Login page + form; success path to dashboard; locked/inactive/invalid credential messaging.

**Completion criteria**: Active Super Admin signs in under normal conditions within AC-001 timing target; denied statuses handled per FR/AC.

---

### Phase 3 — Protected Routes & Authorization

**Objectives**: Enforce RequireAuth + Super Admin RequireRole across console; public/authenticated redirects; unauthorized page.

**Dependencies**: Phase 2 (session available).

**Deliverables**: Guarded router behavior; unauthorized experience; authenticated redirect away from public auth pages.

**Completion criteria**: AC-003 and role gate scenarios pass; non–Super Admin cannot enter console modules under A002 rules.

---

### Phase 4 — Session Management

**Objectives**: Startup validation, automatic refresh, logout, session expiry detection, session-expired dialog, persistence rules, sidebar reset on logout.

**Dependencies**: Phases 1–3.

**Deliverables**: Startup loading gate; refresh single-flight; logout clears client+server session; expiry UX.

**Completion criteria**: AC-004/AC-005 behaviors demonstrable; no access with cleared/expired session.

---

### Phase 5 — Password Management

**Objectives**: Forgot password, reset password (public), change password (protected).

**Dependencies**: Phase 1; change-password needs Phases 2–3.

**Deliverables**: Three password flows with Zod validation, toasts, generic forgot acknowledgment, reset-proof errors, post-reset force re-login.

**Completion criteria**: AC-006/AC-007 satisfied; passwords never displayed; prior session unusable after reset.

---

### Phase 6 — Login History Integration

**Objectives**: Super Admin can review login history via AUTH-07 (filters/pagination as API allows).

**Dependencies**: Phases 3–4.

**Deliverables**: Login history view using shared table patterns; Query-based fetch; empty/error/loading states.

**Completion criteria**: SC-004/AC-008 observable for recorded attempts in retention window.

---

### Phase 7 — Error Handling Hardening

**Objectives**: Unify auth error taxonomy across pages; network/5xx; 429 rate limits; expiry and lock messaging consistency.

**Dependencies**: Phases 2–6.

**Deliverables**: Shared auth error → user message map; session-expired dialog wired globally; retry policy documented for reads.

**Completion criteria**: Edge cases in spec covered in UX; no credential/token leakage in errors.

---

### Phase 8 — Polish

**Objectives**: A11y pass, responsive auth screens, motion polish, security sweep, AC/SC checklist, quickstart validation.

**Dependencies**: Phases 1–7.

**Deliverables**: Polish complete; quickstart executed; known issues listed if any.

**Completion criteria**: AC-001–AC-011 and SC-001–SC-006 checked for frontend scope; constitution post-design PASS.

## Milestones

| Milestone | After | Meaning |
|-----------|-------|---------|
| M1 Auth client ready | Phase 1 | Contracts wired |
| M2 Secure entry | Phases 2–3 | Login + Super Admin gate |
| M3 Session trustworthy | Phase 4 | Refresh/logout/expiry |
| M4 Password self-service | Phase 5 | Forgot/reset/change |
| M5 Audit visibility | Phase 6 | Login history |
| M6 A002 done | Phases 7–8 | Hardened + validated |

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-auth-authorization/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # /speckit-tasks — not created here
```

### Source Code (repository root)

Per product-owner direction: **no concrete source file tree is prescribed**. Implementers MUST place work within the existing A001 feature-based frontend conventions and shared auth/API shell. Concrete paths deferred to `/speckit-tasks`.

**Structure Decision**: Frontend-only changes in the Admin Console SPA; backend remains existing Scrappy REST API.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
