# CodePuranX Monorepo

This repository is being migrated into an Nx monorepo for the Fastify backend, future React UI, infrastructure code, docs, and agent assets.

Current app:

- `apps/backend`: Fastify-based TypeScript API designed for high performance, DynamoDB persistence, and AWS Lambda readiness.

Common workspace commands:

- `npm run dev`: start the backend through Nx.
- `npm run build`: build the backend through Nx.
- `npm test`: run backend tests through Nx.
- `npm run test:coverage`: run backend tests with coverage through Nx.
- `npm run typecheck`: typecheck the backend through Nx.
- `npm run lint`: lint the backend through Nx.
- `npm run dynamo:setup`: create the local DynamoDB table for the backend.
- `npm run dynamo:check`: check the configured DynamoDB table for the backend.
- `npm run check`: run typecheck, lint, tests, and build through Nx.

Backend environment variables are documented in `apps/backend/.env.example`. For local development, either export the variables in your shell or create a root `.env` file so the backend can load it from the workspace root.

Current planning documents:

- [Wishlist](docs/wishlist.md)
- [Execution Plan](docs/plan.md)
- [Nx Monorepo Migration Plan](docs/monorepo-plan.md)
- [Configuration](docs/configuration.md)
