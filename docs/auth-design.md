# Authentication And Authorization Design

## Purpose

This document defines the first authentication and authorization model for the backend.

The design is intentionally simple:

- Users sign in with `email` and `password`.
- Passwords are stored as bcrypt hashes.
- The API issues JWT access tokens after login.
- Authorization is role-based.
- Roles are stored separately from users and assigned through `roleIds`.

This is the baseline for v1. It avoids external identity providers and keeps the implementation local to the service.

## Goals

- Add user authentication without changing the current Fastify plugin architecture.
- Keep authorization checks centralized and readable.
- Store only password hashes, never plaintext passwords.
- Make the auth flow easy to test with Fastify injection tests.
- Keep the design compatible with future migration to a managed identity provider.

## Non-goals

- Refresh tokens.
- Session cookies.
- Password reset flows.
- MFA.
- Social login.
- Multi-tenant policy enforcement.

## Data Model

### User

The user record will gain a password hash field:

- `passwordHash: string`

This field stores the bcrypt hash for the user password.

### Role

Roles remain the authorization unit.

Current role data should stay focused on:

- `id`
- `name`
- timestamps
- version

Role-based access rules will be defined in code, not stored as free-form permissions.

### JWT Claims

The access token should include the minimum information needed for request authorization:

- `sub`: user id
- `email`
- `roleIds`
- `iat`
- `exp`

The token should not contain the password hash or any sensitive data.

## Authentication Flow

### Register or seed a user

The system must create a bcrypt hash before persisting a password.

Recommended bcrypt settings:

- use bcrypt with a cost factor that is reasonable for Lambda and local development
- keep the cost configurable through environment variables if needed later

### Login

1. Client sends `email` and `password`.
2. API loads the user by email.
3. API compares the supplied password with the stored bcrypt hash.
4. If valid, API issues a signed JWT access token.
5. API returns the token to the client.

### Request authentication

For protected endpoints:

1. Read the `Authorization: Bearer <token>` header.
2. Verify the JWT signature and expiry.
3. Load the user identity from the token claims.
4. Attach the authenticated principal to the request context.

If the token is missing or invalid, the request should fail with `401 Unauthorized`.

## Authorization Model

Authorization is role-based.

The effective permissions for a user come from:

- the user’s `roleIds`
- the role records associated with those ids

The first implementation should enforce access through explicit role checks in code.

Recommended shape:

- define named roles such as `admin`, `user`, and `support` if needed
- define route-level guards like `requireRole('admin')`
- apply guards at the route level or plugin level, not inside business services

This keeps authorization visible near the HTTP surface.

## Route Protection Strategy

Use the current Fastify plugin structure:

- authentication hook/plugin attaches `request.principal`
- authorization helper checks the principal’s roles
- protected routes declare the required role

Example policy levels:

- public: no auth required
- authenticated: valid JWT required
- role-gated: valid JWT plus at least one required role

## Error Handling

Auth errors should use the existing global error handler style.

Expected responses:

- `401` for missing/invalid tokens or invalid credentials
- `403` for authenticated users missing required role membership

Responses should stay consistent with the rest of the API:

- `code`
- `message`
- `statusCode`
- `requestId`

## Storage And Security Notes

- Passwords must be stored only as bcrypt hashes.
- JWT signing secret must come from config, not code.
- Authorization headers must stay redacted in logs.
- User lookups for login should be by email.
- Role lookup should be by `roleIds`, not by scanning.

## Suggested Implementation Order

1. Add `passwordHash` to user storage and domain mapping.
2. Add auth endpoints:
   - `POST /auth/login`
3. Add JWT verification plugin and request principal.
4. Add role-based authorization helper.
5. Protect selected CRUD routes.
6. Add auth and RBAC tests.

## Open Questions

- Whether login should return only an access token or also a minimal user payload.
- Whether user creation should happen through an admin-only route or a separate registration flow.
- Whether `admin` should be a reserved role name or just a convention.
- Whether bcrypt cost should be fixed in config for v1.

