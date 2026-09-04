# Frontend

React 19 application managed by Nx and built with Vite.

## Commands

- `nx serve frontend` — run the app at `http://localhost:4200`
- `nx storybook frontend` — develop components at `http://localhost:6006`
- `nx build frontend` — create the production bundle
- `nx test frontend` — run Vitest tests

During local development, Vite proxies Fastify routes to `http://127.0.0.1:3000`. Set `VITE_API_URL` when the API is hosted elsewhere.

UI primitives live in `src/components/ui`, reusable layouts/composites in `src/components`, and transport/state concerns in `src/services` and `src/store`.
