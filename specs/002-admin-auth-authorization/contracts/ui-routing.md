# UI & Routing Contracts: A002 Auth

**Date**: 2026-07-13

## Public routes

| Route purpose | Guard |
|---------------|-------|
| Login | Public; if already authenticated Super Admin → dashboard |
| Forgot password | Public |
| Reset password (includes reset proof) | Public |

## Protected routes

| Route purpose | Guard |
|---------------|-------|
| All Admin Console modules | RequireAuth + RequireRole(Super Admin) |
| Change password | RequireAuth + Super Admin |
| Login history | RequireAuth + Super Admin |
| Unauthorized | Reachable when authenticated without required role |

## Guards

- **RequireAuth**: no valid session → login (preserve return URL)
- **RequireRole(Super Admin)**: missing role → unauthorized
- **Startup gate**: block shell until session hydrate/validate finishes

## Forms

| Form | Required fields | Notes |
|------|-----------------|-------|
| Login | email, password, rememberMe? | Accessible labels; loading disables submit |
| Forgot | email | Generic success always |
| Reset | resetProof, newPassword, confirmPassword | Match + policy |
| Change | currentPassword, newPassword, confirmPassword | Protected |

## Dialogs / states

- Session expired dialog → confirm → login
- Unauthorized state page
- Auth loading screen on startup validation

## Security UI rules

- Never render accessToken, refreshToken, or password values
- Clear sensitive form fields after success where appropriate
- Toasts for success/failure without secrets
