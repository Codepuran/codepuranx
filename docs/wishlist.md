# Fastify Project Wishlist

This is the initial laundry list for the project. It is intentionally not a final plan yet. The goal is to collect everything we want to discuss, challenge, and decide before implementation.

## Core Goal

- Build a Fastify-based TypeScript API with a solid foundation.
- Keep the runtime extremely fast and suitable for AWS Lambda.
- Start with a simple Todo app to validate the architecture.
- Support CRUD for:
  - Todos
  - Users
  - Roles

## Runtime And Platform

- Use the latest Fastify version.
- Confirm Fastify LTS policy and compatibility from:
  - https://fastify.dev/docs/latest/Reference/LTS/
- Use Node.js LTS.
- Decide exact Node.js version target.
- Ensure the app can run both as:
  - A normal HTTP server for local development.
  - A Lambda handler for deployment.
- Keep cold starts, bundle size, and dependency count in mind.

## Framework And Architecture

- Use Fastify.
- Explore Fastify-supported and Fastify-friendly patterns:
  - Plugin-based architecture.
  - Repository pattern.
  - MVC-style structure.
  - Service layer.
  - Dependency injection.
  - Route/controller separation.
- Decide whether strict MVC is actually the best fit for Fastify.
- Prefer Fastify decorators where they improve ergonomics and performance.
- Avoid unnecessary abstraction in the first version.

## TypeScript Foundation

- Use TypeScript.
- Decide TypeScript strictness level.
- Configure path aliases only if they provide real value.
- Define clear domain types for Todos, Users, Roles, and Auth.
- Decide whether validation schemas should also drive TypeScript types.

## Logging

- Use Pino.
- Use Fastify's built-in Pino integration where possible.
- Decide logging shape:
  - Request IDs.
  - Correlation IDs.
  - Error serialization.
  - Redaction for sensitive data.
  - Lambda-friendly structured logs.
- Decide whether to use pretty logs only in local development.

## Database

- Use DynamoDB only for now.
- Follow DynamoDB best practices:
  - Explicit access patterns before schema design.
  - Single-table vs multi-table decision.
  - Partition key and sort key design.
  - GSI usage only when justified.
  - Conditional writes for correctness.
  - Optimistic concurrency where needed.
  - Pagination support.
  - Consistent error handling for conditional failures.
  - Avoid table scans in normal API paths.
  - Local DynamoDB setup for development and tests.
- Decide AWS SDK version and DynamoDB client abstraction.
- Decide whether repositories should expose domain models or persistence records.

## Validation

- Decide between Joi and Zod.
- Also consider Fastify-native JSON Schema validation.
- Compare:
  - Runtime performance.
  - TypeScript inference.
  - Fastify integration.
  - Error formatting.
  - Lambda cold start impact.
  - Ecosystem support.
- Decide validation strategy for:
  - Request body.
  - Params.
  - Query string.
  - Response schemas.
  - Environment variables.

## Authentication And Authorization

- Add authentication foundation.
- Decide auth strategy:
  - JWT.
  - API keys.
  - Cognito or other identity provider later.
  - Local/dev auth mode.
- Add RBAC support.
- Define simple roles and permissions for first version.
- Decide where authorization checks live:
  - Route hooks.
  - Decorators.
  - Service layer.
  - Policy functions.
- Make room for future multi-tenant or organization-based access if needed.

## Dependency Injection

- Add dependency injection.
- Decide whether to use:
  - Fastify decorators.
  - Awilix.
  - TSyringe.
  - Manual dependency factories.
  - Plugin encapsulation as the primary DI mechanism.
- Keep Lambda performance and startup time in mind.
- Make testing easy without heavy runtime machinery.

## Middleware, Hooks, And Plugins

- Use Fastify hooks/plugins instead of Express-style middleware where appropriate.
- Decide common cross-cutting concerns:
  - Request context.
  - Authentication.
  - Authorization.
  - Error handling.
  - Validation errors.
  - Logging.
  - Rate limiting.
  - CORS.
  - Security headers.
  - Request IDs.
- Decide which concerns should be global and which should be route scoped.

## Testing

- Decide between Jest and alternatives:
  - Vitest.
  - Node.js built-in test runner.
  - Jest.
