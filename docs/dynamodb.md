# DynamoDB Design

The v1 API uses a single DynamoDB table with only the primary key:

- Partition key: `pk`
- Sort key: `sk`

No GSIs are used in v1. This keeps cost and operational complexity lower. The tradeoff is that every v1 access pattern must be satisfied by `GetItem`, `PutItem`, `UpdateItem`, `DeleteItem`, or `Query` against the primary key. Normal API paths must not use table scans.

## Entity Keys

User profile:

- `pk = USER#<userId>`
- `sk = PROFILE`

User email uniqueness guard:

- `pk = USER_EMAIL#<normalizedEmail>`
- `sk = UNIQUE`

Role profile:

- `pk = ROLE#<roleId>`
- `sk = PROFILE`

Todo:

- `pk = USER#<userId>`
- `sk = TODO#<todoId>`

## Access Patterns

Create user:

- `PutItem` user profile with `attribute_not_exists(pk)`.
- `PutItem` email uniqueness guard with `attribute_not_exists(pk)`.
- These should be written transactionally in Phase 7 to avoid partial user creation.

Get user by id:

- `GetItem` with `pk = USER#<userId>`, `sk = PROFILE`.

Check or enforce user email uniqueness:

- `GetItem` or conditional `PutItem` with `pk = USER_EMAIL#<normalizedEmail>`, `sk = UNIQUE`.

List users:

- Not supported in v1.
- Users are expected to be very small in number, and v1 supports direct CRUD by id only.
- A table scan is not allowed for normal API behavior.

Create role:

- `PutItem` with `pk = ROLE#<roleId>`, `sk = PROFILE`, and `attribute_not_exists(pk)`.

Get role by id:

- `GetItem` with `pk = ROLE#<roleId>`, `sk = PROFILE`.

List roles:

- Not supported in v1.
- Roles are expected to be very small in number, and v1 supports direct CRUD by id only.
- A table scan is not allowed for normal API behavior.

Create todo:

- `PutItem` with `pk = USER#<userId>`, `sk = TODO#<todoId>`, and `attribute_not_exists(pk)`.

Get todo by user and todo id:

- `GetItem` with `pk = USER#<userId>`, `sk = TODO#<todoId>`.

List todos for one user:

- `Query` with `pk = USER#<userId>` and `begins_with(sk, TODO#)`.
- Use `LastEvaluatedKey` for cursor pagination.

List todos across all users:

- Not supported in v1 without adding a GSI or a dedicated write-time listing partition.

## Local Table Shape

The local table setup creates:

- Billing mode: `PAY_PER_REQUEST`
- Attribute definitions: `pk` as string, `sk` as string
- Key schema: `pk` hash key, `sk` range key

Local helper commands:

- `npm run dynamo:setup`: create the configured local table through the backend Nx target.
- `npm run dynamo:check`: describe the configured table through the backend Nx target.
