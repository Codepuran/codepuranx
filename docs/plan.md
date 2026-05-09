# Fastify Project Execution Plan

This plan turns the wishlist into a logical implementation sequence. It is designed to be updated as work progresses.

## Tracking Method

Status values:

- `TODO`: Not started.
- `DISCUSS`: Needs a decision before implementation.
- `READY`: Decision made, ready to implement.
- `DOING`: Currently being implemented.
- `BLOCKED`: Cannot proceed without external input or dependency.
- `DONE`: Implemented and verified.
- `DEFERRED`: Intentionally postponed.

Priority values:

- `P0`: Required for the initial foundation.
- `P1`: Required for the first usable CRUD version.
- `P2`: Important hardening or developer experience.
- `P3`: Future improvement.

Each task should be updated with:

- Status.
- Owner, if needed.
- Decision notes, if a decision was made.
- Verification notes, once completed.

## Phase 0: Repository Baseline

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 0.1 | Confirm repo starts clean and intentionally has no Git history | DONE | P0 | None | Verified no `.git` repo exists; workspace contains `docs/plan.md`, `docs/wishlist.md`, and Codex metadata |
| 0.2 | Decide whether to initialize Git now or after first scaffold | DONE | P0 | 0.1 | Git initialized now with `main` as baseline branch and `dev` as regular coding branch |
| 0.3 | Create initial `.gitignore` | DONE | P0 | 0.2 | Ignores Node dependencies, build output, env files, coverage, logs, editor files, and Codex metadata |
| 0.4 | Create initial `README.md` placeholder | DONE | P2 | 0.2 | Explains project purpose and links planning docs |
| 0.5 | Keep `docs/wishlist.md` as the source of debated requirements | DONE | P0 | None | Wishlist exists |
| 0.6 | Keep `docs/plan.md` as the source of execution tracking | DONE | P0 | None | Plan exists |

## Phase 1: Key Architecture Decisions

These decisions should be made before scaffolding so the first implementation does not fight the foundation.

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Confirm current Fastify latest/LTS version and compatibility policy | DONE | P0 | None | Use Fastify `5.8.x`; verified latest docs list v5.8.x |
| 1.2 | Confirm Node.js LTS target | DONE | P0 | None | Use Node.js `24.x`; manage local version with nvm |
| 1.3 | Decide package manager: npm, pnpm, or yarn | DONE | P0 | None | Use npm and commit `package-lock.json` |
| 1.4 | Decide module format: ESM or CommonJS | DONE | P0 | 1.2 | Use ESM |
| 1.5 | Decide project structure: Fastify plugins plus routes/services/repositories vs strict MVC | DONE | P0 | None | Use Fastify plugin architecture with routes, services, and repositories |
| 1.6 | Decide dependency injection approach | DONE | P0 | 1.5 | Use Fastify-native plugins, decorators, and encapsulation first; avoid external DI container for v1 |
| 1.7 | Decide validation approach: Fastify JSON Schema, Zod, Joi, or hybrid | DONE | P0 | 1.1 | Use Fastify-native JSON Schema validation with Ajv and response serialization |
| 1.8 | Decide testing framework: Jest, Vitest, or Node test runner | DONE | P0 | 1.3 | Use Jest |
| 1.9 | Decide linting and formatting stack: ESLint/Prettier or Biome | DONE | P0 | 1.3 | Use Biome |
| 1.10 | Decide build tool: `tsc`, `tsup`, `esbuild`, or SWC | DONE | P0 | 1.4 | Use SWC for fast transpilation and `tsc --noEmit` for type checking |
| 1.11 | Decide DynamoDB table model: single-table or multi-table for v1 | DONE | P0 | None | Use single-table design with primary key attributes `pk` and `sk` |
| 1.12 | Decide auth strategy for v1: local JWT, API key, Cognito-compatible stub, or deferred | DONE | P1 | None | Use local JWT for v1 |
| 1.13 | Decide RBAC scope for v1 | DONE | P1 | 1.12 | Implement role checks now |
| 1.14 | Decide API versioning strategy | DONE | P1 | 1.5 | Use `/api/v1` prefix |
| 1.15 | Decide OpenAPI documentation timing | DONE | P2 | 1.7 | Include OpenAPI from day one |

