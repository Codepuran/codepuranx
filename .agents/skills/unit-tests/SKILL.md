---
name: unit-tests
description: Write, fix, and review backend unit tests for this repo. Use when generating unit tests for recently developed backend code, when updating or repairing existing tests to match repo conventions, or when the user explicitly asks to test a specific file, module, code area, or uncommitted changes.
---

# Unit Tests

Use this skill for backend unit-test work in `apps/backend`.

## Inputs To Establish

- Target: specific file, module, folder, or uncommitted diff
- Goal: new tests, test fixes, or review of existing tests
- Coverage expectation: default to `85%` only when the request is automatic; otherwise prefer correctness over raw coverage

## Core Rules

- Prefer correctness over coverage.
- Do not write tests for trivial single-line functions unless behavior is non-obvious or fragile.
- Mock every external call: DB, network, filesystem, time, UUID, crypto, queues, and similar boundaries.
- Keep tests resilient to implementation changes.
- Test observable behavior and contracts, not private internals.
- Do not assert exact call order unless order is part of the contract.
- Use `jest-when` for behavior-based stubs when it improves clarity.
- Stub mock functions with realistic input values and returned values.
- Prefer small fakes for complex collaborators when a raw mock becomes brittle.

## Repo Conventions

- Unit tests live in `apps/backend/tests/unit`.
- Integration tests live in `apps/backend/tests/integration`; do not put integration behavior in unit tests.
- Shared fixtures and fakes live in `apps/backend/tests/helpers`.
- Jest runs with `testEnvironment: 'node'`.
- Jest matches `apps/backend/tests/**/*.test.ts`.
- SWC handles TypeScript transpilation for Jest.

## What To Test

- Domain and service behavior
- Repository logic with mocked document client or fake client
- Config parsing and derived options
- Mappers, key builders, pagination helpers, password helpers, and error mapping
- Recently developed backend code that can regress through behavior changes

## What Not To Test

- Single-line passthrough functions
- External services directly
- Real DynamoDB or network calls
- Fastify request/response behavior that belongs in integration tests

## Suggested Workflow

1. Inspect the target code and recent diff.
2. Identify the behavior that can break.
3. Decide whether the target is unit-level or should stay integration-level.
4. Build the minimal mock/fake setup needed.
5. Write tests for success, failure, and edge cases.
6. Prefer stable assertions over implementation-specific assertions.
7. If behavior is ambiguous, capture the intended contract in the test name and assertions.
8. Run the affected tests first, then run the full backend test suite before claiming completion.
9. Confirm nothing is failing anywhere in the backend test suite.
10. Report the test scope and coverage impact clearly.

## Mocking Guidance

- Use `jest.fn()` for simple collaborators.
- Use `jest-when` when the same mock has multiple input/output branches.
- Use deterministic timestamps and IDs in tests.
- Prefer `mockResolvedValue` and `mockRejectedValue` for async behavior.
- When a mock has meaningful arguments, assert against those arguments with realistic values.

## Coverage Guidance

- Coverage is a secondary signal.
- If a test increases coverage but is brittle or coupled to internals, rewrite it.
- For automatic invocations, aim for about `85%` coverage on the touched backend area when practical.
- Do not force coverage by testing trivial code paths or private implementation detail.

## Checklist

- [ ] Confirm the target file/module/diff.
- [ ] Confirm whether the work is unit or integration level.
- [ ] Skip trivial single-line functions unless behavior is meaningful.
- [ ] Mock all external boundaries.
- [ ] Use `jest-when` or a small fake where appropriate.
- [ ] Cover happy path, failure path, and any edge case that can regress.
- [ ] Keep assertions behavior-focused and stable.
- [ ] Run the affected tests.
- [ ] Run the full backend test suite.
- [ ] Confirm nothing is failing.
- [ ] Run the relevant backend test target.
- [ ] Report the coverage impact and any remaining gaps.
