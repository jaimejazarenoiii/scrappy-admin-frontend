# Feature Specification: A002 — Administrator Authentication & Authorization

**Feature Branch**: `002-admin-auth-authorization`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "A002 Administrator Authentication & Authorization — secure sign-in, session, password, and role-gated access for Scrappy Admin Console (business requirements and REST resource contracts only)"

## Vision

Provide a secure authentication and authorization capability that allows only authorized Scrappy administrators to access the Admin Console while protecting sensitive platform information.

Administrator authentication is completely independent from customer authentication.

## Objectives

Authorized administrators MUST be able to:

- Sign in
- Sign out
- Change password
- Request password reset
- Reset password
- Maintain secure sessions
- Access only resources permitted by their role

## Scope Alignment *(mandatory for Admin Console)*

- **Primary actors**: Super Admin (MVP). Future roles (Admin, Support, Finance, Sales, Read Only) are reserved for later specifications and MUST NOT be required for A002 acceptance.
- **In scope**: Administrator account identity attributes; Active/Inactive/Locked status; Super Admin role; sign-in/sign-out; forgot/reset/change password; session create/validate/expire/invalidate; optional Remember Me; failed-login detection and account locking; login history; authorization gate for Admin Console access; REST resource contracts for authentication, session, password reset, password change, and login history.
- **Out of scope (Non-Goals)**: Customer authentication; customer account password flows; company Owner/Manager/Employee access; inventory, transactions, trips, expenses, attendance, payroll, warehouse, POS, or customer daily workflows; MFA, SSO, OAuth providers, magic links, passwordless auth, device management, invitation workflows, temporary passwords, and force-password-change (listed under Future Considerations only).
- **Read vs write**: Authentication and password actions are intentional writes on administrator identity and session state. No customer operational records are modified by this feature.
- **Audit impact**: Every login attempt (success or failure), logout, password change, password reset request, and password reset completion MUST be recorded. Login history captures attempt metadata. Password resets are audited.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign in as Super Admin (Priority: P1)

An Active Super Admin signs in with email and password and gains access to the Admin Console. Inactive or Locked administrators, and any non-administrator identity, are denied.

**Why this priority**: Without successful authentication, no Admin Console capability is usable.

**Independent Test**: Attempt sign-in as Active Super Admin → access granted; attempt as Inactive, Locked, wrong password, or customer identity → access denied and attempt recorded.

**Acceptance Scenarios**:

1. **Given** an Active Super Admin with valid credentials, **When** they sign in, **Then** they receive an authenticated session and may use the Admin Console.
2. **Given** an Inactive or Locked administrator, **When** they attempt to sign in, **Then** access is denied and the attempt is recorded as unsuccessful.
3. **Given** valid-looking credentials that are incorrect, **When** sign-in is attempted, **Then** access is denied without revealing whether the email exists, and the attempt is recorded.
4. **Given** a customer (non-administrator) identity, **When** sign-in is attempted against administrator authentication, **Then** access is denied.

---

### User Story 2 - Maintain and end sessions (Priority: P1)

An authenticated Super Admin continues working under a valid session, is blocked when the session expires or becomes invalid, and can sign out to end the session immediately.

**Why this priority**: Session integrity is required to protect platform data after sign-in.

**Independent Test**: Sign in → access protected resource → wait past inactivity expiry or sign out → protected resource access is denied.

**Acceptance Scenarios**:

1. **Given** a valid session, **When** the administrator requests a protected Admin Console resource, **Then** access is allowed.
2. **Given** an expired or invalidated session, **When** the administrator requests a protected resource, **Then** access is denied and re-authentication is required.
3. **Given** an authenticated administrator, **When** they sign out, **Then** the session is invalidated and cannot be reused.
4. **Given** optional Remember Me was selected at sign-in, **When** the session is otherwise valid, **Then** the session may remain valid for the extended Remember Me duration defined by policy.

---

### User Story 3 - Change password while signed in (Priority: P2)

An authenticated Super Admin changes their password by providing the current password and a new password that meets policy, then continues with a secure session posture consistent with policy.

**Why this priority**: Enables self-service credential hygiene for Active administrators.

**Independent Test**: Sign in → change password with valid current + policy-compliant new password → subsequent sign-in works only with the new password; change is audited.

**Acceptance Scenarios**:

1. **Given** an authenticated Super Admin, **When** they submit a correct current password and a policy-compliant new password, **Then** the password is updated and the change is audited.
2. **Given** an incorrect current password, **When** change is attempted, **Then** the password is not updated and the failure is communicated without exposing other account details.
3. **Given** a new password that violates password policy, **When** change is attempted, **Then** the password is not updated and policy guidance is returned.

