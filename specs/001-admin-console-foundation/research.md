# Research: A001 — Scrappy Admin Console Foundation

**Date**: 2026-07-13  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All Technical Context unknowns from planning are resolved below. No NEEDS CLARIFICATION remain.

---

## R1. Frontend stack lock-in

**Decision**: React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + React Router v7 + Zustand + TanStack Query + React Hook Form + Zod + Axios + TanStack Table + Recharts + Framer Motion + Lucide Icons.

**Rationale**: Matches approved product/tech direction; pairs strong typing with fast Vite DX; shadcn/ui aligns with accessible admin patterns; TanStack Query is the correct home for server state at scale.

**Alternatives considered**:
- Next.js SSR — unnecessary for internal SPA; adds hosting complexity.
- Redux Toolkit — heavier than needed when Query owns server state.
- MUI — viable but conflicts with chosen Tailwind/shadcn direction.

---

## R2. Backend integration model

**Decision**: Consume existing Scrappy REST API only. No GraphQL. No business-logic duplication in the console.

**Rationale**: Constitution Principle XIII (Separation of Responsibilities). Admin console is a client of platform services.

**Alternatives considered**:
- BFF in this repo — deferred; adds ops burden before API contracts stabilize.
- Direct DB access — forbidden for a frontend admin console.

---

## R3. Authentication & session

**Decision**: JWT access token + refresh token. Axios request interceptor attaches Bearer access token. On 401, a single-flight refresh queue retries pending requests; refresh failure clears session and routes to login. Zustand holds session shell (profile, roles, hydrated flag), not server entity caches.

**Rationale**: Standard SPA auth; prevents thundering-herd refresh; keeps server state in Query.

**Alternatives considered**:
- Cookie-only session — acceptable if API mandates; plan assumes Bearer JWT unless API docs dictate httpOnly cookies (adapter can swap storage without redesign).
- Silent iframe refresh — unnecessary complexity for internal tool.

**Storage note**: Prefer memory + refresh in httpOnly cookie if API supports it; otherwise secure `localStorage`/`sessionStorage` with clear threat-model documentation. Final storage binding follows Scrappy API auth contract during implementation.

---

## R4. Authorization model

**Decision**: Role-based access control with route-level and action-level checks. Initial role set designed for extension: Super Admin, Admin, Support, Finance, Sales, Read Only Analyst. MVP may ship a subset without schema redesign (roles as string unions / permission maps).

**Rationale**: Constitution Principle II.

**Alternatives considered**:
- Permission-only ABAC from day one — more flexible but slower to ship; roles can map to permission sets later.

---

## R5. Feature-based architecture

**Decision**: Feature folders encapsulate pages, components, hooks, services, types, validation, and feature-local UI state. Shared kits only for truly cross-cutting concerns.

**Rationale**: Enables parallel AI/human development and future modules without refactor.

**Alternatives considered**:
- Layer-first (`components/`, `hooks/` global) — becomes unmaintainable as modules grow.

---

## R6. Tables, forms, charts, widgets

**Decision**: Build shared kits first (Phase 3) before domain proliferation. TanStack Table for headless table behavior; RHF+Zod for forms; Recharts wrapped in domain-agnostic chart components; dashboard widgets as composable cards with independent query keys.

**Rationale**: Consistency principle; prevents one-off tables per module.

**Alternatives considered**:
- Copy-paste per feature — faster initially, costly by Phase 5+.

---

## R7. Performance approach

**Decision**: Route-level lazy loading for every feature; Query `staleTime` tuned per resource class (metrics shorter, reference data longer); skeleton loaders; optimistic updates only where rollback is trivial; avoid default `useMemo`/`useCallback` unless profiling requires.

**Rationale**: Matches performance goals and React 19 guidance; keeps code simple.

**Alternatives considered**:
- Micro-frontends — overkill for single internal console.

---

## R8. Error & observability UX

**Decision**: React error boundary at app and major route segments; Axios maps API errors to typed client errors; toasts for transient failures; empty states with clear next actions; retry buttons on widget/query failures.

**Rationale**: Constitution UX + operational support needs.

**Alternatives considered**:
- Full observability SDK (Sentry, etc.) — recommended later in Polish if ops requires; not blocking foundation.

---

## R9. Testing scope (recommendation only)

**Decision**: Unit-test pure logic (auth refresh queue, guards, zod schemas, query-key factories). Component-test shared kits and login/guards. No tests generated in plan/tasks unless product asks.

**Rationale**: Highest ROI on shared infrastructure; domain pages covered later by critical-path tests.

**Alternatives considered**:
- Full E2E from day one — valuable but depends on stable API; schedule in Polish if environment exists.

---

## R10. API contract assumption

**Decision**: Plan against a conventional REST admin surface (documented in `contracts/rest-api.md`). Where endpoints are not yet available, implementation uses typed client stubs/fixtures behind the same interfaces so UI proceeds without redesign when APIs land.

**Rationale**: Unblocks frontend foundation while backend admin routes mature.

**Alternatives considered**:
- Block all UI on complete API — slows foundation unacceptably.

---

## R11. Dark mode & responsive

**Decision**: Token-based theming with dark-mode class strategy (Tailwind/shadcn). Desktop-first breakpoints; tablet layouts required; phone is best-effort.

**Rationale**: Matches UI/UX requirements without delaying MVP visual polish.
