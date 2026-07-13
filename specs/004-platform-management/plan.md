# Implementation Plan: A004 — Platform Management

**Branch**: `004-platform-management` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-platform-management/spec.md`

**Note**: Planning only. No application code or source file trees are generated here. This is the final MVP feature roadmap for the Scrappy Admin Console.

## Summary

Deliver the complete **Platform Management** module on the A001–A003 foundation: companies, owners, administrators, subscriptions, notes, password resets, login/activity histories, informational reports, immutable activity logs, global search, platform settings, and exports—consuming Scrappy REST contracts **PM-CO / PM-OW / PM-AD / PM-SU / PM-PW / PM-RP / PM-AC / PM-SE / PM-ST / PM-EX**.

Optimize for maintainability and AI-assisted delivery via shared list/detail/form/dialog/table patterns, consistent Query key factories + invalidation, URL-synced list filters, confirmation-gated lifecycle mutations, and mock parity when `VITE_USE_MOCK=true`. Preserve constitution gates: internal Super Admin only; customer operational records read-only; every admin mutation audited; never display credentials.

## Technical Context

**Language/Version**: TypeScript (strict) on React 19

**Primary Dependencies**: Vite, Tailwind CSS v4, shadcn/ui, React Router v7, Zustand, TanStack Query, React Hook Form, Zod, Axios, TanStack Table, Recharts (reports/stats where useful), Framer Motion, Lucide React

**Storage**: No domain entity caches in Zustand. List filter drafts/UI prefs in Zustand or URL. Server data via TanStack Query. Auth session shell remains A002 Zustand.

**Testing**: Recommend unit (Zod schemas), component (forms/dialogs/tables), integration (Query + routes), and critical-flow smoke. Do not generate tests in this plan.

**Target Platform**: Modern browsers; desktop-first dense admin; tablet/mobile usable; A001 design tokens

**Project Type**: Frontend SPA consuming existing Scrappy REST API

**Performance Goals**: Company find→detail under 1 minute (SC-001); search results under 3s typical (AC-007); owner unlock+reset under 2 minutes (SC-004); list pagination snappy; route-level code splitting for management modules

**Constraints**: JWT + refresh + protected routes + Super Admin RBAC (A002); PM-* contracts; no customer workflows; no credential display; no source tree in this plan

**Scale/Scope**: Thousands of companies; full CRUD/lifecycle surfaces for platform entities; MVP final feature set

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Pre-research | Post-design |
|------|--------------|-------------|
| Platform administration only | PASS — lifecycle/admin only | PASS — reports/stats informational; no ops workflows |
| Internal use only | PASS — Super Admin console | PASS — all routes behind A002 guards |
| Read-first | PASS — ops data read-only; platform lifecycle writes allowed | PASS — contracts separate mutations from ops reads |
| Non-goals | PASS — tickets/billing/etc. future | PASS — Future Considerations only |
| Separation of responsibilities | PASS — Scrappy REST consumer | PASS — PM-* URIs |
| Auditability | PASS — every mutation audited | PASS — activity immutable; no delete APIs |
| Security | PASS — RBAC; no credentials in UI | PASS — PM-PW acknowledgments only |
| Search / dashboard / consistency | PASS — list/search/filter/detail | PASS — shared patterns + global search |
| Scalability & extensibility | PASS — paginated lists; future modules | PASS — settings/report catalogs extensible |
| UX & technology principles | PASS — stack locked | PASS — a11y, skeletons, DX patterns |

**Gate result**: PASS. Complexity Tracking not required.

## Architecture Decisions (no source tree)

### Relationship to A001 / A002 / A003

| Prior | Role for A004 |
|-------|----------------|
| A001 | Shell, design system, feature architecture, Axios/Query/Zustand, provisional stubs |
| A002 | Auth, session, Super Admin gate, password policy UX patterns |
| A003 | Dashboard deep-links into A004 destinations; shared chart/card patterns for stats |

A004 replaces provisional management stubs with full product surfaces and becomes the last MVP slice.

### Feature boundaries

| Feature module | Owns | Does not own |
|----------------|------|--------------|
| Companies | List/CRUD/detail/stats/timeline/notes | Customer operational workflows |
| Owners | Nested under company + owner detail/security actions | Customer employee management |
| Subscriptions | List/detail/lifecycle/notes | Billing/payments/invoices |
| Administrators | CRUD/roles/security/histories | Customer user auth |
| Reports | Catalog + run + view results | Operational execution |
| Activity | Platform-wide immutable log browser | Editing/deleting logs |
| Search | Global multi-type search | Domain CRUD (navigates out) |
| Settings | Platform configuration groups | Per-company product settings beyond platform scope |
| Exports | Job request + status/download | Batch ops on entities |

Shared cross-cutting: confirmation dialogs, data table shell, filter panel, search bar, pagination, status badges, notes panel, timeline, login-history table, empty/loading/error states, toast feedback.

### Shared components (logical)

Data tables · Search bars · Filter panels · Pagination · Status badges · Statistics cards · Timeline · Notes list/composer · Charts (report/stat subsets) · Empty / Loading / Error states · Confirmation dialogs (activate, deactivate, lock, unlock, suspend, expire, reset password, discard) · Form shells · Detail header with actions · Breadcrumbs · Page headers

### Shared hooks (logical)

List query params (URL sync) · Debounced search · Confirm-action mutation wrapper · Export job polling · Infinite/paged list helpers · Permission/capability checks (MVP: Super Admin = all) · Toast/error mapping from API

### Shared dialogs

Activate · Deactivate · Lock · Unlock · Suspend · Expire · Reset Password · Generic Confirm · Unsaved Changes

### Shared tables / forms / layouts

- **Tables**: Companies, Owners (company-scoped), Administrators, Subscriptions, Activity Logs, Search Results, Login History, Report Results, Export Jobs (optional)
- **Forms**: Company create/edit · Owner create/edit · Administrator create/edit (+ roles) · Subscription create/renew · Note composer · Settings field editors · Report filter form · Export scope form · Search filter form
- **Layouts**: AppShell (existing) · Management list layout (header + filters + table) · Entity details layout (header + tabs/sections + side actions) · Settings layout (category nav + form pane) · Profile/history layout (summary + tables)

### API architecture

- Axios client from A001/A002 with auth interceptors
- One typed API client surface per resource family aligned to PM-* IDs
- Query key factory: `['pm', resource, ...scope, filters, page]`
- Mutations invalidate related lists/details and activity/search where relevant
- Mock adapters implement full PM-* when `VITE_USE_MOCK=true`

### Routing strategy

All under authenticated Super Admin shell:

| Route intent | Example purpose |
|--------------|-----------------|
| `/companies` | Company list |
| `/companies/new` | Create company |
| `/companies/:id` | Company detail (overview/stats/owners/subscriptions/notes/timeline tabs) |
| `/owners/:id` | Owner detail (or company-nested equivalent) |
| `/subscriptions` | Subscription list |
| `/subscriptions/:id` | Subscription detail |
| `/administrators` | Admin list |
| `/administrators/new` | Create admin |
| `/administrators/:id` | Admin detail/profile |
| `/reports` | Report catalog + runner |
| `/activity` | Activity logs |
| `/search` | Global search (also command palette / header entry) |
| `/settings` | Platform settings |
| `/exports` | Export center (or modal from modules + status page) |

Deep-links from A003 Quick Actions and search hits land on these routes. Prefer nested company tabs for owners/subscriptions when context is company-centric; allow standalone owner/subscription detail for search/deep-link.

### Permission strategy

MVP: **Super Admin only** (A002). Capability map should still be structured for future roles (Support may reset passwords; Finance may manage subscriptions; Read Only Analyst read-only). Hide/disable actions lacking capability; API remains source of truth (403).

Special rules:

- Last Active Super Admin cannot be deactivated/locked (surface API error clearly)
- Password reset: confirm dialog; never show secrets
- Settings security policies: Super Admin only

### State management strategy

| Zustand | TanStack Query | Local component state |
|---------|----------------|------------------------|
| Auth session (A002) | All PM-* reads | Form dirty flags |
| Sidebar/UI chrome | Mutation results via invalidation | Dialog open/target entity |
| Draft list filters (optional mirror) | Export job polling | Table row selection (future-ready, unused MVP) |
| Settings category UI selection | Search results | Ephemeral toasts coordination |

Never store company/owner/admin/subscription/activity collections in Zustand.

## Pages

| Page | Purpose | Navigation | Dependencies |
|------|---------|------------|--------------|
| Companies List | Search/filter/sort/paginate companies; row actions | Sidebar → Companies; dashboard QA | PM-CO-01 |
| Company Create | Create company | List → New | PM-CO-02 |
| Company Detail | Overview, edit, stats, timeline, notes, owners, subscriptions | List/search/dashboard | PM-CO-03–10, OW, SU |
| Owner Detail | Profile, status actions, login history, activity, password reset | Company owners tab / search | PM-OW-*, PM-PW-01 |
| Subscriptions List | Cross-company subscription browse | Sidebar / dashboard | PM-SU-01 |
| Subscription Detail | Current + history + notes + lifecycle | List / company tab | PM-SU-02–08 |
| Subscription Create | Create for a company | Company / list | PM-SU-03 |
| Administrators List | Browse/filter admins | Sidebar | PM-AD-01 |
| Administrator Create | Create + role | List → New | PM-AD-02 |
| Administrator Detail | Profile, roles, security, histories, reset | List / search | PM-AD-03–10, PM-PW-02 |
| Reports Hub | Catalog, filters, run, view/export results | Sidebar / dashboard | PM-RP-01–02, PM-EX |
| Activity Logs | Filterable immutable platform activity | Sidebar / dashboard | PM-AC-01 |
| Global Search | Multi-type keyword search | Header / `/search` | PM-SE-01 |
| Platform Settings | Categories: general, branding, preferences, defaults, security, password, session | Sidebar | PM-ST-01–02 |
| Exports Center | Request export + track jobs | Sidebar or module actions | PM-EX-01–02 |

## Layouts

| Layout | Use |
|--------|-----|
| **Management List** | Page header + primary actions + filter/search bar + table + pagination |
| **Entity Details** | Sticky header (title, status badges, primary actions) + tab/section nav + content pane + optional side rail (notes/quick facts) |
| **Settings** | Left category list + right form/editor pane + save affordance |
| **Profile/History** | Summary card + tabbed history tables (login / activity) |
| **Report Runner** | Catalog or selected report + filter form + results table/charts |

## Components inventory (reusable)

Data tables · Search bars · Filter panels · Pagination controls · Dialogs (lifecycle + confirm) · Forms · Cards · Status badges · Timeline · Statistics cards · Charts · Empty/Loading/Error · Confirmation dialogs · Notes composer · Breadcrumbs · Page header · Action menu (row + header) · Export trigger · Search hit row

## Tables

For each table below: server-driven **sorting**, **filtering**, **pagination**; **bulk selection** column reserved (disabled/hidden MVP, future-ready); **row actions** menu; **empty state** copy.

| Table | Columns (core) | Row actions |
|-------|----------------|-------------|
| Companies | Name, status, plan/subscription summary, owners count, created, updated | View, Edit, Activate/Deactivate |
| Owners | Name, email, status, locked, last login | View, Activate/Deactivate, Lock/Unlock, Reset password |
| Administrators | Name, email, roles, status, locked, last login | View, Edit, Activate/Deactivate, Lock/Unlock, Reset password |
| Subscriptions | Company, plan, status, period, renew date | View, Renew, Suspend, Expire |
| Activity | Timestamp, actor, action type, target, summary | View target (navigate) |
| Search results | Type badge, title, subtitle, updated | Open target |
| Login history | Timestamp, result, IP/device summary if provided | — |
| Report results | Report-defined columns | Export |
| Export jobs | Dataset, scope, status, created, completed | Download when ready |

## Forms

| Form | Validation | Submit | Success | Failure | Confirmation |
|------|------------|--------|---------|---------|--------------|
| Company create/edit | Zod: required name/identity; unique conflicts from API | Mutation | Toast + navigate detail | Field/API errors | Unsaved leave |
| Owner create/edit | Email, required fields, company association | Mutation | Toast + refresh | 409/400 | Unsaved leave |
| Admin create/edit | Email, roles ≥1 | Mutation | Toast + detail | Last-SA / 409 | Unsaved leave |
| Subscription create/renew | Company, plan, dates per rules | Mutation | Toast + detail | Invalid transition | Confirm renew |
| Note | Non-empty body, length cap | Mutation | Append list | 400 | — |
| Settings | Per-key type/bounds | Patch | Toast + invalidate | 400 | Confirm sensitive policy changes |
| Search filters | Min `q` length; allow-list types | Query | Results | Empty vs error | — |
| Export | Dataset allow-list; scope/range caps | Create job | Job accepted + poll | 400/429 | Confirm large exports |
| Report filters | Per-report schema | Run | Results pane | 400 | — |

## Dialogs

| Dialog | Confirm copy intent |
|--------|---------------------|
| Activate / Deactivate company, owner, admin | Explain access impact |
| Lock / Unlock owner or admin | Explain access impact |
| Suspend / Expire subscription | Explain commercial impact |
| Reset password | Confirm no password shown; email/channel messaging |
| Discard unsaved | Lose changes |
| Generic confirm | Parameterized title/body/confirm label |

Destructive/lifecycle actions **always** confirmation-gated; never optimistic for lock/deactivate/password reset (wait for server).

## API Integration (per module)

### Companies (PM-CO-*)

- **Queries**: list, detail, statistics, timeline, notes
- **Mutations**: create, update, activate, deactivate, add note
- **Cache**: list keys include filters/page; detail by id
- **Invalidation**: on any company mutation → list + detail + timeline + activity; note → notes + timeline
- **Loading/Errors/Retry**: table/detail skeletons; section error+retry; 404 not-found page
- **Optimistic**: optional soft update for non-lifecycle field edits only; rollback on error. No optimistic activate/deactivate

### Owners (PM-OW-*, PM-PW-01)

- Queries: list by company, detail, login history, activity summary
- Mutations: CRUD-ish update, activate/deactivate, lock/unlock, password reset
- Invalidation: owner detail/list + company detail + activity; password reset → activity only
- Never cache/store password material

### Administrators (PM-AD-*, PM-PW-02)

- Same pattern as owners + role patch
- Guard UI against last Super Admin actions using API errors + optional pre-check

### Subscriptions (PM-SU-*)

- Queries: list, detail, company history, notes
- Mutations: create, renew, suspend, expire, add note
- Invalidation: subscription + company + lists + activity
- Client enables actions based on current status; API enforces transitions

### Reports (PM-RP-*)

- Query catalog; mutation/run returns result (or treat run as mutation with result in cache keyed by report+filters)
- No optimistic; show progress for long runs

### Activity (PM-AC-01)

- Query only; no mutations; filters in key; immutable UI (no edit controls)

### Search (PM-SE-01)

- Debounced query; abort in-flight on new keystroke; paginate; deep-link on select

### Settings (PM-ST-*)

- Query groups; patch single key; invalidate group; confirm sensitive keys

### Exports (PM-EX-*)

- Create job mutation; poll GET until ready/failed; download when reference available; invalidate jobs list; toast on complete

**Global retry**: GETs 1–2 automatic retries; mutations no auto-retry except idempotent GETs after network blip on poll. User-visible Retry on error panels.

## State Management (summary)

See Architecture table. Rule: **server state → Query; session/chrome → Zustand; ephemeral UI → local**.

## Navigation

- **Sidebar**: Dashboard (A003), Companies, Subscriptions, Administrators, Reports, Activity, Settings, Exports; Search via header
- **Breadcrumbs**: List → Entity → Tab/section
- **Details navigation**: Tabs within company (Overview, Statistics, Owners, Subscriptions, Notes, Timeline)
- **Cross-module**: Search hits, activity target links, dashboard Quick Actions, related entity chips

## Permissions

| Module | MVP Super Admin |
|--------|-----------------|
| All list/read | Allow |
| All lifecycle mutations | Allow (subject to last-SA and subscription rules) |
| Settings security policies | Allow |
| Password reset | Allow |
| Exports | Allow |
| Non–Super Admin | Blocked by A002 (unauthorized) |

Future: capability matrix without redesigning routes.

## Validation

Mirror spec Validation Rules via Zod on client; display field errors; map 400/409 from API. Search min length; export range caps; settings bounds; email formats; role required.

## Error Handling

| Case | UX |
|------|-----|
| API 4xx/5xx | Inline or toast + preserve form |
| 401 | A002 refresh → login |
| 403 | Unauthorized / action disabled message |
| Network | Retry affordance |
| Missing data 404 | Not found state with back link |
| Invalid request | Field-level + summary |
| Empty lists/search | Empty state (not error) |

## Responsive Design

- **Desktop**: full filter panels, multi-column tables, side category settings
- **Tablet**: collapsible filters; horizontal scroll tables; stacked detail tabs
- **Mobile**: priority columns; bottom sheets for filters/actions; single-column details; avoid horizontal-only critical actions

## Accessibility

Keyboard: table focus, dialog focus trap, Escape closes. ARIA: dialog labels, live regions for toasts, status badges with text. Focus return after dialog close. Screen readers: announce status changes; charts have text alternatives where used; do not rely on color alone for status.

## Performance

Route lazy-load management modules · code-split heavy report/chart panes · Query `staleTime` tuned per resource (lists 30s; detail 30–60s; activity/search shorter) · `placeholderData`/`keepPreviousData` on pagination · background refetch throttled · skeletons · avoid mega-parent re-renders · virtualize only if lists exceed comfort threshold later

## Testing Strategy (recommendations only — no tests generated)

- **Unit**: Zod schemas; status transition helpers; query key factories
- **Component**: forms, dialogs, table empty/error, badges
- **Integration**: list→detail→mutation→invalidation; search deep-link; export poll
- **Critical flows**: company create→note→deactivate; owner lock→unlock→reset; admin role→lock; subscription renew/suspend; report run; settings patch; activity immutability (no write UI)

## Implementation Milestones

### M0 — Shared foundation for management

**Objectives**: Shared list/detail layouts, table shell, filter/search URL sync, confirm dialogs, Query key conventions, mock PM-* stubs skeleton.  
**Dependencies**: A001–A003.  
**Deliverables**: Reusable management primitives; routing placeholders.  
**Completion**: Authenticated navigation to all A004 route shells without crashes.

### M1 — Companies

**Objectives**: Full company list/CRUD/detail/stats/timeline/notes.  
**Dependencies**: M0.  
**Deliverables**: PM-CO-* wired; company AC path.  
**Completion**: AC-001 observable end-to-end on mock/API.

### M2 — Owners + password reset

**Objectives**: Owner CRUD/security/history; PM-PW-01.  
**Dependencies**: M1.  
**Deliverables**: Owner detail + actions.  
**Completion**: AC-002; SC-003/SC-004 paths.

### M3 — Subscriptions

**Objectives**: List/detail/history/create/renew/suspend/expire/notes.  
**Dependencies**: M1.  
**Deliverables**: PM-SU-* surfaces.  
**Completion**: AC-004.

### M4 — Administrators

**Objectives**: Admin CRUD/roles/security/histories; PM-PW-02; last-SA UX.  
**Dependencies**: M0 (can parallel M2 after M0).  
**Deliverables**: PM-AD-* surfaces.  
**Completion**: AC-003.

### M5 — Activity + Global Search

**Objectives**: PM-AC-01 browser; PM-SE-01 search + deep-links.  
**Dependencies**: M1–M4 entities exist for meaningful hits.  
**Deliverables**: Activity + Search pages; header search.  
**Completion**: AC-006, AC-007; audits visible for prior mutations.

### M6 — Reports + Exports

**Objectives**: Report catalog/run; export jobs for companies/users/subscriptions/reports/activity.  
**Dependencies**: M1+; M5 helpful for activity export.  
**Deliverables**: Reports hub + Exports center.  
**Completion**: AC-005, AC-009; SC-005 path.

### M7 — Settings + polish + MVP DoD

**Objectives**: Settings categories; a11y/responsive/perf pass; constitution Non-Goals sweep; quickstart validation; wire A003 deep-links.  
**Dependencies**: M1–M6.  
**Deliverables**: Complete A004; MVP Admin Console complete.  
**Completion**: AC-001–AC-012, SC-001–SC-006; Definition of Done below.

## Development Order (exact)

1. Shared management primitives (layouts, table, filters, dialogs, Query conventions, mocks)  
2. Companies (list → create → detail → stats → timeline → notes → activate/deactivate)  
3. Owners (nested list → detail → lifecycle → login/activity → password reset)  
4. Subscriptions (company tab + global list → detail → create/renew/suspend/expire → notes)  
5. Administrators (list → create → detail → roles → lifecycle → histories → password reset)  
6. Activity logs  
7. Global search (+ header entry)  
8. Reports  
9. Exports  
10. Platform settings  
11. Cross-links from dashboard, breadcrumbs polish, performance/a11y, quickstart sign-off  

## Definition of Done (Platform Management / MVP)

- [ ] All pages in Pages table implemented and reachable under Super Admin
- [ ] All PM-* contracts consumed (live or contract-faithful mock)
- [ ] AC-001–AC-012 verified for frontend-observable behavior
- [ ] SC-001–SC-006 checked
- [ ] No customer operational workflow entry points (SC-006)
- [ ] Password reset responses never render credentials (SC-003)
- [ ] Mutations invalidate lists/details and appear in activity where expected (SC-002)
- [ ] Shared patterns used consistently (list/detail/dialog/form)
- [ ] Responsive + a11y baseline met
- [ ] `npm run build` green
- [ ] Quickstart scenarios pass
- [ ] Constitution gates remain PASS
- [ ] Future Considerations not implemented but not blocked architecturally

## Deliverables

One complete implementation roadmap for the remainder of the Scrappy Admin Console MVP:

- This [plan.md](./plan.md)
- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)

Tasks generation is deferred to `/speckit-tasks`. No code and no source file trees in this phase.

## Project Structure

### Documentation (this feature)

```text
specs/004-platform-management/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # /speckit-tasks — not created here
```

### Source Code (repository root)

Per product-owner direction: **no concrete source file tree is prescribed**. Implement within existing A001 feature-based conventions. Paths deferred to `/speckit-tasks`.

**Structure Decision**: Frontend-only Admin Console SPA changes; backend remains existing Scrappy REST API.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
