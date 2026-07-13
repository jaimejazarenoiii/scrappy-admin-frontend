# Quickstart Validation Guide: A004 Platform Management

**Date**: 2026-07-13  
**Purpose**: Validate A004 frontend Platform Management against Scrappy API or contract-faithful mock. No implementation code.

## Prerequisites

- A001–A003 Admin Console runnable; Super Admin session
- Env API base URL or mock implementing PM-* contracts
- Artifacts: [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

## Setup

1. Sign in as Super Admin (`super@scrappy.io` / mock credentials if applicable).
2. Confirm dashboard loads (A003).
3. Confirm sidebar/header exposes Companies, Subscriptions, Administrators, Reports, Activity, Settings, Exports, Search.

## Scenarios

### V1 — Companies (US1 / AC-001)

1. Create a company with valid data → lands on detail; appears in list/search.
2. Add an internal note; confirm notes list updates.
3. View statistics and timeline (read-only monitoring).
4. Deactivate → Activate with confirmation; statuses update.
5. Confirm activity log shows corresponding admin actions.

### V2 — Owners & password reset (US2 / AC-002)

1. From company, create owner → open detail.
2. Lock → Unlock with confirmation.
3. Reset password → success without any credential display.
4. Open login history and activity summary.

### V3 — Administrators (US3 / AC-003)

1. Create administrator with Super Admin role.
2. Update profile/roles; lock then unlock.
3. Reset admin password (no secrets shown).
4. Attempt to deactivate/lock the sole remaining Active Super Admin → blocked with clear error (mock/API).

### V4 — Subscriptions (US4 / AC-004)

1. Create subscription for a company.
2. Renew / Suspend / Expire via confirmations; invalid actions disabled or rejected.
3. Add subscription note; view history on company and subscription detail.

### V5 — Reports, activity, search (US5 / AC-005–007)

1. Run each major report type with valid filters → informational results only.
2. Browse activity; confirm no edit/delete controls; prior mutations visible.
3. Global search finds company/owner/admin/subscription; open hit under 3s typical; deep-link works.

### V6 — Settings & exports (US5 / AC-008–009)

1. Change a general setting → reload settings → value persists.
2. Request export (companies or activity) → job reaches ready → download reference works.
3. Oversized/invalid export scope rejected with validation message.

### V7 — Security & non-goals (AC-010–011)

1. Logged-out request to management routes → login redirect.
2. Sweep UI: zero customer operational workflow entry points (no trip/expense/inventory ops).

## Pass criteria

- [ ] Milestones M0–M7 completion criteria met for frontend scope
- [ ] AC-001–AC-012 verified where frontend-observable
- [ ] SC-001–SC-006 checked
- [ ] Constitution gates remain PASS
- [ ] PM-* contracts honored (live or mock)
- [ ] `npm run build` succeeds
- [ ] MVP Admin Console Definition of Done in plan.md satisfied

## References

- [spec.md](./spec.md)
- [plan.md](./plan.md)
- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/rest-platform-management.md](./contracts/rest-platform-management.md)
- [contracts/ui-platform-management.md](./contracts/ui-platform-management.md)