---

### User Story 4 - Forgot and reset password (Priority: P2)

A Super Admin who cannot sign in requests a password reset, completes reset with a valid reset proof, and can then sign in with the new password. Reset flows are validated and audited.

**Why this priority**: Recovers access without requiring another administrator for routine credential recovery (within Super Admin MVP).

**Independent Test**: Request reset for known Active admin email → complete reset with valid one-time proof → sign in with new password; invalid/expired proof fails; request and completion are audited.

**Acceptance Scenarios**:

1. **Given** an Active administrator email, **When** a password reset is requested, **Then** a reset opportunity is issued through the configured reset channel and the request is audited.
2. **Given** a valid, unexpired reset proof and a policy-compliant new password, **When** reset is submitted, **Then** the password is updated, prior sessions for that administrator are invalidated, and the completion is audited.
3. **Given** an invalid, reused, or expired reset proof, **When** reset is submitted, **Then** the password is not changed.
4. **Given** an email that is not an Active administrator, **When** reset is requested, **Then** the response does not disclose account existence beyond a generic acknowledgment, and the attempt is recorded appropriately for security monitoring.

---

### User Story 5 - Role-based authorization gate (Priority: P1)

Only authenticated administrators with an allowed role may access Admin Console resources. For MVP, Super Admin is the sole allowed role. Unauthenticated callers are denied.

**Why this priority**: Authorization is the control that keeps the console internal-only.

**Independent Test**: Call protected resources without session → denied; with Super Admin session → allowed; with non-allowed role identity (if present in data) → denied for Admin Console access under A002 rules.

**Acceptance Scenarios**:

1. **Given** no authenticated administrator session, **When** a protected Admin Console resource is requested, **Then** access is denied.
2. **Given** an authenticated Active Super Admin session, **When** a protected resource permitted to Super Admin is requested, **Then** access is allowed.
3. **Given** an authenticated administrator whose role is not Super Admin (future roles not yet productized), **When** Admin Console access is evaluated under A002, **Then** access is denied unless a later specification explicitly grants that role.

### Edge Cases

- Repeated failed sign-in attempts trigger account locking per security policy; Locked administrators cannot sign in until unlocked by an authorized process (unlock workflow outside A002 MVP UI may be operational).
- Sign-in while already authenticated replaces or refreshes session per session rules without granting dual independent sessions that bypass expiry policy.
- Password reset for Inactive or Locked accounts does not grant console access until status is Active.
- Session used after logout is rejected.
- Missing or malformed credentials are rejected with validation errors.
- Concurrent password change and reset: last successful completion wins; both events are audited.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate administrators using email and password credentials that are independent from customer authentication.
- **FR-002**: System MUST allow only administrators with status Active to successfully sign in.
- **FR-003**: System MUST deny sign-in for Inactive and Locked administrators.
- **FR-004**: System MUST support administrator roles, with Super Admin as the only role required for A002 MVP acceptance.
- **FR-005**: System MUST create an authenticated session upon successful sign-in.
- **FR-006**: System MUST validate sessions for protected Admin Console access and deny expired or invalidated sessions.
- **FR-007**: System MUST expire inactive sessions according to configurable session policy.
- **FR-008**: System MUST invalidate the session upon sign-out.
- **FR-009**: System MUST support optional Remember Me at sign-in to apply an extended session duration per policy when selected.
- **FR-010**: System MUST allow an authenticated administrator to change their password when the current password is verified and the new password meets password policy.
- **FR-011**: System MUST support forgot-password request and password reset completion using a time-limited, single-use reset proof.
- **FR-012**: System MUST enforce configurable password policy requirements on password set, change, and reset.
- **FR-013**: System MUST detect consecutive failed login attempts and lock the administrator account when the configured threshold is reached.
- **FR-014**: System MUST record every login attempt with login time, result, and available IP address and browser/device information; successful sessions MUST also support recording logout time when logout occurs.
- **FR-015**: System MUST audit password reset requests and password reset completions.
- **FR-016**: System MUST deny Admin Console access to unauthenticated callers.
- **FR-017**: System MUST authorize Admin Console access based on administrator role; MVP grants access to Super Admin only.
- **FR-018**: System MUST expose REST resources for authentication, session, password reset, password change, and login history as defined in API Contracts.
- **FR-019**: System MUST validate email format, password policy, authentication credentials, session validity, role, and status before accepting related operations.
- **FR-020**: System MUST NOT authenticate customer accounts through administrator authentication resources.

