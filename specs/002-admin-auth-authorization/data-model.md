# Data Model: A002 — Administrator Authentication & Authorization

**Date**: 2026-07-13  
**Note**: Conceptual client-facing domain model mirroring AUTH resources. Authoritative persistence and hashing live on Scrappy API—not specified here.

## Entities

### Administrator (auth profile)

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| fullName | string | |
| email | string | Sign-in identifier |
| role | `super_admin` (MVP) | Extensible string/enum later |
| status | `active` \| `inactive` \| `locked` | |
| lastLogin | datetime \| null | |
| createdDate | datetime | |

Password is never a client entity field after submission.

**Validation**: email well-formed; status Active required to establish session; role Super Admin required for A002 console access.

**Relationships**: owns Sessions; produces LoginHistoryEntry records (server-side); may have PasswordResetRequest.

---

### AdministratorSession (client shell)

| Field | Type | Notes |
|-------|------|-------|
| accessToken | opaque | Not rendered |
| refreshToken | opaque \| cookie-managed | Not rendered |
| administrator | Administrator | Profile snapshot |
| authenticated | boolean | |
| hydrated | boolean | Startup complete |
| rememberMe | boolean | Affects persistence choice |
| expiresAt | datetime \| null | If provided by API |

**State transitions**:
- anonymous → authenticating → authenticated
- authenticated → refreshing → authenticated | anonymous
- authenticated → signed_out → anonymous
- authenticated → expired → anonymous (via dialog/redirect)

---

### PasswordResetRequest (client view)

| Field | Type | Notes |
|-------|------|-------|
| resetProof | opaque string | From email link / query |
| email | string | Only on request step |

No long-term client storage of proofs after completion.

---

### LoginHistoryEntry

| Field | Type | Notes |
|-------|------|-------|
| id | string | |
| administratorId | string | |
| loginTime | datetime | |
| logoutTime | datetime \| null | |
| ipAddress | string \| null | If available |
| browserDevice | string \| null | If available |
| result | `success` \| `failure` \| … | Per API enumeration |

**Validation**: read-only on client; append-only on server.

---

### AuthForm models (validation only)

- **SignIn**: email, password, rememberMe?
- **ForgotPassword**: email
- **ResetPassword**: resetProof, newPassword, confirmPassword
- **ChangePassword**: currentPassword, newPassword, confirmPassword

## Status & role rules

```text
status: active ──sign-in allowed──► session
status: inactive | locked ──sign-in denied──► no session

role (MVP): super_admin ──console allowed
role (other/future): console denied under A002
```

## Relationship summary

```text
Administrator ──creates──► AdministratorSession
Administrator ──has──► LoginHistoryEntry[]
Administrator ──may have──► PasswordResetRequest (time-limited)
```