## Phase 2: Project Scaffold

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Initialize Node project | DONE | P0 | 1.3 | `package.json` created with npm |
| 2.2 | Add runtime dependencies | DONE | P0 | 1.1, 1.7, 1.11, 1.12 | Fastify 5.8.x, Pino, AWS SDK DynamoDB packages, JWT, and OpenAPI packages installed |
| 2.3 | Add development dependencies | DONE | P0 | 1.8, 1.9, 1.10 | TypeScript, Jest, Biome, SWC, tsx, and Node/Jest types installed |
| 2.4 | Add TypeScript config | DONE | P0 | 1.4 | Strict ESM/NodeNext `tsconfig.json` exists |
| 2.5 | Add Node version file | DONE | P0 | 1.2 | `.nvmrc` pins `v24.11.1` |
| 2.6 | Add package scripts | DONE | P0 | 2.1 | `dev`, `build`, `start`, `test`, `typecheck`, `lint`, `format`, and `check` scripts exist |
| 2.7 | Create base source folders | DONE | P0 | 1.5 | `src` plugin-oriented structure exists |
| 2.8 | Create test folder structure | DONE | P1 | 1.8 | Unit, integration, and helper test directories exist |
| 2.9 | Add environment example file | DONE | P1 | 1.11 | `.env.example` documents local API, DynamoDB, JWT, and OpenAPI variables |

## Phase 3: Fastify App Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Create app factory that builds Fastify without listening | DONE | P0 | 2.7 | `buildApp()` creates a Fastify instance and is covered by injection tests |
| 3.2 | Create local server entrypoint | DONE | P0 | 3.1 | `src/server.ts` starts the app through the `dev`/`start` scripts |
| 3.3 | Configure Fastify logger using Pino | DONE | P0 | 3.1 | App factory accepts Fastify/Pino logger options; local server sets level and redaction |
| 3.4 | Configure request IDs and correlation ID behavior | DONE | P1 | 3.3 | `x-request-id` and `x-correlation-id` response headers are set globally |
| 3.5 | Add global error handler | DONE | P0 | 3.1 | Errors return consistent JSON with code, message, statusCode, and requestId |
| 3.6 | Add not-found handler | DONE | P1 | 3.1 | Unknown routes return consistent `ROUTE_NOT_FOUND` response |
| 3.7 | Add health route | DONE | P0 | 3.1 | `GET /health` returns `{ "status": "ok" }` |
| 3.8 | Register core plugins in deterministic order | DONE | P0 | 3.1 | Error handlers, request context, health, and API routes register in app factory order |
| 3.9 | Define API route prefix | DONE | P1 | 1.14, 3.1 | v1 routes are registered under `/api/v1` |
| 3.10 | Add graceful shutdown for local server | DONE | P2 | 3.2 | Local server handles `SIGINT` and `SIGTERM` by closing Fastify |

## Phase 4: Configuration Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Define environment variable list | DONE | P0 | 1.11, 1.12 | Required and optional variables documented in `.env.example` and `docs/configuration.md` |
| 4.2 | Add config module | DONE | P0 | 4.1 | `src/config` centralizes config loading and logger options |
| 4.3 | Add environment validation | DONE | P0 | 1.7, 4.2 | Invalid required values, enum values, and port values fail fast |
| 4.4 | Separate local/test/Lambda config expectations | DONE | P1 | 4.2 | `docs/configuration.md` documents local, test, and Lambda expectations |
| 4.5 | Ensure sensitive config is not logged | DONE | P1 | 3.3, 4.2 | Logger options redact auth headers, cookies, and JWT secret paths |

## Phase 5: Validation Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Add request validation mechanism | DONE | P0 | 1.7, 3.1 | Fastify JSON Schema validation is active for params and ready for body/query schemas |
| 5.2 | Add response schema strategy | DONE | P1 | 1.7, 5.1 | Health and API info routes use exported response schemas |
| 5.3 | Standardize validation error format | DONE | P0 | 3.5, 5.1 | Validation failures return `VALIDATION_ERROR` with requestId, statusCode, and details |
| 5.4 | Decide schema-to-type workflow | DONE | P1 | 1.7 | Use `json-schema-to-ts` to infer TypeScript types from JSON Schema |
| 5.5 | Add common reusable schema primitives | DONE | P2 | 5.1 | Common ID params, pagination query, timestamp, and error response schemas exist |

