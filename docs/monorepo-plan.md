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
- `apps/infra` for future infrastructure code when the IaC tool is selected.
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
| 1.1 | Use open-source Nx without Nx Cloud as a required dependency | DONE | P0 | None | Decision confirmed: Nx must work locally with no required cloud login or remote cache |
| 1.2 | Keep npm as the package manager | DONE | P0 | Existing project decision | Decision confirmed: root `package-lock.json` remains the committed lockfile |
| 1.3 | Decide workspace style: Nx project graph with npm workspaces | DONE | P0 | 1.2 | Decision confirmed: root `package.json` declares workspaces for `apps/*` and Nx manages targets |
| 1.4 | Decide backend project name | DONE | P0 | None | Decision confirmed: backend Nx project is named `backend` |
| 1.5 | Decide root versus project-level config ownership | DONE | P0 | 0.1 | Decision confirmed: shared config is root-level; backend-specific config lives under `apps/backend` |
| 1.6 | Decide whether to introduce shared libs during first migration | DONE | P1 | None | Decision confirmed: no shared libs are created until `apps/ui` or infra needs shared code |
| 1.7 | Decide frontend placeholder timing | DONE | P3 | None | Decision confirmed: do not create `apps/ui` during backend-only migration unless explicitly requested |
| 1.8 | Decide infrastructure location | DONE | P2 | None | Decision confirmed: reserve `apps/infra` for future Nx-managed infrastructure once the IaC tool is selected |

## Phase 2: Nx Workspace Foundation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Add Nx development dependency | DONE | P0 | 1.1, 1.2 | Root `package.json` includes `nx` as a dev dependency and `package-lock.json` is updated |
| 2.2 | Add `nx.json` | DONE | P0 | 2.1 | Nx workspace config exists with named inputs and cacheable target defaults |
| 2.3 | Add npm workspaces | DONE | P0 | 1.3 | Root `package.json` includes `workspaces: ["apps/*"]` and is marked private |
| 2.4 | Convert root package scripts to workspace orchestration | DONE | P0 | 2.2, 2.3 | Root scripts call Nx targets for backend build, test, lint, typecheck, serve, start, and DynamoDB helpers |
| 2.5 | Add `tsconfig.base.json` | DONE | P0 | 1.5 | Shared TypeScript compiler defaults live at the root and current `tsconfig.json` extends them |
| 2.6 | Keep Biome as the workspace formatter/linter | DONE | P1 | Existing project decision | Root `biome.json` remains the workspace formatter/linter configuration |
| 2.7 | Keep root README workspace-oriented | DONE | P2 | 2.4 | README describes monorepo commands and links backend docs/plans |

## Phase 3: Backend Relocation

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Create `apps/backend` directory | DONE | P0 | 2.3 | Backend app folder exists |
| 3.2 | Move `src` into `apps/backend/src` | DONE | P0 | 3.1 | Backend source imports still resolve after move; Nx typecheck and tests pass |
| 3.3 | Move `tests` into `apps/backend/tests` | DONE | P1 | 3.1 | Unit and integration tests remain colocated with backend project and pass through Nx |
| 3.4 | Move backend scripts into `apps/backend/scripts` | DONE | P1 | 3.1 | DynamoDB check/setup scripts live under backend ownership and Nx targets point to the new paths |
| 3.5 | Move backend environment example into `apps/backend/.env.example` | DONE | P1 | 3.1 | Backend env vars are documented with the backend app |
| 3.6 | Move backend-specific Jest config into `apps/backend/jest.config.cjs` | DONE | P1 | 3.3 | Jest config paths point at backend `src` and `tests`; `npm test` passes |
| 3.7 | Move backend-specific TypeScript config into `apps/backend/tsconfig.json` | DONE | P0 | 2.5, 3.2 | Backend config extends root `tsconfig.base.json`; `npm run typecheck` passes |
| 3.8 | Add backend package metadata | DONE | P0 | 3.1 | `apps/backend/package.json` identifies the backend workspace package |
| 3.9 | Add backend Nx project config | DONE | P0 | 2.2, 3.8 | `apps/backend/project.json` defines build, serve, test, lint, typecheck, and DynamoDB targets |
| 3.10 | Remove stale root app paths | DONE | P0 | 3.2, 3.3, 3.4 | Root no longer has backend-owned `src`, `tests`, or `scripts` directories |

