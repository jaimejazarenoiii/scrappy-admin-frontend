# REST Contracts: A004 — Platform Management

**Date**: 2026-07-13  
**Source of truth**: [spec.md](../spec.md) API Contracts  
**Auth**: Authenticated administrator (MVP Super Admin). 401/403 as noted.

Base path prefix: `/admin`

## Companies (PM-CO)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-CO-01 | GET | `/companies` | Paginated companies | 400, 401, 403 |
| PM-CO-02 | POST | `/companies` | Created company | 400, 401, 403, 409 |
| PM-CO-03 | GET | `/companies/{id}` | Company details | 401, 403, 404 |
| PM-CO-04 | PATCH | `/companies/{id}` | Updated company | 400, 401, 403, 404, 409 |
| PM-CO-05 | POST | `/companies/{id}/activate` | Updated company | 400, 401, 403, 404 |
| PM-CO-06 | POST | `/companies/{id}/deactivate` | Updated company | 400, 401, 403, 404 |
| PM-CO-07 | GET | `/companies/{id}/statistics` | Monitoring statistics | 401, 403, 404 |
| PM-CO-08 | GET | `/companies/{id}/timeline` | Timeline events | 401, 403, 404 |
| PM-CO-09 | GET | `/companies/{id}/notes` | Notes list | 401, 403, 404 |
| PM-CO-10 | POST | `/companies/{id}/notes` | Created note | 400, 401, 403, 404 |

## Company Owners (PM-OW)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-OW-01 | GET | `/companies/{companyId}/owners` | Paginated owners | 400, 401, 403, 404 |
| PM-OW-02 | POST | `/companies/{companyId}/owners` | Created owner | 400, 401, 403, 404, 409 |
| PM-OW-03 | GET | `/owners/{id}` | Owner profile | 401, 403, 404 |
| PM-OW-04 | PATCH | `/owners/{id}` | Updated owner | 400, 401, 403, 404, 409 |
| PM-OW-05 | POST | `/owners/{id}/activate` | Updated owner | 400, 401, 403, 404 |
| PM-OW-06 | POST | `/owners/{id}/deactivate` | Updated owner | 400, 401, 403, 404 |
| PM-OW-07 | POST | `/owners/{id}/lock` | Updated owner | 400, 401, 403, 404 |
| PM-OW-08 | POST | `/owners/{id}/unlock` | Updated owner | 400, 401, 403, 404 |
| PM-OW-09 | GET | `/owners/{id}/login-history` | Paginated history | 401, 403, 404 |
| PM-OW-10 | GET | `/owners/{id}/activity-summary` | Summary | 401, 403, 404 |

## Administrators (PM-AD)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-AD-01 | GET | `/administrators` | Paginated admins | 400, 401, 403 |
| PM-AD-02 | POST | `/administrators` | Created admin | 400, 401, 403, 409 |
| PM-AD-03 | GET | `/administrators/{id}` | Profile | 401, 403, 404 |
| PM-AD-04 | PATCH | `/administrators/{id}` | Updated admin | 400, 401, 403, 404, 409 |
| PM-AD-05 | POST | `/administrators/{id}/activate` | Updated admin | 400, 401, 403, 404 |
| PM-AD-06 | POST | `/administrators/{id}/deactivate` | Updated admin | 400, 401, 403, 404 |
| PM-AD-07 | POST | `/administrators/{id}/lock` | Updated admin | 400, 401, 403, 404 |
| PM-AD-08 | POST | `/administrators/{id}/unlock` | Updated admin | 400, 401, 403, 404 |
| PM-AD-09 | GET | `/administrators/{id}/login-history` | Paginated history | 401, 403, 404 |
| PM-AD-10 | GET | `/administrators/{id}/activity` | Paginated activity | 401, 403, 404 |

## Subscriptions (PM-SU)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-SU-01 | GET | `/subscriptions` | Paginated subscriptions | 400, 401, 403 |
| PM-SU-02 | GET | `/subscriptions/{id}` | Detail + history summary | 401, 403, 404 |
| PM-SU-03 | POST | `/subscriptions` | Created | 400, 401, 403, 404, 409 |
| PM-SU-04 | POST | `/subscriptions/{id}/renew` | Updated | 400, 401, 403, 404 |
| PM-SU-05 | POST | `/subscriptions/{id}/suspend` | Updated | 400, 401, 403, 404 |
| PM-SU-06 | POST | `/subscriptions/{id}/expire` | Updated | 400, 401, 403, 404 |
| PM-SU-07 | GET | `/subscriptions/{id}/notes` | Notes | 401, 403, 404 |
| PM-SU-08 | POST | `/subscriptions/{id}/notes` | Created note | 400, 401, 403, 404 |
| PM-SU-09 | GET | `/companies/{companyId}/subscriptions` | History list | 401, 403, 404 |

## Password Reset (PM-PW)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-PW-01 | POST | `/owners/{id}/password-reset` | Ack (no secrets) | 400, 401, 403, 404 |
| PM-PW-02 | POST | `/administrators/{id}/password-reset` | Ack (no secrets) | 400, 401, 403, 404 |

## Reports (PM-RP)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-RP-01 | GET | `/reports` | Report catalog | 401, 403 |
| PM-RP-02 | POST | `/reports/{reportKey}/run` | Informational result | 400, 401, 403, 404 |

## Activity (PM-AC)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-AC-01 | GET | `/activity` | Paginated immutable entries | 400, 401, 403 |

## Search (PM-SE)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-SE-01 | GET | `/search` | Paginated SearchResult | 400, 401, 403 |

## Settings (PM-ST)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-ST-01 | GET | `/settings` | Settings groups | 401, 403 |
| PM-ST-02 | PATCH | `/settings/{key}` | Updated setting | 400, 401, 403, 404 |

## Exports (PM-EX)

| ID | Method | URI | Success | Errors |
|----|--------|-----|---------|--------|
| PM-EX-01 | POST | `/exports` | Export job accepted | 400, 401, 403, 429 |
| PM-EX-02 | GET | `/exports/{id}` | Status + download ref | 401, 403, 404 |

## Client obligations

1. Attach access token; handle 401 via A002 refresh.
2. Never render password fields from PM-PW responses.
3. Do not offer mutate/delete for activity entries.
4. Map 409 conflicts and transition 400s to user-visible validation.
5. Poll PM-EX-02 while job pending/running.
