# Scrappy Admin Console

Internal React SPA for Scrappy platform administration — companies, subscriptions, analytics, support, and RBAC.

## Quick start

```bash
npm install
cp .env.example .env   # VITE_USE_MOCK=true by default
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Mock mode

Set `VITE_USE_MOCK=true` in `.env` to run entirely against in-memory mock handlers (no backend required).

### Demo credentials

| Field | Value |
|-------|-------|
| Email | Any registered admin email, e.g. `super@scrappy.io` |
| Password | `admin123` |

Mock admins in `src/shared/mocks/data.ts`:

- `super@scrappy.io` — super_admin (full access)
- `ops@scrappy.io` — admin, support
- `finance@scrappy.io` — finance
- `analyst@scrappy.io` — read_only_analyst (read-only)
- `sales@scrappy.io` — sales (inactive)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

## Project structure

```
src/
├── app/                 # Providers, router, error boundary
├── features/            # Feature modules (pages, api, hooks, components)
│   ├── auth/
│   ├── dashboard/
│   ├── companies/
│   ├── subscriptions/
│   ├── search/
│   ├── support/
│   ├── activity/
│   ├── administrators/
│   ├── analytics/
│   ├── reports/
│   └── settings/
└── shared/              # UI kit, layout, API client, mocks, guards
```

Each feature follows: `types.ts`, `api/`, `hooks/`, `pages/`, `components/`, and optional `validation/`.

API modules call `src/shared/mocks/handlers.ts` when `env.useMock` is true, otherwise the Axios client at `VITE_API_BASE_URL`.

## Routes

| Path | Description | RBAC |
|------|-------------|------|
| `/login` | Sign in (public) | — |
| `/dashboard` | Platform overview | Authenticated |
| `/companies`, `/companies/:id` | Company list & detail | Authenticated |
| `/subscriptions`, `/subscriptions/:id` | Subscription lifecycle | Authenticated |
| `/analytics` | Charts & trends | Authenticated |
| `/reports`, `/reports/:reportKey` | Generated reports | Authenticated |
| `/administrators`, `/administrators/:id` | Admin accounts | super_admin, admin (detail: super_admin) |
| `/activity` | Audit log | Authenticated |
| `/search` | Dedicated search page | Authenticated |
| `/settings` | Platform settings | super_admin, admin |
| `/unauthorized` | Access denied | Authenticated |
| `*` | 404 | — |

Global search palette: **⌘K** (or **Ctrl+K**) from the top bar.

## Environment

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

## Tech stack

React 19 · Vite · TypeScript · TanStack Query · React Router · Zustand · Tailwind CSS v4 · Framer Motion · Recharts · Sonner
