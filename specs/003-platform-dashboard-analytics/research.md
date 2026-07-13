# Research: A003 — Platform Dashboard & Analytics

**Date**: 2026-07-13  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All Technical Context decisions for frontend planning are resolved below.

---

## R1. Widget independence

**Decision**: One TanStack Query (or small cohesive group) per dashboard section/widget. Shared filter object is part of every filter-sensitive query key.

**Rationale**: FR-015 partial failure isolation; parallel loading; constitution Dashboard First UX.

**Alternatives considered**: Single mega-query for entire dashboard — simpler wiring, worse failure blast radius; rejected.

---

## R2. Filter state ownership

**Decision**: URL search params are the source of truth for applied filters; Zustand holds draft form values and mirrors applied filters for ergonomic reads. Apply writes URL → queries refetch via key change.

**Rationale**: Shareable/bookmarkable dashboard views; browser back works; avoids stale Zustand-only bugs.

**Alternatives considered**: Zustand-only filters — faster to build, weaker share/back behavior.

---

## R3. Default date range

**Decision**: Default to last 30 days (inclusive) when no range in URL; growth granularity defaults to `day` for ≤31 days, `week` for longer ranges unless user overrides.

**Rationale**: Sensible landing analytics without forcing filter interaction (assumptions in spec).

**Alternatives considered**: All-time default — heavy and less actionable for “today/this month” overview cards (overview “today/month” metrics remain absolute from DASH-01 even when trend range differs—document in UI copy if needed).

---

## R4. Attention / expiry windows

**Decision**: Client sends optional `expiringWithinDays` (default **14**) to DASH-04/DASH-07 as supported; inactivity threshold is server-defined (assume ~30 days). Client displays reasons returned by API—does not re-implement business rules beyond presentation.

**Rationale**: Spec assumptions; keeps authority on API.

**Alternatives considered**: Hard-code reason detection client-side — drifts from backend; rejected.

---

## R5. Chart library

**Decision**: Continue Recharts via shared chart wrappers from A001; extend for pie/donut subscription distribution and multi-series growth as needed.

**Rationale**: Already in stack; consistent styling.

**Alternatives considered**: New chart library — unjustified cost.

---

## R6. Caching

**Decision**: `staleTime` ~30–60s for summary/statistics/growth/subscriptions/rankings; ~15–30s for recent activity and attention. Keep previous data while refetching. Retry failed GETs 1–2 times with backoff; user Retry button always available on error UI.

**Rationale**: SC timing + avoid UI flicker; admin traffic volume is low.

**Alternatives considered**: No cache — more correct realtime, worse UX; full realtime websockets — future consideration.

---

## R7. Quick Actions

**Decision**: Prefer DASH-08 catalog when available; fallback to static authorized action list matching spec if API returns empty. Actions are `navigate()` only to known console routes.

**Rationale**: Role-aware catalog later; A002 Super Admin sees full set now.

**Alternatives considered**: Hardcode only — fine for MVP but less extensible.

---

## R8. Deep-links

**Decision**: Activity/attention/ranking rows link to `/companies/:id`, `/subscriptions/:id`, `/activity`, etc. Never invent customer-app routes.

**Rationale**: Constitution Non-Goals.

**Alternatives considered**: Modal detail on dashboard — duplicates management modules; deferred.

---

## R9. Mock strategy

**Decision**: Extend A001 mocks to implement DASH-01–DASH-08 with rich fixtures (including zero-attention and multi-reason attention cases) for AI-assisted frontend delivery before/without live API.

**Rationale**: Unblocks UI; contracts stay identical to live.

**Alternatives considered**: Block on backend — slows A003.

---

## R10. Evolving A001 dashboard

**Decision**: Replace provisional dashboard widgets/API paths with A003 contracts and section set; reuse widget-frame, summary-card, and chart primitives where they fit.

**Rationale**: Avoid parallel dashboards; single landing experience.

**Alternatives considered**: Keep old metrics beside new — confusing; rejected.