### Key Entities

- **Administrator**: Internal operator identity with full name, email, password credential, role, status (Active | Inactive | Locked), last login, and created date.
- **AdministratorSession**: Authenticated access context bound to an administrator; created at sign-in; subject to inactivity expiry, Remember Me duration when applicable, and invalidation on logout or security events (e.g., password reset).
- **PasswordResetRequest**: Time-limited, single-use proof associated with an administrator for completing password reset.
- **LoginHistoryEntry**: Record of a login attempt or session lifecycle event including login time, logout time (when applicable), IP address (if available), browser/device information (if available), and login result.
- **PasswordPolicy**: Configurable rules that passwords must satisfy (length and complexity minimums as configured by the organization).
- **SecurityPolicy**: Configurable failed-attempt threshold and lock behavior; configurable session inactivity and Remember Me durations.

## API Contracts

Product interface contracts for administrator authentication. These describe purpose and exchange shapes only—not deployment, persistence, or client implementation.

### AUTH-01 Sign In

| Field | Definition |
|-------|------------|
| **Purpose** | Authenticate an Active administrator and create a session |
| **HTTP Method** | `POST` |
| **URI** | `/admin/auth/sign-in` |
| **Required Request** | `email` (string), `password` (string), `rememberMe` (boolean, optional) |
| **Successful Response** | Administrator profile (id, fullName, email, role, status, lastLogin) and session proof sufficient for subsequent authenticated calls |
| **Possible Errors** | `400` validation failed; `401` invalid credentials; `403` inactive or locked; `429` too many attempts |

### AUTH-02 Sign Out

| Field | Definition |
|-------|------------|
| **Purpose** | Invalidate the current administrator session |
| **HTTP Method** | `POST` |
| **URI** | `/admin/auth/sign-out` |
| **Required Request** | Authenticated session |
| **Successful Response** | Confirmation that the session is invalidated |
| **Possible Errors** | `401` missing or invalid session |

### AUTH-03 Session Validation / Current Administrator

| Field | Definition |
|-------|------------|
| **Purpose** | Validate the current session and return the authenticated administrator |
| **HTTP Method** | `GET` |
| **URI** | `/admin/auth/session` |
| **Required Request** | Authenticated session |
| **Successful Response** | Administrator profile and session validity metadata (e.g., expiry-related indicators without exposing secrets) |
| **Possible Errors** | `401` missing, expired, or invalidated session |

### AUTH-04 Change Password

| Field | Definition |
|-------|------------|
| **Purpose** | Change password for the authenticated administrator |
| **HTTP Method** | `POST` |
| **URI** | `/admin/auth/change-password` |
| **Required Request** | Authenticated session; `currentPassword`; `newPassword` |
| **Successful Response** | Confirmation that the password was changed |
| **Possible Errors** | `400` policy/validation failure; `401` unauthenticated or current password incorrect; `403` inactive/locked |

### AUTH-05 Request Password Reset

| Field | Definition |
|-------|------------|
| **Purpose** | Start forgot-password flow for an administrator email |
| **HTTP Method** | `POST` |
| **URI** | `/admin/auth/password-reset/request` |
| **Required Request** | `email` |
| **Successful Response** | Generic acknowledgment (does not disclose whether the email is an Active administrator) |
| **Possible Errors** | `400` validation failed; `429` too many requests |

### AUTH-06 Complete Password Reset

| Field | Definition |
|-------|------------|
| **Purpose** | Complete password reset using a valid reset proof |
| **HTTP Method** | `POST` |
| **URI** | `/admin/auth/password-reset/complete` |
| **Required Request** | `resetProof` (opaque one-time value), `newPassword` |
| **Successful Response** | Confirmation that the password was reset and prior sessions invalidated |
| **Possible Errors** | `400` policy/validation failure; `401` invalid, reused, or expired reset proof; `403` account not eligible |

### AUTH-07 Login History (list)

| Field | Definition |
|-------|------------|
| **Purpose** | Retrieve login history for security review (Super Admin) |
| **HTTP Method** | `GET` |
| **URI** | `/admin/auth/login-history` |
| **Required Request** | Authenticated Super Admin session; optional filters (`administratorId`, date range, result); pagination parameters |
| **Successful Response** | Paginated login history entries (login time, logout time if any, IP if available, browser/device if available, result, administrator identifiers as appropriate) |
| **Possible Errors** | `401` unauthenticated; `403` not Super Admin; `400` invalid filters |