## Phase 6: DynamoDB Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 6.1 | Document DynamoDB access patterns for Todos, Users, Roles | DONE | P0 | 1.11 | `docs/dynamodb.md` lists v1 access patterns |
| 6.2 | Design table keys and indexes | DONE | P0 | 6.1 | Single-table design uses only `pk` and `sk`; no GSIs in v1 |
| 6.3 | Add DynamoDB client factory | DONE | P0 | 2.2, 4.2 | `src/db/client.ts` creates local/AWS DynamoDB clients from config |
| 6.4 | Add DynamoDB document client wrapper if chosen | DONE | P0 | 6.3 | Document client wrapper removes low-level marshalling noise |
| 6.5 | Add table creation/setup script for local development | DONE | P1 | 6.2 | `npm run dynamo:setup` creates a local-compatible `pk`/`sk` table |
| 6.6 | Add DynamoDB health/check script | DONE | P1 | 6.3 | `npm run dynamo:check` describes the configured table |
| 6.7 | Define repository error mapping | DONE | P0 | 3.5, 6.3 | `src/db/errors.ts` maps common DynamoDB errors to repository errors |
| 6.8 | Add pagination helpers | DONE | P1 | 6.3 | Cursor encode/decode and limit normalization helpers exist |
| 6.9 | Avoid scans in normal CRUD paths | DONE | P0 | 6.2 | v1 design explicitly avoids scans and only supports primary-key access patterns |

## Phase 7: Domain Model And Data Access

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 7.1 | Define Todo domain model | DONE | P1 | 5.4, 6.1 | Todo type exists with status, timestamps, and version |
| 7.2 | Define User domain model | DONE | P1 | 5.4, 6.1 | User type exists with email, roles, timestamps, and version |
| 7.3 | Define Role domain model | DONE | P1 | 5.4, 6.1 | Role type exists with permissions, timestamps, and version |
| 7.4 | Define persistence record shapes | DONE | P1 | 6.2, 7.1, 7.2, 7.3 | DynamoDB record shapes exist for User, Role, Todo, and email uniqueness guard |
| 7.5 | Add mappers between domain and persistence records | DONE | P1 | 7.4 | Repository record mappers are explicit in `src/repositories/records.ts` |
| 7.6 | Create Todo repository | DONE | P1 | 6.7, 7.5 | Todo create/get/list-by-user/update/delete operations implemented |
| 7.7 | Create User repository | DONE | P1 | 6.7, 7.5 | User create/get/update/delete-by-id operations implemented; list is intentionally out of v1 |
| 7.8 | Create Role repository | DONE | P1 | 6.7, 7.5 | Role create/get/update/delete-by-id operations implemented; list is intentionally out of v1 |
| 7.9 | Add conditional create/update/delete behavior | DONE | P1 | 7.6, 7.7, 7.8 | Repositories use conditional writes for duplicates and missing records |
| 7.10 | Add timestamps and versioning strategy | DONE | P1 | 7.4 | Records include `createdAt`, `updatedAt`, and incrementing `version` |

## Phase 8: Services And Dependency Injection

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 8.1 | Implement DI registration approach | DONE | P0 | 1.6, 3.1 | `createAppDependencies()` and dependency plugin expose app services through decorators |
| 8.2 | Add TypeScript module augmentation if using Fastify decorators | DONE | P0 | 8.1 | `appConfig`, `dynamo`, `repositories`, and `services` decorators are typed |
| 8.3 | Create Todo service | DONE | P1 | 7.6, 8.1 | Todo create/get/list/update/delete service operations implemented |
| 8.4 | Create User service | DONE | P1 | 7.7, 8.1 | User create/get/update/delete service operations implemented |
| 8.5 | Create Role service | DONE | P1 | 7.8, 8.1 | Role create/get/update/delete service operations implemented |
| 8.6 | Keep service layer independent from HTTP details | DONE | P1 | 8.3, 8.4, 8.5 | Services depend on repository ports and are unit tested without Fastify |
| 8.7 | Define domain-level errors | DONE | P1 | 8.3, 8.4, 8.5 | `DomainError` codes are mapped by services and the global error handler |

## Phase 9: Authentication And RBAC

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 9.1 | Define v1 auth model | DEFERRED | P1 | 1.12 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.2 | Add auth plugin/hook | DEFERRED | P1 | 9.1, 3.8 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.3 | Add request principal type | DEFERRED | P1 | 9.2 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.4 | Define permissions | DEFERRED | P1 | 1.13 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.5 | Define role-to-permission mapping | DEFERRED | P1 | 9.4 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.6 | Add authorization helper/decorator | DEFERRED | P1 | 9.2, 9.5 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.7 | Apply RBAC to CRUD routes | DEFERRED | P1 | 9.6, 10.1 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |
| 9.8 | Add auth/RBAC tests | DEFERRED | P1 | 9.7, 12.1 | Deferred for initial unauthenticated CRUD; revisit before production/Lambda exposure |

