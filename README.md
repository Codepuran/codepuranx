# CodePuranX Monorepo

This repository is being migrated into an Nx monorepo for the Fastify backend, future React UI, infrastructure code, docs, and agent assets.

Current app:

- `backend`: Fastify-based TypeScript API designed for high performance, DynamoDB persistence, and AWS Lambda readiness.

Common workspace commands:

- `npm run dev`: start the backend through Nx.
- `npm run build`: build the backend through Nx.
- `npm test`: run backend tests through Nx.
- `npm run typecheck`: typecheck the backend through Nx.
- `npm run lint`: lint the backend through Nx.
- `npm run check`: run typecheck, lint, tests, and build through Nx.

Current planning documents:

- [Wishlist](docs/wishlist.md)
- [Execution Plan](docs/plan.md)
- [Nx Monorepo Migration Plan](docs/monorepo-plan.md)
- [Configuration](docs/configuration.md)
