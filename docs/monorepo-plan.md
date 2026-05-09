# Nx Monorepo Migration Plan

This plan converts the current root-level Fastify project into an open-source Nx monorepo. It is designed to move the backend into `apps/backend` first, while keeping repo-level agent, Codex, documentation, and future workspace concerns at the repository root.

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

- `P0`: Required for the monorepo foundation.
- `P1`: Required for the backend migration to remain usable.
- `P2`: Important hardening or developer experience.
- `P3`: Future improvement.

Each task should be updated with:

- Status.
- Owner, if needed.
- Decision notes, if a decision was made.
- Verification notes, once completed.

## Target Repository Shape

The first migration target should be:

```text
.
├── .agents/
├── .codex/
├── .vscode/
├── apps/
│   └── backend/
│       ├── src/
│       ├── tests/
│       ├── scripts/
│       ├── package.json
│       ├── project.json
│       ├── tsconfig.json
│       ├── jest.config.cjs
│       └── .env.example
├── docs/
├── nx.json
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── biome.json
└── README.md
```

Root-owned files and directories:

- `.agents`, `.codex`, `.vscode`.
- `docs`.
- Root `README.md`.
- Root workspace files such as `nx.json`, `package.json`, `package-lock.json`, `tsconfig.base.json`, and root quality-tool configuration.

Backend-owned files and directories:

- Current `src`.
- Current `tests`.
- Current DynamoDB scripts under `scripts`.
- Backend runtime configuration examples such as `.env.example`.
- Backend-specific TypeScript, Jest, and package metadata where appropriate.

Future app locations:

- `apps/ui` for the React frontend.
- `apps/infra` or `infra` for infrastructure code, depending on the IaC tool decision.
- `libs/*` for shared packages only after a second app creates real shared-code pressure.

## Phase 0: Repository Baseline

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 0.1 | Confirm current root Fastify project structure | DONE | P0 | None | Confirmed current backend source is rooted in `src`, tests in `tests`, DynamoDB scripts in `scripts`, with root `package.json`, `tsconfig.json`, `jest.config.cjs`, and `biome.json` |
| 0.2 | Check current Git status and identify user changes | DONE | P0 | None | Confirmed pre-existing unstaged `package.json` change; migration work must not overwrite or stage it unless requested |
| 0.3 | Confirm generated output is not migrated as source | DONE | P0 | 0.1 | Confirmed `dist` and `coverage` are generated outputs and ignored; they should not be moved into `apps/backend` |
| 0.4 | Confirm docs and agent assets stay at repo root | DONE | P0 | None | Confirmed `.agents`, `.codex`, `docs`, `.vscode`, and root README remain root-level |

## Phase 1: Monorepo Architecture Decisions

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Use open-source Nx without Nx Cloud as a required dependency | READY | P0 | None | Nx works locally with no required cloud login or remote cache |
| 1.2 | Keep npm as the package manager | READY | P0 | Existing project decision | Root `package-lock.json` remains the committed lockfile |
| 1.3 | Decide workspace style: Nx project graph with npm workspaces | READY | P0 | 1.2 | Root `package.json` declares workspaces for `apps/*` and Nx manages targets |
| 1.4 | Decide backend project name | READY | P0 | None | Backend Nx project is named `backend` |
| 1.5 | Decide root versus project-level config ownership | READY | P0 | 0.1 | Shared config is root-level; backend-specific config lives under `apps/backend` |
| 1.6 | Decide whether to introduce shared libs during first migration | READY | P1 | None | No shared libs are created until `apps/ui` or infra needs shared code |
| 1.7 | Decide frontend placeholder timing | READY | P3 | None | Do not create `apps/ui` during backend-only migration unless explicitly requested |
| 1.8 | Decide infrastructure location | DISCUSS | P2 | None | Choose `apps/infra` for Nx-managed infra or root `infra` for tool-native IaC |