## Phase 10: HTTP Routes And Controllers

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 10.1 | Create route/controller structure | DONE | P1 | 1.5, 3.9, 8.1 | `routes/users.ts`, `routes/roles.ts`, and `routes/todos.ts` register under `/api/v1` |
| 10.2 | Add Todo create route | DONE | P1 | 5.1, 8.3, 10.1 | `POST /users/:userId/todos` creates a todo with a server-generated id |
| 10.3 | Add Todo get route | DONE | P1 | 5.1, 8.3, 10.1 | `GET /users/:userId/todos/:todoId` returns one todo |
| 10.4 | Add Todo list route | DONE | P1 | 5.1, 8.3, 10.1 | `GET /users/:userId/todos` lists todos for one user with cursor pagination |
| 10.5 | Add Todo update route | DONE | P1 | 5.1, 8.3, 10.1 | `PATCH /users/:userId/todos/:todoId` updates one todo |
| 10.6 | Add Todo delete route | DONE | P1 | 5.1, 8.3, 10.1 | `DELETE /users/:userId/todos/:todoId` returns `204` |
| 10.7 | Add User CRUD routes | DONE | P1 | 5.1, 8.4, 10.1 | User create/get/update/delete routes exist; no list route because no scans/GSIs |
| 10.8 | Add Role CRUD routes | DONE | P1 | 5.1, 8.5, 10.1 | Role create/get/update/delete routes exist; no list route because no scans/GSIs |
| 10.9 | Standardize success response shapes | DONE | P1 | 10.2 | Create returns `201`, reads/updates return resource JSON, deletes return `204` |
| 10.10 | Ensure route-level schemas are complete | DONE | P1 | 10.2, 10.7, 10.8 | Body, params, query, and response schemas exist for CRUD routes |

## Phase 11: Lambda Readiness

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 11.1 | Add Lambda handler entrypoint | DEFERRED | P1 | 3.1, 1.10 | Deferred until after local CRUD/manual testing |
| 11.2 | Ensure app initialization is reusable across invocations | DEFERRED | P1 | 11.1 | Deferred until after local CRUD/manual testing |
| 11.3 | Confirm Fastify adapter package and behavior | DEFERRED | P1 | 1.1, 11.1 | Deferred until after local CRUD/manual testing |
| 11.4 | Ensure DynamoDB client reuse across invocations | DEFERRED | P1 | 6.3, 11.1 | Deferred until after local CRUD/manual testing |
| 11.5 | Add Lambda-focused build output | DEFERRED | P1 | 1.10, 11.1 | Deferred until after local CRUD/manual testing |
| 11.6 | Add Lambda handler tests | DEFERRED | P2 | 11.1, 12.1 | Deferred until after local CRUD/manual testing |

## Phase 12: Testing Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 12.1 | Configure selected test framework | DONE | P0 | 1.8, 2.3 | Jest is configured and `npm test` runs |
| 12.2 | Add test helpers for Fastify injection | DONE | P1 | 3.1, 12.1 | App injection tests use `buildApp()` without a network port and mocked dependencies where needed |
| 12.3 | Add unit tests for config validation | DONE | P1 | 4.3, 12.1 | Config success and failure paths are covered |
| 12.4 | Add unit tests for services | DONE | P1 | 8.3, 8.4, 8.5, 12.1 | Todo, User, and Role service behavior is covered |
| 12.5 | Add unit tests for RBAC policies | DEFERRED | P1 | 9.5, 12.1 | Deferred because Phase 9 auth/RBAC is deferred |
| 12.6 | Add repository tests with DynamoDB local or mocked client | DONE | P1 | 6.5, 7.6, 7.7, 7.8 | Repository command behavior is covered with a fake document client |
| 12.7 | Add route integration tests | DONE | P1 | 10.2, 10.7, 10.8, 12.2 | CRUD routes are covered through Fastify injection |
| 12.8 | Add validation error tests | DONE | P1 | 5.3, 10.10, 12.2 | Bad requests return the standard validation error shape |
| 12.9 | Add auth-protected route tests | DEFERRED | P1 | 9.7, 12.2 | Deferred because Phase 9 auth/RBAC is deferred |
| 12.10 | Add coverage reporting if useful | DONE | P2 | 12.1 | `npm run test:coverage` exists |

