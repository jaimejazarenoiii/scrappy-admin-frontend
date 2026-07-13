# Quickstart Validation Guide: A002 Auth

**Date**: 2026-07-13  
**Purpose**: Validate A002 frontend auth against Scrappy API or contract-faithful mock. No implementation code.

## Prerequisites

- A001 Admin Console app runnable
- Env configured with API base URL (or mock emulating AUTH-01–AUTH-07)
- Test Super Admin (Active) credentials
- Optional: Inactive, Locked, and non–Super Admin fixtures for negative tests
- Artifacts: [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

## Setup

1. Start the Admin Console frontend.
2. Confirm unauthenticated visit to a protected URL redirects to login.
3. Confirm auth pages render (login, forgot, reset).

## Scenarios

### V1 — Sign in (US1 / AC-001–002)

1. Sign in as Active Super Admin → expect dashboard within ~5s.
2. Sign in as Inactive → denied with clear status messaging.
3. Sign in as Locked → denied.
4. Wrong password → generic failure; no email enumeration.

### V2 — Guards (US5 / AC-003)

1. Logged out, open `/dashboard` (or any protected path) → login redirect.
2. If non–Super Admin session available → unauthorized, not console modules.

### V3 — Session lifecycle (US2 / AC-004–005)

1. Sign out → protected routes reject; tokens cleared from client.
2. Force access-token expiry → silent refresh keeps session OR failure returns to login.
3. Invalidate refresh → session-expired or login; no continued API success.
4. Optional: Remember Me extends persistence per policy.

### V4 — Passwords (US3–US4 / AC-006–007)

1. Change password with wrong current → failure; old password still works.
2. Change password success → new password required thereafter (per API session rules).
3. Forgot password → generic acknowledgment.
4. Reset with valid proof → success; must sign in again; old session unusable.
5. Reset with expired/invalid proof → failure; password unchanged.

### V5 — Login history (AC-008 / SC-004)

1. As Super Admin, open login history → see attempts with timestamps/results.
2. Confirm recent sign-in appears after V1.

### V6 — Security UX

1. Inspect UI: no tokens/passwords visible in markup.
2. Network error during login → toast; form recoverable.
3. 429 on login/forgot → rate-limit messaging.

## Pass criteria

- [ ] Phases 1–8 completion criteria in plan.md met for frontend scope
- [ ] AC-001–AC-011 verified where frontend-observable
- [ ] SC-001–SC-006 checked
- [ ] Constitution gates remain PASS
- [ ] Contracts in `contracts/` honored

## References

- Spec: [spec.md](./spec.md)
- Research: [research.md](./research.md)
- REST: [contracts/rest-auth.md](./contracts/rest-auth.md)
- UI/Routing: [contracts/ui-routing.md](./contracts/ui-routing.md)
