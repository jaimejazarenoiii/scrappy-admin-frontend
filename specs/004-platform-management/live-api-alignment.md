# Live admin API alignment

Point the console at the Scrappy API and disable mocks:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_MOCK=false
```

Login: `POST /admin/auth/login` with a `SUPER_ADMIN` account (`pnpm run db:create-super-admin` on the API).

## Wired to live `/admin/*`

| Area | Endpoints |
|------|-----------|
| Auth | `/admin/auth/login`, `/auth/refresh`, `/auth/logout`, `/users/me` |
| Companies | `GET/POST /admin/companies`, `GET /admin/companies/{id}`, `GET/POST …/accounts`, `POST …/accounts/{userId}/password-reset` |
| Subscriptions | Company-scoped create / list / detail / PATCH / renew / suspend / expire / subscription-status |
| Dashboard | `GET /admin/analytics/overview` (+ company analytics for stats panel) |

## Mock-only (hidden from nav when `VITE_USE_MOCK=false`)

Administrators CRUD, owners support actions, platform settings, exports hub, global search, activity feed, and invented report keys. Routes remain reachable by URL but APIs no-op or return empty instead of calling phantom endpoints.

## Typical live flow

1. Create company → **Companies → Create**
2. Add OWNER (or manager/employee) → company **Accounts** tab
3. Manage entitlement → company **Subscriptions** tab (or portfolio **Subscriptions** list)
4. Monitor portfolio → **Dashboard** KPIs from `/admin/analytics/overview`