## Phase 13: Linting, Formatting, And Quality Gates

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 13.1 | Configure selected linter | DONE | P0 | 1.9, 2.3 | Biome is configured and `npm run lint` works |
| 13.2 | Configure selected formatter | DONE | P0 | 1.9, 2.3 | Biome formatter is configured and `npm run format` works |
| 13.3 | Add EditorConfig | DONE | P2 | None | `.editorconfig` defines basic editor consistency |
| 13.4 | Add typecheck command | DONE | P0 | 2.4 | `npm run typecheck` works |
| 13.5 | Add build verification command | DONE | P0 | 1.10, 2.6 | `npm run build` works |
| 13.6 | Add all-in-one check command | DONE | P1 | 12.1, 13.1, 13.4, 13.5 | `npm run check` runs typecheck, lint, tests, and build |
| 13.7 | Decide pre-commit hooks timing | DEFERRED | P2 | 13.1, 13.2 | Deferred until CI setup or team collaboration requires local hooks |

## Phase 14: API Documentation And Developer UX

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 14.1 | Add README setup instructions | DEFERRED | P1 | 2.6, 6.5 | Deferred until after local CRUD/manual testing |
| 14.2 | Add local DynamoDB instructions | DEFERRED | P1 | 6.5 | Deferred until after local CRUD/manual testing |
| 14.3 | Add sample request collection or curl examples | DEFERRED | P2 | 10.2, 10.7, 10.8 | Deferred until after local CRUD/manual testing |
| 14.4 | Add seed/sample data command if useful | DEFERRED | P2 | 7.6, 7.7, 7.8 | Deferred until after local CRUD/manual testing |
| 14.5 | Add OpenAPI generation if included | DEFERRED | P2 | 1.15, 10.10 | Deferred until after local CRUD/manual testing |
| 14.6 | Add architecture notes | DEFERRED | P2 | 1.5, 1.6, 1.7, 1.11 | Deferred until after local CRUD/manual testing |

## Phase 15: Security And Operational Hardening

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 15.1 | Add CORS policy if needed | DONE | P2 | 3.8 | CORS is explicitly disabled for the current API-only seed |
| 15.2 | Add security headers if applicable | DONE | P2 | 3.8 | `@fastify/helmet` applies baseline security headers |
| 15.3 | Add rate limiting decision | DEFERRED | P2 | 9.2 | Deferred until auth/RBAC or public exposure is enabled |
| 15.4 | Ensure logs redact secrets and auth tokens | DONE | P1 | 3.3, 4.5, 9.2 | Logger redacts authorization, cookies, API keys, AWS security token, and JWT secrets |
| 15.5 | Ensure all protected routes have auth/RBAC | DEFERRED | P1 | 9.7, 10.8 | Deferred because Phase 9 auth/RBAC is deferred and routes are intentionally open |
| 15.6 | Ensure errors do not leak internals | DONE | P1 | 3.5, 6.7 | 500 responses return a generic code/message; validation/domain 4xx errors remain structured |
| 15.7 | Decide password handling scope | DEFERRED | P2 | 1.12 | Deferred because local JWT auth is deferred |

## Phase 16: CI Readiness

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 16.1 | Decide CI provider or keep CI config deferred | DISCUSS | P2 | 13.6 | CI direction recorded |
| 16.2 | Add CI workflow if desired | TODO | P2 | 16.1, 13.6 | CI runs install, lint, typecheck, tests, build |
| 16.3 | Ensure tests do not require real AWS resources | TODO | P1 | 12.6 | Tests run against local/mocked DynamoDB |
| 16.4 | Document integration test prerequisites | TODO | P2 | 12.6 | Required local services are clear |

## Phase 17: Final Verification Before First Implementation Milestone

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 17.1 | Run formatter | TODO | P1 | 13.2 | Formatting passes |
| 17.2 | Run linter | TODO | P1 | 13.1 | Lint passes |
| 17.3 | Run typecheck | TODO | P1 | 13.4 | TypeScript passes |
| 17.4 | Run unit tests | TODO | P1 | 12.1 | Unit tests pass |
| 17.5 | Run integration tests | TODO | P1 | 12.7 | Integration tests pass |
| 17.6 | Run production build | TODO | P1 | 13.5 | Build passes |
| 17.7 | Manually verify local CRUD flow | TODO | P1 | 10.8, 14.3 | Todos, Users, Roles CRUD work |
| 17.8 | Manually verify Lambda handler path | TODO | P2 | 11.5 | Handler responds in test/simulated Lambda |
| 17.9 | Update docs with final decisions | TODO | P1 | 17.1 | README and architecture notes match implementation |