## Validation Rules

| Area | Rules |
|------|--------|
| **Email** | Required; must be a well-formed email address; used as administrator sign-in identifier |
| **Password** | Required on sign-in, change, and reset; MUST satisfy configured password policy (minimum length and complexity) |
| **Authentication** | Email + password MUST match an Active administrator; customer credentials MUST NOT succeed |
| **Session** | Protected operations require a present, non-expired, non-invalidated session bound to an Active administrator |
| **Role** | MVP protected Admin Console access requires role Super Admin |
| **Status** | Only Active may authenticate; Inactive and Locked MUST fail authentication even with correct password |

## Business Rules

1. Only Active administrators may authenticate.
2. Inactive or Locked administrators cannot access the Admin Console.
3. Administrator authentication is separate from customer authentication.
4. Every login attempt is recorded.
5. Password resets are audited.
6. Permissions are determined by administrator role; A002 grants console access to Super Admin only.
7. Successful password reset invalidates existing sessions for that administrator.
8. Account locking after failed attempts prevents further successful authentication until the account is no longer Locked.

## Acceptance Criteria

- **AC-001**: An Active Super Admin can sign in with valid credentials and access the Admin Console within 5 seconds under normal operating conditions.
- **AC-002**: 100% of sign-in attempts with Inactive or Locked status are denied.
- **AC-003**: 100% of unauthenticated requests to protected Admin Console resources are denied.
- **AC-004**: After sign-out, the prior session is rejected on 100% of subsequent protected requests tested.
- **AC-005**: Inactive sessions expire per configured policy and cannot be used afterward.
- **AC-006**: Password change succeeds only when current password is correct and new password meets policy; failures leave the prior password unchanged.
- **AC-007**: Password reset completes only with a valid unexpired single-use proof; completion is audited and prior sessions are invalidated.
- **AC-008**: 100% of login attempts produce a login history record including result and login time.
- **AC-009**: Failed login attempts reaching the configured threshold result in Locked status and denied sign-in.
- **AC-010**: Customer credentials cannot authenticate through administrator authentication resources in 100% of tested cases.
- **AC-011**: All AUTH-01 through AUTH-07 resources behave per their Purpose, Method, URI, request, success, and error contracts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authorized Super Admins can sign in and reach an authenticated Admin Console state in under 5 seconds under normal conditions.
- **SC-002**: Unauthorized parties (wrong password, Inactive/Locked, customer identity, missing session) are denied in 100% of verification cases.
- **SC-003**: Session end conditions (logout, expiry, post-reset invalidation) prevent continued access in 100% of verification cases.
- **SC-004**: Security reviewers can retrieve login history for investigated administrators with timestamps and results for 100% of recorded attempts in the retention window.
- **SC-005**: Password self-service (change and reset) completes successfully for eligible Active Super Admins on the first correct attempt in at least 95% of moderated acceptance trials.
- **SC-006**: No verified case exists where a customer account gains Admin Console access through administrator authentication.

## Future Considerations

Future versions MAY introduce without redesigning the authentication model:

- Multi-factor authentication
- Single sign-on
- OAuth providers
- Magic links
- Session management dashboard
- Device management
- Administrator invitations
- Trusted devices
- Passwordless authentication
- Temporary passwords
- Force password change
- Additional roles (Admin, Support, Finance, Sales, Read Only)

## Assumptions

- Sign-in uses email and password as the MVP credential pair.
- A configured password policy exists (at minimum: minimum length and at least one complexity rule) and is organization-manageable.
- Default security posture: lock after several consecutive failed attempts (commonly five) until an authorized unlock restores Active status; exact threshold is configurable.
- Default session inactivity expiry is on the order of tens of minutes and is configurable; Remember Me extends duration per a separate configurable policy when opted in.
- Password reset uses a time-limited single-use proof delivered through the organization’s configured administrator notification channel (typically email).
- Login history retains records for operational security review; long-term retention limits may be defined in a later compliance specification.
- Unlocking a Locked administrator is an operational/admin-management concern that may be specified fully in a later administrator-management feature; A002 requires lock-on-threshold and deny-while-Locked behavior.
- A001 foundation console exists as the consuming surface; this specification defines the authentication and authorization product capability and backend REST contracts those surfaces rely on.

## Constraints

- Business requirements and REST resource contracts only.
- No implementation details, frameworks, middleware, project structure, database design, testing strategy, or code examples.
- This specification defines Administrator Authentication & Authorization only.
