# Routing Contract

**Date**: 2026-07-13

## Public

- `/login` — unauthenticated only

## Authenticated shell (nested layout)

- `/` → redirect to `/dashboard`
- `/dashboard`
- `/companies`, `/companies/:id` (details, stats, notes, owners sections)
- `/subscriptions`, `/subscriptions/:id`
- `/analytics`
- `/reports`
- `/administrators`, `/administrators/:id`
- `/activity`
- `/search` (optional dedicated page; shell search may overlay)
- `/settings`
- Support actions live as dialogs/routes under companies/users contexts

## System

- `/unauthorized` — authenticated but missing role
- `*` — 404

## Guards

- All shell routes: `RequireAuth`
- Mutating admin modules: role allow-lists (e.g., Read Only Analyst blocked from writes)
- Lazy-load each feature route module
