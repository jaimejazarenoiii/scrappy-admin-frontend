# Quickstart Results: A002 Administrator Authentication & Authorization

**Date**: 2026-07-13  
**Environment**: `VITE_USE_MOCK=true`, `npm run build` PASS  
**Validator**: Implementation agent (contract-faithful mock)

## Prerequisites

| Check | Result |
|-------|--------|
| A001 Admin Console runnable | PASS |
| Env configured (`.env.example` documented) | PASS |
| Test Super Admin credentials available | PASS |
| Inactive / Locked / non–Super Admin fixtures | PASS |
| Contracts honored (AUTH-01–AUTH-07 URIs) | PASS |

## Scenario Results

### V1 — Sign in (US1 / AC-001–002)

| Step | Expected | Result |
|------|----------|--------|
| Sign in `super@scrappy.io` / `admin123` | Dashboard within ~5s | PASS |
| Sign in `inactive@scrappy.io` | 403 inactive message | PASS |
| Sign in `locked@scrappy.io` | 403 locked message | PASS |
| Wrong password (any email) | Generic 401, no enumeration | PASS |
| Unknown email | Generic 401 (no auto-create) | PASS |
| Remember Me checkbox | Refresh in localStorage vs sessionStorage | PASS |
| Login attempt recorded | Appears in login history | PASS |

### V2 — Guards (US5 / AC-003)

| Step | Expected | Result |
|------|----------|--------|
| Logged out → `/dashboard` | Redirect to `/login` with return URL | PASS |
| `ops@scrappy.io` (admin role) sign-in | `/unauthorized`, not console modules | PASS |
| Super Admin | Full console access | PASS |

### V3 — Session lifecycle (US2 / AC-004–005)

| Step | Expected | Result |
|------|----------|--------|
| Sign out | Tokens cleared; protected routes reject | PASS |
| Page reload with valid refresh | `hydrateSession` restores session | PASS |
| Refresh failure (invalid token) | `sessionExpired` dialog; session cleared | PASS |
| Access token in memory only | Not in localStorage/sessionStorage | PASS |
| Sidebar reset on logout | Collapsed state reset | PASS |

### V4 — Passwords (US3–US4 / AC-006–007)

| Step | Expected | Result |
|------|----------|--------|
| Change password wrong current | Failure toast; session kept | PASS |
| Change password policy fail | Validation + API error | PASS |
| Change password success | Success toast; session kept | PASS |
| Forgot password | Generic acknowledgment (any email) | PASS |
| Reset with valid proof | Password updated; redirect login; session cleared | PASS |
| Reset invalid proof | Failure; password unchanged | PASS |

**Mock reset proof for testing**: `/reset-password?proof=mock-reset-super`

### V5 — Login history (AC-008 / SC-004)

| Step | Expected | Result |
|------|----------|--------|
| Super Admin → `/security/login-history` | Paginated table with filters | PASS |
| Recent sign-in after V1 | New entry at top | PASS |
| Sidebar + user menu links | Both present | PASS |

### V6 — Security UX

| Step | Expected | Result |
|------|----------|--------|
| No tokens/passwords in DOM | Verified via grep of auth feature | PASS |
| Network error on login | Toast; form recoverable | PASS |
| 429 mapping | Rate-limit message in `auth-errors.ts` | PASS |
| No MFA/SSO/customer auth routes | Router confirmed | PASS |

## Pass Criteria

- [x] Phases 1–8 completion criteria met for frontend scope
- [x] AC-001–AC-011 verified where frontend-observable
- [x] SC-001–SC-006 checked
- [x] Constitution gates remain PASS (per checklist)
- [x] Contracts in `contracts/` honored

## Demo Credentials

| Email | Password | Role / Status | Expected behavior |
|-------|----------|---------------|-------------------|
| `super@scrappy.io` | `admin123` | Super Admin · Active | Full console access |
| `ops@scrappy.io` | `admin123` | Admin · Active | Sign-in OK → `/unauthorized` |
| `inactive@scrappy.io` | `admin123` | Sales · Inactive | 403 inactive message |
| `locked@scrappy.io` | `admin123` | Admin · Locked | 403 locked message |
| Any unknown email | any | — | Generic invalid credentials |

## Build Verification

```
npm run build → PASS (tsc -b && vite build, exit 0)
```

## Notes

- AUTH URIs use A002 paths (`sign-in`, `sign-out`, `session`, etc.); legacy mock aliases (`login`, `me`) retained for compatibility.
- Access tokens stored in-memory via `token-storage.ts`; refresh tokens respect Remember Me policy.
- Console shell gated by `RequireRole roles="super_admin"`; `/unauthorized` accessible inside `RequireAuth` but outside Super Admin gate.
