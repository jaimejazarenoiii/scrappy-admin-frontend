# UI Contracts: A004 — Platform Management

**Date**: 2026-07-13  
**Audience**: Frontend implementation against [plan.md](../plan.md)

## Shell & access

- All management routes render inside AppShell after A002 `RequireAuth` + `RequireRole(super_admin)`.
- Unauthenticated → login; wrong role → unauthorized.
- Sidebar entries: Companies, Subscriptions, Administrators, Reports, Activity, Settings, Exports; Search via header.

## List surfaces

Every management list MUST provide:

1. Page title + primary CTA (where create exists)
2. Search + filters + sort
3. Paginated table with loading skeleton, empty state, error+retry
4. Row navigate-to-detail (click or View)
5. Row/header actions for lifecycle where applicable (confirmation-gated)

URL owns applied filters (`q`, status, page, sort, …).

## Detail surfaces

Entity details MUST provide:

1. Header: name, status/lock badges, primary actions
2. Breadcrumbs back to list (and company when nested)
3. Sections/tabs for related data
4. Independent Query loading per heavy section (stats, history) so one failure does not blank the page
5. No controls that launch customer operational workflows

## Company detail tabs (minimum)

Overview · Statistics · Owners · Subscriptions · Notes · Timeline

## Confirmation dialogs

Lifecycle/security actions open a modal with:

- Clear consequence copy
- Cancel (focus return) + Confirm
- Busy state on confirm; disable double-submit
- On success: close, toast, invalidate queries
- On failure: keep open or close with error toast (prefer keep open with message)

## Password reset

- Confirm dialog only (no new-password fields for target)
- Success copy must not include credentials
- Failure shows API message

## Notes

- Composer visible to admins only
- Label notes as internal/private
- Append-only list UX (no edit/delete in MVP unless API later adds)

## Activity

- Read-only table/timeline
- Filters for action types / date / actor
- Click-through to target when `targetType/id` resolvable
- No edit/delete actions

## Search

- Debounced keyword input
- Type filters (multi)
- Results show type badge + title + subtitle
- Selecting a hit navigates to entity route
- Empty vs error distinguished

## Reports

- Catalog of report types
- Filter form per selected report
- Run → results table/charts
- Optional “Export results” → PM-EX with report scope

## Settings

- Category navigation
- Per-key editors matching value types
- Save/patch with validation
- Extra confirm for security/password/session policy changes

## Exports

- Dataset selector + scope
- Job status list or detail with poll
- Download when `ready`
- Rate-limit (429) messaging

## Cross-cutting UX states

| State | Behavior |
|-------|----------|
| Loading | Skeletons, not blank pages |
| Empty | Helpful CTA when create exists |
| Error | Message + Retry |
| Forbidden action | Disabled control or toast from 403 |
| Unsaved form | Block navigate with discard dialog |

## Accessibility baseline

- Dialogs trap focus; Escape cancels
- Icon-only actions have aria-labels
- Status not color-only
- Tables keyboard-navigable where practical
- `prefers-reduced-motion` respected for Framer transitions

## Non-goals (UI)

No purchasing/selling/inventory/trip/expense execution screens; no cleartext credential display; no activity mutation UI; no future modules (tickets, billing, impersonation) in MVP chrome beyond placeholders if already present—do not build them in A004.
