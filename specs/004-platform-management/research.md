# Research: A004 — Platform Management

**Date**: 2026-07-13  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All Technical Context decisions for frontend planning are resolved below.

---

## R1. Feature module boundaries

**Decision**: Separate feature areas for companies, owners, subscriptions, administrators, reports, activity, search, settings, and exports, with a thin shared “management UI kit” (table, filters, dialogs, notes, timeline).

**Rationale**: Matches constitution Separation of Responsibilities and AI-friendly incremental delivery (milestones M1–M7).

**Alternatives considered**: One monolithic “platform” feature folder — harder ownership and review; rejected for MVP scale.

---

## R2. Company as hub vs standalone entities

**Decision**: Company detail is the primary hub (owners, subscriptions, notes, timeline tabs). Owners and subscriptions also have standalone detail routes for search/deep-links.

**Rationale**: Support workflows start from company; global search and dashboard links need direct URLs.

**Alternatives considered**: Company-only nesting — breaks search deep-links; rejected.

---

## R3. List filter state

**Decision**: URL search params are source of truth for applied list/search/activity filters; Zustand optional for draft filter UI. Debounce `q` before writing URL.

**Rationale**: Shareable admin links; back-button correctness; consistent with A003 filters.

**Alternatives considered**: Zustand-only — weaker share/back behavior.

---

## R4. Mutation confirmation & optimism

**Decision**: All lifecycle/security mutations (activate/deactivate/lock/unlock/suspend/expire/password reset) require confirmation dialogs and are **non-optimistic**. Optional optimistic UI only for low-risk field patches (e.g., company display name) with rollback.

**Rationale**: Constitution Security + Operational Support; prevents accidental lockouts.

**Alternatives considered**: Optimistic lock/deactivate — risky UX; rejected.

---

## R5. Password reset UX

**Decision**: Confirm → call PM-PW-* → success toast acknowledging secure channel; never display or accept new password in admin UI for target users (admin-initiated reset is trigger-only).

**Rationale**: Spec FR-003/SC-003; aligns with A002 credential non-display.

**Alternatives considered**: Admin sets temporary password in cleartext — security anti-pattern; rejected.

---

## R6. Subscription state machine authority

**Decision**: Client presents actions allowed for current status using a documented allow-map aligned to platform subscription rules; API is authoritative (400 on illegal transition).

**Rationale**: Spec business rule 7; avoids duplicating billing logic.

**Alternatives considered**: Free-form status PATCH — rejects constitution Separation.

---

## R7. Last Super Admin protection

**Decision**: Rely on API enforcement; optionally disable actions in UI when list shows a single Active Super Admin. Always surface API error copy if blocked.

**Rationale**: Spec assumption; prevents console lockout.

**Alternatives considered**: Client-only prevention — insufficient; rejected as sole control.

---

## R8. Caching & invalidation

**Decision**:

| Resource | staleTime | Invalidate on |
|----------|-----------|---------------|
| Lists | ~30s | Matching resource mutations |
| Details | ~30–60s | That entity’s mutations |
| Activity / search | ~15–30s | Any admin mutation (broad invalidate activity); search on demand |
| Settings | ~60s | Setting patch |
| Export jobs | poll while pending | Create export |

Use `keepPreviousData` on paginated lists. Retry GETs 1–2×; no blind mutation retry.

**Rationale**: Dense admin UX without stale critical status after actions.

**Alternatives considered**: No cache — flicker; websocket invalidation — future.

---

## R9. Global search placement

**Decision**: Dedicated `/search` page plus header search entry that navigates with `q` param (command-palette-style optional later).

**Rationale**: Constitution Search First; SC-001.

**Alternatives considered**: Header-only popover — harder pagination/a11y for large result sets.

---

## R10. Reports vs dashboard

**Decision**: Reports are explicit run-with-filters informational outputs (PM-RP). Dashboard (A003) remains landing aggregates. Report types may deep-link to lists but never to customer ops.

**Rationale**: Clear product split; avoids duplicating DASH widgets as “reports.”

**Alternatives considered**: Merge reports into dashboard — overcrowds landing; rejected.

---

## R11. Export delivery

**Decision**: Async job model (PM-EX-01/02): accept → poll → download reference. Support initiating export from Exports center and from contextual module actions (same API).

**Rationale**: Spec assumption; large datasets.

**Alternatives considered**: Synchronous blob download only — fails for large activity/report exports.

---

## R12. Mock strategy

**Decision**: Extend A001 mock layer with full PM-* coverage and seeded companies/owners/admins/subscriptions/activity for quickstart; honor validation and last-SA rules in mock.

**Rationale**: Frontend can finish MVP without blocking on backend; parity with A002/A003.

**Alternatives considered**: Live-only — slows AI implementation loops.

---

## R13. Permissions modeling

**Decision**: Keep capability helper map (`can(action)`) even though MVP always true for Super Admin; gates ready for Support/Finance/ReadOnly later.

**Rationale**: Constitution Internal Use Only role growth without redesign.

**Alternatives considered**: Scatter `isSuperAdmin` checks — harder migration.

---

## R14. Testing posture

**Decision**: Recommend tests in plan; generate none until product owner requests. Prioritize critical flows in manual quickstart.

**Rationale**: User/plan constraint; matches A001–A003.

**Alternatives considered**: Mandate full suite in plan — out of scope for this command.
