# Quickstart Validation Guide: A003 Dashboard & Analytics

**Date**: 2026-07-13  
**Purpose**: Validate A003 frontend dashboard against Scrappy API or contract-faithful mock. No implementation code.

## Prerequisites

- A001/A002 Admin Console runnable; Super Admin session
- Env API base URL or mock implementing DASH-01–DASH-08
- Artifacts: [plan.md](./plan.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

## Setup

1. Sign in as Super Admin.
2. Confirm redirect/landing on `/dashboard`.
3. Confirm filter bar and section regions render.

## Scenarios

### V1 — Landing overview (US1 / AC-001–002)

1. Land on dashboard under ~5s with overview metrics visible.
2. Confirm company status tallies and new-today/month metrics.

### V2 — Stats & growth (US2 / AC-003–004)

1. User + operational statistics populated (or zeros).
2. Growth charts show six families for default range.
3. Confirm no control launches customer operational workflows.

### V3 — Subscriptions & rankings (US3 / AC-005–006)

1. Subscription distribution + expiring/expired/renewed lists.
2. All five ranking lists present (may be empty).

### V4 — Activity & attention (US4 / AC-007–008)

1. Recent activity newest-first with expected event types when seeded.
2. Attention companies show reasons; empty state when none.

### V5 — Quick actions & filters (US5 / AC-009–010)

1. Each Quick Action navigates to correct module; no dashboard writes.
2. Apply valid filters → sections refresh (<3s typical).
3. Inverted date range rejected with validation message.

### V6 — Resilience (AC-011)

1. Force one endpoint failure (mock/proxy) → that widget errors with retry; others remain.
2. Unauthorized session → existing auth handling.

## Pass criteria

- [ ] Phases 1–6 completion criteria met for frontend scope
- [ ] AC-001–AC-012 verified where frontend-observable
- [ ] SC-001–SC-006 checked
- [ ] Constitution gates remain PASS (read-only monitoring)
- [ ] Contracts honored

## References

- Spec: [spec.md](./spec.md)
- Research: [research.md](./research.md)
- REST: [contracts/rest-dashboard.md](./contracts/rest-dashboard.md)
- UI: [contracts/ui-dashboard.md](./contracts/ui-dashboard.md)
