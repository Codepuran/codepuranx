# Configuration

Configuration is loaded once from environment variables through `apps/backend/src/config`.

## Required Variables

- `DYNAMODB_TABLE_NAME`
- `JWT_SECRET`

## Optional Variables

- `NODE_ENV`: defaults to `development`; allowed values are `development`, `test`, `production`.
- `HOST`: defaults to `127.0.0.1`.
- `PORT`: defaults to `3000`.
- `LOG_LEVEL`: defaults to `info`; uses Pino log levels.
- `LOG_CONSOLE_ENABLED`: defaults to `true`; writes structured JSON logs to stdout.
- `LOG_FILE_ENABLED`: defaults to `true`; writes structured JSON logs to a rotated file.
- `LOG_FILE_PATH`: defaults to `logs/backend.log`.
- `LOG_ROTATION_FREQUENCY`: defaults to `daily`; allowed values are `hourly`, `daily`, and `weekly`.
- `LOG_ROTATION_SIZE`: defaults to `10m`; rotates the file when this size is reached.
- `LOG_RETENTION_COUNT`: defaults to `7`; keeps this many rotated files.
- `DYNAMODB_REGION`: defaults to `us-east-1`.
- `DYNAMODB_ENDPOINT`: optional local DynamoDB endpoint.
- `JWT_EXPIRES_IN`: defaults to `1h`.
- `OPENAPI_ROUTE_PREFIX`: defaults to `/docs`.

## Environment Expectations

Local development:

- Use a root `.env` file or shell exports for local values.
- Use `apps/backend/.env.example` as the backend variable reference.
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

Logger configuration is derived from the `LOG_*` variables.

The backend uses Fastify's Pino logger with two default outputs:

- Console output through `pino/file` with stdout destination `1`.
- Rotated file output through `pino-roll`.

File logs are written to `LOG_FILE_PATH`, the directory is created automatically, and rotation happens when either `LOG_ROTATION_FREQUENCY` or `LOG_ROTATION_SIZE` is reached.

Sensitive values are redacted from logs:

- `req.headers.authorization`
- `req.headers.cookie`
- `req.headers["x-api-key"]`
- `req.headers["x-amz-security-token"]`
- `config.jwt.secret`
- `jwt.secret`

Lambda-specific log shaping is intentionally deferred.