## Phase 4: Build, Serve, And Runtime Targets

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Port backend dev command to Nx target | DONE | P0 | 3.9 | `npm run dev` starts `apps/backend/src/server.ts`; verified `/health` returns `200` with local env vars |
| 4.2 | Port backend build command to Nx target | DONE | P0 | 3.7, 3.9 | `npm run build` emits backend output under `dist/apps/backend` |
| 4.3 | Port backend start command | DONE | P1 | 4.2 | `npm run start` runs `dist/apps/backend/server.js`; verified `/health` returns `200` with local env vars |
| 4.4 | Port backend typecheck command | DONE | P0 | 3.7, 3.9 | `npm run typecheck` runs `tsc --project apps/backend/tsconfig.json --noEmit` |
| 4.5 | Port backend test command | DONE | P0 | 3.6, 3.9 | `npm test` runs the existing Jest suite through Nx |
| 4.6 | Port backend coverage command | DONE | P2 | 4.5 | `npm run test:coverage` writes coverage to ignored root `coverage/apps/backend` |
| 4.7 | Port DynamoDB helper scripts | DONE | P1 | 3.4, 3.9 | Nx targets point to relocated DynamoDB scripts; external DynamoDB execution remains environment-dependent |
| 4.8 | Add all-project quality command | DONE | P1 | 4.2, 4.4, 4.5 | `npm run check` passes from repo root |

## Phase 5: Import Paths And Configuration Fixes

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Update relative paths in Jest config | DONE | P0 | 3.6 | Jest finds backend tests and source files after relocation; `npm test` passes |
| 5.2 | Update TypeScript include/exclude paths | DONE | P0 | 3.7 | TypeScript includes backend source and tests as intended; `npm run typecheck` passes |
| 5.3 | Update SWC input/output paths | DONE | P0 | 4.2 | Build output preserves expected runtime structure at `dist/apps/backend` |
| 5.4 | Update scripts that assume repo-root execution | DONE | P1 | 3.4, 4.7 | DynamoDB script Nx targets point at `apps/backend/scripts` and scripts still import backend source through relative paths |
| 5.5 | Update documentation links and command references | DONE | P2 | 4.8 | README, configuration docs, DynamoDB docs, and the original execution plan mention Nx commands and backend app paths |
| 5.6 | Confirm runtime environment loading behavior | DONE | P1 | 3.5, 4.1 | Local dev works with shell-provided env vars; docs explain using a root `.env` or shell exports with `apps/backend/.env.example` as reference |

## Phase 6: Verification

| ID | Task | Status | Priority | Depends On | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| 6.1 | Run backend typecheck | DONE | P0 | 4.4, 5.2 | `npm run typecheck` passes through Nx |
| 6.2 | Run backend lint | DONE | P1 | 2.6, 3.9 | `npm run lint` passes through Nx |
| 6.3 | Run backend tests | DONE | P0 | 4.5, 5.1 | `npm test` passes through Nx |
| 6.4 | Run backend build | DONE | P0 | 4.2, 5.3 | `npm run build` passes through Nx |
| 6.5 | Run root check command | DONE | P1 | 4.8, 6.1, 6.2, 6.3, 6.4 | `npm run check` passes from repo root |
| 6.6 | Smoke test backend dev server | DONE | P1 | 4.1 | Backend starts and `GET /health` returns `200` with local env vars |
| 6.7 | Confirm Git diff is migration-only | DONE | P1 | 6.5 | Phase 6 diff only updates verification status in this plan |

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
| 2026-05-10 | Reserve `apps/infra` for future infrastructure code | Keeping infra as an Nx project allows shared workspace commands, dependency graph visibility, and affected-project checks when IaC is added | No infra files are created during the backend-only migration |

## Deferred Ideas

These should not block the backend-only Nx migration.

- Creating `apps/ui`.
- Creating shared `libs/*` packages before there is a second consumer.
- Adding Nx Cloud or remote caching.
- Adding CI affected-project optimization.
- Moving infrastructure code before the IaC tool and ownership model are decided.
- Splitting backend packages into multiple internal libraries.
