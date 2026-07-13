# Quickstart Validation Guide: A001 Foundation

**Date**: 2026-07-13  
**Purpose**: Runnable validation scenarios after implementation. No implementation code here.

## Prerequisites

- Node.js LTS installed
- Access to Scrappy Admin API base URL (or local mock conforming to [contracts/rest-api.md](./contracts/rest-api.md))
- Internal test administrator credentials for at least two roles (e.g., Admin + Read Only Analyst)
- Feature artifacts: [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

## Setup (implementers)

1. Configure env with API base URL (and any auth mode flags).
2. Install dependencies and start the Vite dev server.
3. Confirm app loads the login route when logged out.

## Validation scenarios

### V1 — Auth & guards

1. Log in with valid Admin credentials → expect dashboard.
2. Confirm protected URL redirects to login when logged out.
3. Force access-token expiry (or wait) → expect silent refresh on next API call.
4. Invalidate refresh → expect return to login.
5. Log in as Read Only Analyst → open a mutating action → expect unauthorized or disabled control.

**Expected**: SC-004 behaviors; no tokens/passwords visible in DOM.

### V2 — Dashboard health

1. After login, land on dashboard.
2. Confirm widgets for summary, subscriptions, growth, recent activity/companies load independently.
3. Kill one metrics endpoint (proxy/mock) → expect that widget error/retry only; others remain.

**Expected**: Dashboard-first constitution questions answerable; SC-001 timing on typical network.

### V3 — Companies lifecycle

1. Search/filter companies; paginate/sort.
2. Open detail: statistics, notes, owners.
3. Add note; activate/deactivate with confirmation.
4. Open activity log → expect corresponding audit entries.

**Expected**: Consistent list→detail patterns; SC-003 audit coverage; no operational workflow screens.

### V4 — Subscriptions

1. Filter expiring soon.
2. Perform renew or suspend (role permitting).
3. Verify status + audit.

### V5 — Search & support

1. Global search for company and user.
2. Password reset / unlock → confirm success toast and **no credential display**.
3. Verify audit events.

### V6 — Analytics / reports / settings

1. Open analytics and a report → aggregates only.
2. Change a setting as Super Admin → audited.
3. Confirm Non-Goals screens do not exist in nav.

### V7 — Resilience UX

1. Trigger API 500 on a list page → toast + retry + empty/error state.
2. Navigate to unknown route → 404.
3. Toggle theme (if enabled) → tokens switch without layout break.

## Pass criteria

- [ ] Phases 1–9 completion criteria in plan.md satisfied for MVP scope
- [ ] Success criteria SC-001–SC-006 checked
- [ ] Constitution gates still PASS
- [ ] Contracts honored (REST + UI kits + routing)

## References

- Domain: [data-model.md](./data-model.md)
- API: [contracts/rest-api.md](./contracts/rest-api.md)
- UI kits: [contracts/ui-kits.md](./contracts/ui-kits.md)
- Routing: [contracts/routing.md](./contracts/routing.md)
- Research: [research.md](./research.md)