## Phase 2: Nx Workspace Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Add Nx development dependency | TODO | P0 | 1.1, 1.2 | Root `package.json` includes Nx dev dependency and lockfile is updated |
| 2.2 | Add `nx.json` | TODO | P0 | 2.1 | Nx workspace config exists with named inputs and cacheable target defaults |
| 2.3 | Add npm workspaces | TODO | P0 | 1.3 | Root `package.json` includes `workspaces: ["apps/*"]` |
| 2.4 | Convert root package scripts to workspace orchestration | TODO | P0 | 2.2, 2.3 | Root scripts call Nx targets such as `nx build backend`, `nx test backend`, and `nx run-many` |
| 2.5 | Add `tsconfig.base.json` | TODO | P0 | 1.5 | Shared TypeScript compiler defaults and future path aliases live at the root |
| 2.6 | Keep Biome as the workspace formatter/linter | TODO | P1 | Existing project decision | Root `biome.json` can lint and format root docs/config plus app code |
| 2.7 | Keep root README workspace-oriented | TODO | P2 | 2.4 | README describes monorepo commands and links backend docs/plans |

## Phase 3: Backend Relocation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Create `apps/backend` directory | TODO | P0 | 2.3 | Backend app folder exists |
| 3.2 | Move `src` into `apps/backend/src` | TODO | P0 | 3.1 | Backend source imports still resolve after move |
| 3.3 | Move `tests` into `apps/backend/tests` | TODO | P1 | 3.1 | Unit and integration tests remain colocated with backend project |
| 3.4 | Move backend scripts into `apps/backend/scripts` | TODO | P1 | 3.1 | DynamoDB check/setup scripts live under backend ownership |
| 3.5 | Move backend environment example into `apps/backend/.env.example` | TODO | P1 | 3.1 | Backend env vars are documented with the backend app |
| 3.6 | Move backend-specific Jest config into `apps/backend/jest.config.cjs` | TODO | P1 | 3.3 | Jest config paths point at backend `src` and `tests` |
| 3.7 | Move backend-specific TypeScript config into `apps/backend/tsconfig.json` | TODO | P0 | 2.5, 3.2 | Backend config extends root `tsconfig.base.json` |
| 3.8 | Add backend package metadata | TODO | P0 | 3.1 | `apps/backend/package.json` identifies backend app and local scripts if useful |
| 3.9 | Add backend Nx project config | TODO | P0 | 2.2, 3.8 | `apps/backend/project.json` defines build, serve, test, lint, typecheck, and DynamoDB targets |
| 3.10 | Remove stale root app paths | TODO | P0 | 3.2, 3.3, 3.4 | Root no longer has backend-owned `src`, `tests`, or `scripts` directories |

## Phase 4: Build, Serve, And Runtime Targets

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Port backend dev command to Nx target | TODO | P0 | 3.9 | `npm run dev` or `npx nx serve backend` starts `apps/backend/src/server.ts` |
| 4.2 | Port backend build command to Nx target | TODO | P0 | 3.7, 3.9 | `npx nx build backend` emits backend output under `dist/apps/backend` |
| 4.3 | Port backend start command | TODO | P1 | 4.2 | Production start command points at `dist/apps/backend/server.js` or the chosen output path |
| 4.4 | Port backend typecheck command | TODO | P0 | 3.7, 3.9 | `npx nx typecheck backend` runs `tsc --noEmit` for backend |
| 4.5 | Port backend test command | TODO | P0 | 3.6, 3.9 | `npx nx test backend` runs the existing Jest suite |
| 4.6 | Port backend coverage command | TODO | P2 | 4.5 | Coverage output is generated in a predictable ignored location |
| 4.7 | Port DynamoDB helper scripts | TODO | P1 | 3.4, 3.9 | `npx nx dynamo-setup backend` and `npx nx dynamo-check backend` work |
| 4.8 | Add all-project quality command | TODO | P1 | 4.2, 4.4, 4.5 | Root `npm run check` runs Nx targets for affected or all projects |

## Phase 5: Import Paths And Configuration Fixes

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Update relative paths in Jest config | TODO | P0 | 3.6 | Jest finds backend tests and source files after relocation |
| 5.2 | Update TypeScript include/exclude paths | TODO | P0 | 3.7 | TypeScript includes backend source and tests as intended |
| 5.3 | Update SWC input/output paths | TODO | P0 | 4.2 | Build output preserves expected runtime structure |
| 5.4 | Update scripts that assume repo-root execution | TODO | P1 | 3.4, 4.7 | DynamoDB scripts work through Nx from the repo root |
| 5.5 | Update documentation links and command references | TODO | P2 | 4.8 | Docs mention Nx commands and backend app path |
| 5.6 | Confirm runtime environment loading behavior | TODO | P1 | 3.5, 4.1 | Local dev can still load backend environment variables intentionally |

