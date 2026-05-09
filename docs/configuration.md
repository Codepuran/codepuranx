# Configuration

Configuration is loaded once from environment variables through `src/config`.

## Required Variables

- `DYNAMODB_TABLE_NAME`
- `JWT_SECRET`

## Optional Variables

- `NODE_ENV`: defaults to `development`; allowed values are `development`, `test`, `production`.
- `HOST`: defaults to `127.0.0.1`.
- `PORT`: defaults to `3000`.
- `LOG_LEVEL`: defaults to `info`; uses Pino log levels.
- `DYNAMODB_REGION`: defaults to `us-east-1`.
- `DYNAMODB_ENDPOINT`: optional local DynamoDB endpoint.
- `JWT_EXPIRES_IN`: defaults to `1h`.
- `OPENAPI_ROUTE_PREFIX`: defaults to `/docs`.

## Environment Expectations

Local development:

- Use `.env` or shell exports for local values.
- Set `DYNAMODB_ENDPOINT` when using a local DynamoDB instance.
- Use a non-production `JWT_SECRET`.

Tests:

- Tests should pass explicit environment objects into `loadConfig`.
- Tests should not depend on real AWS resources.

Lambda:

- Lambda configuration should come from function environment variables.
- Do not set `DYNAMODB_ENDPOINT` in AWS unless intentionally targeting a custom endpoint.
- Secrets should be injected by the deployment platform, not committed to the repo.

## Logging

Logger configuration is derived from `LOG_LEVEL` and includes redaction for authorization headers, cookies, and JWT secret paths.
