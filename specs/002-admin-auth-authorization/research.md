# Research: A002 — Administrator Authentication & Authorization

**Date**: 2026-07-13  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All Technical Context decisions for frontend planning are resolved below.

---

## R1. Token model

**Decision**: Use JWT **access token** + **refresh token** as provided by Scrappy AUTH sign-in/refresh responses. Access token on Authorization Bearer header; refresh via dedicated refresh exchange when access expires (401).

**Rationale**: Matches approved tech stack and A001 interceptor direction; standard SPA pattern with Scrappy REST.

**Alternatives considered**:
- Cookie-only session — adopt only if API mandates httpOnly cookies; client adapters can swap without redesigning flows.
- Long-lived access token alone — weaker security; rejected.

---

## R2. Token storage

**Decision**: Prefer **access token in memory** + **refresh token in httpOnly cookie** when API supports it. If API returns refresh in body only, store refresh in `sessionStorage` by default, or `localStorage` only when Remember Me is selected (document threat model). Never write tokens into DOM, logs, or analytics.

**Rationale**: Balances XSS exposure vs UX persistence; Remember Me maps to longer-lived refresh persistence per policy.

**Alternatives considered**:
- Always localStorage — simpler but higher XSS risk.
- Always memory-only — best security, poor refresh/reload UX for admin tool.

---

## R3. URI alignment with A002 contracts

**Decision**: Client auth module targets AUTH-01–AUTH-07 URIs from the spec (`/admin/auth/sign-in`, `sign-out`, `session`, `change-password`, `password-reset/request`, `password-reset/complete`, `login-history`). Map any A001 provisional paths (`/admin/auth/login`, `/me`, etc.) to these contracts during A002.

**Rationale**: Spec is source of truth for product interface.

**Alternatives considered**: Keep A001 path aliases forever — creates drift; rejected for A002 acceptance.

---

## R4. MVP authorization

**Decision**: Frontend RequireRole allows **Super Admin only** for console entry under A002. Keep role maps extensible for future Admin/Support/Finance/Sales/Read Only without redesign.

**Rationale**: Spec FR-004/FR-017; constitution Principle II extensibility preserved.

**Alternatives considered**: Ship all future roles now — out of A002 scope.

---

## R5. Session validation timing

**Decision**: On app startup, if credentials present, call AUTH-03 before rendering protected shell. Show loading gate. On failure, clear client auth and route to login. Optionally revalidate on window focus with throttle.

**Rationale**: Prevents flash of authenticated UI with dead sessions (AC-005).

**Alternatives considered**: Trust stored tokens until first 401 — faster paint, weaker correctness.

---

## R6. Refresh concurrency

**Decision**: Single-flight refresh queue: concurrent 401s wait on one refresh; on success retry originals; on failure logout all.

**Rationale**: Prevents refresh stampedes; already intended in A001 interceptors.

**Alternatives considered**: Per-request refresh — race-prone.

---

## R7. Password policy on client

**Decision**: Enforce baseline Zod rules (email format, min length, confirm match). Surface server policy errors (400) as field/form messages when API returns structured details; otherwise generic policy guidance.

**Rationale**: Fast UX feedback without duplicating authoritative server policy.

**Alternatives considered**: Mirror full server policy config fetch — nice-to-have later.

---

## R8. Forgot-password enumeration

**Decision**: Always show the same generic success acknowledgment after AUTH-05 regardless of whether email exists/Active.

**Rationale**: Spec AUTH-05 and security best practice.

**Alternatives considered**: Distinct messages — rejected (enumeration).

---

## R9. Post-reset / change-password session posture

**Decision**: After successful AUTH-06 reset, clear any local session and require login. After AUTH-04 change-password, keep session unless API indicates re-auth required; if API invalidates sessions, mirror by clearing client and re-login.

**Rationale**: Aligns with “prior sessions invalidated” on reset; change-password follows API semantics.

**Alternatives considered**: Always force re-login on change — acceptable stricter variant if product prefers.

---

## R10. Login history

**Decision**: Read-only TanStack Query list against AUTH-07; Super Admin only; use shared table kit from A001.

**Rationale**: SC-004; keeps server state out of Zustand.

**Alternatives considered**: Embed history only in activity log module — still fine if routed as auth security page; Query remains correct.

---

## R11. Mock vs live API

**Decision**: During development, mock handlers MAY emulate AUTH-01–AUTH-07 including locked/inactive/429 cases. Production builds target live Scrappy API via env base URL. Feature acceptance against live or contract-faithful mock.

**Rationale**: Unblocks frontend while backend hardens; contracts stay identical.