## Phase 6: Verification

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 6.1 | Run backend typecheck | TODO | P0 | 4.4, 5.2 | `npx nx typecheck backend` passes |
| 6.2 | Run backend lint | TODO | P1 | 2.6, 3.9 | `npx nx lint backend` or root Biome lint target passes |
| 6.3 | Run backend tests | TODO | P0 | 4.5, 5.1 | `npx nx test backend` passes |
| 6.4 | Run backend build | TODO | P0 | 4.2, 5.3 | `npx nx build backend` passes |
| 6.5 | Run root check command | TODO | P1 | 4.8, 6.1, 6.2, 6.3, 6.4 | `npm run check` passes from repo root |
| 6.6 | Smoke test backend dev server | TODO | P1 | 4.1 | Backend starts and `GET /health` returns `200` |
| 6.7 | Confirm Git diff is migration-only | TODO | P1 | 6.5 | Diff contains expected moves/config updates and no unrelated rewrites |

## Phase 7: Future React UI Readiness

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 7.1 | Reserve `apps/ui` as the frontend location | READY | P3 | None | Plan documents React app location without creating it yet |
| 7.2 | Define future UI generator/tooling decision | DEFERRED | P3 | 7.1 | Choose Vite, Next.js, or another React setup when UI work starts |
| 7.3 | Define shared API type strategy | DEFERRED | P2 | 7.2 | Decide whether shared schemas/types belong in `libs/api-contracts` |
| 7.4 | Define frontend-to-backend local dev workflow | DEFERRED | P2 | 7.2 | Future `nx serve ui` and `nx serve backend` workflow is documented |
| 7.5 | Add affected-project CI strategy | DEFERRED | P2 | 7.2 | CI can run only affected backend/ui projects once multiple apps exist |

## Suggested Implementation Milestones

### Milestone 1: Workspace Foundation

Target outcome:

- Nx is installed locally.
- Root workspace config exists.
- Root scripts are prepared to orchestrate projects.

Includes:

- Phase 1.
- Phase 2.

### Milestone 2: Backend Move

Target outcome:

- Fastify source, tests, scripts, and backend-specific config live in `apps/backend`.
- Root remains responsible for workspace orchestration and repository-level assets.

Includes:

- Phase 3.
- Phase 5.

### Milestone 3: Backend Targets

Target outcome:

- Backend can be served, built, tested, typechecked, linted, and checked through Nx.
- Existing app behavior is preserved.

Includes:

- Phase 4.
- Phase 6.

### Milestone 4: Future App Readiness

Target outcome:

- Repository layout is ready for `apps/ui` and infrastructure work without another major restructure.

Includes:

- Phase 7.

## Decision Log

Use this section to record decisions as we make them.

| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-05-10 | Convert the repo to an Nx monorepo with the existing Fastify API as `apps/backend` | The repository is expected to contain backend, frontend, infra, docs, and agent assets | Backend-specific files move under `apps/backend`; repo-level assets stay at root |
| 2026-05-10 | Use open-source Nx without requiring Nx Cloud | The immediate need is local monorepo orchestration, project graph, and cacheable targets | No cloud setup or login should block local development |
| 2026-05-10 | Keep `.agents`, `.codex`, and `docs` at repository root | These assets describe or configure the whole repository, not only the backend | Future apps can share the same planning and agent context |
| 2026-05-10 | Keep npm as the package manager | The current project already uses npm and commits `package-lock.json` | Migration should update the existing lockfile rather than introduce another package manager |
| 2026-05-10 | Do not create `apps/ui` during the first migration | The current implementation only has the backend | React app setup is deferred until frontend work starts |

## Deferred Ideas

These should not block the backend-only Nx migration.

- Creating `apps/ui`.
- Creating shared `libs/*` packages before there is a second consumer.
- Adding Nx Cloud or remote caching.
- Adding CI affected-project optimization.
- Moving infrastructure code before the IaC tool and ownership model are decided.
- Splitting backend packages into multiple internal libraries.
