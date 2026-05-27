# Unit Testing Guidelines

This repository uses Jest for the backend test suite in `apps/backend`.

## Scope

- Unit tests live under `apps/backend/tests/unit`.
- Integration tests live under `apps/backend/tests/integration`.
- Shared helpers live under `apps/backend/tests/helpers`.

## How Tests Run

- Root command: `npm test`
- Backend command: `npm --workspace @codepuranx/backend run test`
- Coverage command: `npm run test:coverage`

Jest is configured in `apps/backend/jest.config.cjs` and uses `@swc/jest` to transpile TypeScript test files.

## Test File Rules

- Name unit tests `*.test.ts`.
- Keep tests in the `tests/` tree, not alongside runtime source files.
- Prefer one behavior focus per `describe()` block.
- Prefer deterministic inputs and avoid time or network dependence unless explicitly testing those concerns.

## Checklist For New Unit Tests

- [ ] Place the test in `apps/backend/tests/unit`.
- [ ] Import runtime code from `apps/backend/src/...`.
- [ ] Use `jest.fn()` or a small fake for collaborators.
- [ ] Cover the success case first.
- [ ] Cover failure and edge cases that change behavior.
- [ ] Assert the observable contract, not internal implementation details.
- [ ] Close over no shared mutable state between tests.
- [ ] Keep assertions specific and minimal.
- [ ] Run `npm test` before merging.

## What To Test

Good unit test targets in this repo are:

- pure helpers such as key builders, pagination helpers, and mappers
- services that depend on mocked repository ports
- config parsing and logger option helpers
- password helpers and other deterministic utility functions

## What To Avoid

- real network calls
- real AWS resources
- starting a Fastify server on a port
- testing multiple layers at once unless the behavior is specifically integration-level

## Existing Patterns In This Repo

- Repository tests use a fake DynamoDB document client.
- Service tests mock repository ports and check domain-level behavior.
- Integration tests use `buildApp()` and `app.inject()`, so they should stay out of the unit test folder.
- Shared sample data belongs in `apps/backend/tests/helpers/sample-domain.ts`.

## Jest And TypeScript Notes

- Jest uses `testEnvironment: 'node'`.
- Jest only picks up `apps/backend/tests/**/*.test.ts`.
- `clearMocks: true` resets mock state between tests.
- `collectCoverageFrom: ['src/**/*.ts']` means coverage is measured from backend source files, not test files.
- TypeScript test code has Jest types enabled through `apps/backend/tsconfig.json`.

## Recommended Structure

```ts
describe('Thing', () => {
  it('does the expected thing', () => {
    // arrange
    // act
    // assert
  });
});
```

Use a small factory helper when a test needs the same mock setup repeatedly. Keep the helper local to the test file unless several tests share it.