## Suggested Implementation Milestones

### Milestone 1: Foundation Decisions

Target outcome:

- Core decisions are made.
- Versions and tooling are selected.
- Project can be scaffolded without ambiguity.

Includes:

- Phase 1.

### Milestone 2: Minimal Fastify Skeleton

Target outcome:

- App starts locally.
- Health route works.
- Logging, config, errors, and TypeScript are in place.

Includes:

- Phase 2.
- Phase 3.
- Phase 4.
- Phase 13 basics.

### Milestone 3: DynamoDB And Domain Foundation

Target outcome:

- DynamoDB access patterns are documented.
- Repositories and domain models exist.
- Local DynamoDB setup is available.

Includes:

- Phase 6.
- Phase 7.

### Milestone 4: Todo CRUD Vertical Slice

Target outcome:

- Todo CRUD works end to end.
- Route validation, service layer, repository layer, and tests are proven.

Includes:

- Todo portions of Phase 5, Phase 8, Phase 10, Phase 12.

### Milestone 5: Users, Roles, Auth, And RBAC

Target outcome:

- User and Role CRUD work.
- Authentication foundation exists.
- RBAC protects routes.

Includes:

- Phase 9.
- User/Role portions of Phase 7, Phase 8, Phase 10, Phase 12.

### Milestone 6: Lambda And Production Readiness

Target outcome:

- Lambda handler exists.
- Build output is deployable.
- Quality gates pass.
- Docs are usable.

Includes:

- Phase 11.
- Phase 14.
- Phase 15.
- Phase 16 if desired.
- Phase 17.

## Decision Log

Use this section to record decisions as we make them.

| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-05-09 | Initialize Git immediately using `main` as the initial branch and `dev` for regular coding | Keep the planning baseline stable on `main` before implementation begins | Future implementation work happens on `dev` |
| 2026-05-09 | Use Fastify `5.8.x` | Latest Fastify docs list v5.8.x, and the project requirement is latest Fastify | Runtime dependencies should target Fastify v5 |
| 2026-05-09 | Use Node.js `24.x` managed by nvm | Node 24 is current LTS and available locally; AWS Lambda supports `nodejs24.x` | Add `.nvmrc` with Node 24 during scaffold |
| 2026-05-09 | Use npm | Team decision | Commit `package-lock.json` |
| 2026-05-09 | Use ESM | Team decision and modern Node/Lambda compatibility | Configure `type: module` and ESM TypeScript output |
| 2026-05-09 | Use Fastify plugin architecture with routes, services, and repositories | Better fit for Fastify than strict MVC | Source tree should be plugin-first, not controller-heavy |
| 2026-05-09 | Use Fastify-native DI through plugins, decorators, and encapsulation | This is the common Fastify approach and avoids extra runtime machinery | Add typed decorators/module augmentation where needed |
| 2026-05-09 | Use Fastify-native JSON Schema validation | Fastify is built around JSON Schema validation and response serialization | Prefer schema-first route definitions; avoid Joi/Zod for v1 |
| 2026-05-09 | Use Jest | Team decision | Configure Jest for TypeScript/ESM project |
| 2026-05-09 | Use Biome for linting and formatting | Team decision favoring fast tooling | Add Biome config and scripts |
| 2026-05-09 | Use SWC for build and `tsc --noEmit` for type checking | Fastify does not prescribe a build tool; SWC gives fast transpilation while TypeScript handles type safety | Configure both build and typecheck scripts |
| 2026-05-09 | Use DynamoDB single-table design with `pk` and `sk` | Team decision and good fit for planned access-pattern-first DynamoDB design | Design all v1 entities around `pk` and `sk` |
| 2026-05-09 | Use local JWT auth for v1 | Team decision | Add JWT plugin and local auth flow |
| 2026-05-09 | Implement role checks in v1 | Team decision | RBAC must be part of first CRUD implementation |
| 2026-05-09 | Use `/api/v1` route prefix | Team decision | Register v1 routes under `/api/v1` |
| 2026-05-09 | Include OpenAPI from day one | Team decision | Add OpenAPI tooling during scaffold |

## Deferred Ideas

These are useful but should not block the first CRUD milestone unless we explicitly promote them.

- Multi-tenant architecture.
- Full Cognito or external identity provider integration.
- Advanced tracing and metrics.
- Background queues.
- Event sourcing.
- CQRS.
- GraphQL.
- Admin UI.
- Complex organization hierarchy.
- Deployment IaC.