- Consider:
  - TypeScript support.
  - Speed.
  - Mocking ergonomics.
  - Fastify injection tests.
  - DynamoDB local integration tests.
  - Lambda handler tests.
- Add unit tests for:
  - Services.
  - Repositories.
  - Policies/RBAC.
  - Validators.
- Add integration tests for:
  - Routes.
  - DynamoDB CRUD flows.
  - Auth-protected routes.

## Error Handling

- Standardize API error response format.
- Map domain errors to HTTP status codes.
- Map DynamoDB errors cleanly.
- Avoid leaking internal details.
- Preserve useful logs for debugging.
- Decide validation error response shape.

## API Design

- Define REST endpoints for initial CRUD.
- Decide route versioning strategy:
  - `/v1`
  - Header-based versioning.
  - No versioning for first version.
- Decide response envelope style.
- Add pagination conventions.
- Add filtering/sorting only where needed.
- Add OpenAPI documentation if useful.

## Lambda Readiness

- Decide Lambda adapter:
  - `@fastify/aws-lambda`
  - Other supported adapters.
- Keep server creation separate from server listening.
- Avoid reconnecting or rebuilding expensive resources per invocation.
- Think about:
  - Cold start time.
  - Bundle size.
  - Tree-shaking.
  - Environment loading.
  - Reusing AWS SDK clients.
  - Graceful local development.

## Build And Packaging

- Decide build tool:
  - `tsc`
  - `tsx`
  - `tsup`
  - `esbuild`
  - SWC.
- Decide module format:
  - ESM.
  - CommonJS.
- Decide local development runner.
- Decide production build output.
- Decide Lambda packaging approach.

## Linting And Formatting

- Brainstorm and decide best tooling combination:
  - ESLint.
  - Prettier.
  - Biome.
  - TypeScript ESLint.
  - EditorConfig.
- Decide whether to optimize for:
  - Maximum ecosystem maturity.
  - Fastest local feedback.
  - Minimal config.
  - Strict code quality rules.
- Add scripts for:
  - Lint.
  - Format.
  - Typecheck.
  - Test.
  - Build.

## Configuration

- Add environment configuration strategy.
- Validate environment variables at startup.
- Separate config for:
  - Local development.
  - Tests.
  - Lambda.
  - CI.
- Decide `.env` usage.
- Avoid reading process environment throughout the codebase.

## Security Foundation

- Add secure defaults:
  - Input validation.
  - Auth hooks.
  - RBAC checks.
  - Safe error responses.
  - Sensitive log redaction.
  - CORS policy.
  - Security headers where applicable.
- Decide rate limiting needs.
- Decide password handling only if local user credentials are part of v1.
- Keep future Cognito or external identity provider integration in mind.

## Developer Experience

- Provide clear project scripts.
- Add a useful README later.
- Add local DynamoDB setup notes.
- Add sample requests.
- Add seed/sample data command if useful.
- Keep folder structure easy to navigate.
- Make the first CRUD flow easy to test locally.

## Observability

- Add structured logs.
- Add request IDs.
- Consider metrics later.
- Consider tracing later.
- Keep AWS Lambda logging and CloudWatch compatibility in mind.

## CI Readiness

- Add CI-friendly scripts.
- Make tests deterministic.
- Avoid dependence on real AWS resources for normal tests.
- Decide whether integration tests require Docker or a local DynamoDB endpoint.

## Initial Debate Topics

- Fastify plugin architecture vs traditional MVC.
- Zod vs Joi vs Fastify JSON Schema.
- Jest vs Vitest vs Node.js built-in test runner.
- DynamoDB single-table vs multi-table for this project.
- Fastify decorators vs external dependency injection container.
- ESM vs CommonJS for Lambda and tooling.
- `tsc` vs `tsup`/`esbuild` for build output.
- ESLint plus Prettier vs Biome.
- How much RBAC to build in v1 without overengineering.
- Whether OpenAPI should be included from day one.

## Out Of Scope For First Version Unless We Decide Otherwise

- Multi-tenant architecture.
- Full production identity provider integration.
- Complex workflow engine.
- Event sourcing.
- CQRS.
- GraphQL.
- Background queues.
- Microservices split.
- Advanced observability stack.
- Admin UI.

