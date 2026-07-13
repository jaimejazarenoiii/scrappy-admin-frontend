# UI Kit Contracts

**Date**: 2026-07-13  
**Purpose**: Behavioral contracts for shared kits. No implementation code.

## Data Table

**Must support**: pagination, sorting, filtering, searching, column visibility, row actions, loading state, empty state.  
**Future**: bulk actions (API shape reserved; UI hidden until enabled).  
**Inputs**: column defs, query-driven data (from TanStack Query), total count, controlled or URL-synced table state.  
**Outputs**: change events for page/sort/filter/search/visibility.  
**A11y**: sortable headers keyboard-operable; row actions reachable by keyboard.

## Forms

**Must support**: Zod schema validation via React Hook Form, inline field errors, submit loading, success feedback (toast or inline), confirmation dialog before destructive/support mutations.  
**Outputs**: typed submit values only when valid.

## Charts

Reusable wrappers (Recharts) for: growth trends, subscription distribution, activity timeline, platform usage, company rankings.  
**Must support**: loading skeleton, empty data, error+retry.  
**Must not**: embed business workflow actions inside charts.

## Dashboard Widgets

Independent composable widgets: Summary Cards, Charts, Recent Activity, Recent Companies, Subscription Status, Growth Metrics, Platform Statistics.  
**Must**: own or receive a dedicated query key; fail in isolation; show skeleton while pending.

## Global Search

**Must**: accept query string; return typed hits; navigate via deepLink; be reachable from shell (not only one page).

## Auth Guards

- **RequireAuth**: redirects unauthenticated users to login.
- **RequireRole**: shows unauthorized when roles insufficient.
- **Credential rule**: never render secrets/tokens/passwords in UI.
