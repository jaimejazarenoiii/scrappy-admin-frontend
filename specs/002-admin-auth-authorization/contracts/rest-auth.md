# REST Contracts: A002 Admin Auth (Frontend Integration)

**Date**: 2026-07-13  
**Source of truth**: [spec.md](../spec.md) AUTH-01–AUTH-07  
**Auth header**: `Authorization: Bearer <access_token>` when authenticated

## AUTH-01 Sign In

- **Method/URI**: `POST /admin/auth/sign-in`
- **Body**: `{ email, password, rememberMe? }`
- **200**: `{ administrator, accessToken, refreshToken?, expiresAt? }` (exact field names follow API; tokens never shown in UI)
- **Errors**: 400, 401, 403 (inactive/locked), 429

## AUTH-02 Sign Out

- **Method/URI**: `POST /admin/auth/sign-out`
- **200**: `{ success: true }` or empty confirmation
- **Errors**: 401

## AUTH-03 Session

- **Method/URI**: `GET /admin/auth/session`
- **200**: `{ administrator, session: { valid, expiresAt? } }`
- **Errors**: 401

## AUTH-04 Change Password

- **Method/URI**: `POST /admin/auth/change-password`
- **Body**: `{ currentPassword, newPassword }`
- **200**: confirmation
- **Errors**: 400, 401, 403

## AUTH-05 Request Password Reset

- **Method/URI**: `POST /admin/auth/password-reset/request`
- **Body**: `{ email }`
- **200**: generic acknowledgment
- **Errors**: 400, 429

## AUTH-06 Complete Password Reset

- **Method/URI**: `POST /admin/auth/password-reset/complete`
- **Body**: `{ resetProof, newPassword }`
- **200**: confirmation (sessions invalidated server-side)
- **Errors**: 400, 401, 403

## AUTH-07 Login History

- **Method/URI**: `GET /admin/auth/login-history`
- **Query**: `administratorId?`, `from?`, `to?`, `result?`, `page?`, `pageSize?`
- **200**: paginated `{ items: LoginHistoryEntry[], total, page, pageSize }`
- **Errors**: 400, 401, 403

## Token refresh (supporting)

If Scrappy exposes a refresh resource (commonly `POST /admin/auth/refresh`), the frontend refresh queue MUST use it. Exact URI confirmed against live API docs during implementation; behavior: exchange refresh → new access (and rotated refresh if issued).

## Error envelope (expected)

```text
{ code: string, message: string, details?: object }
```

Frontend maps `code`/`status` to UX messages without leaking whether an email exists (except explicit 403 inactive/locked when safe).
