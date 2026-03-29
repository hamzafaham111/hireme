# Hire Me — monorepo

Internal operations dashboard, public marketing site, shared TypeScript types, and a reserved slot for the API. **Each app under `apps/` is meant to build and deploy on its own.**

## Layout

| Path | Package | Description |
|------|---------|-------------|
| `apps/dashboard` | `@hire-me/dashboard` | Vite + React internal team dashboard |
| `apps/web` | `@hire-me/web` | Next.js public / customer site |
| `apps/api` | `@hire-me/api` | Placeholder for Nest (or other) backend |
| `packages/types` | `@hire-me/types` | Shared domain types (Worker, Job, DashboardUser, …) |
| `packages/config-typescript` | `@hire-me/config-typescript` | Optional shared `tsconfig` bases |

## Requirements

- Node 20+

## Install

From the repository root:

```bash
npm install
```

npm hoists dependencies to the root `node_modules` and links workspace packages.

## Scripts (run from root)

| Command | Action |
|---------|--------|
| `npm run dev` | Start the **dashboard** (same as `dev:dashboard`) |
| `npm run dev:dashboard` | Vite dev server |
| `npm run dev:web` | Next.js dev server (`apps/web`) |
| `npm run build` | `build` in every workspace that defines it |
| `npm run build:dashboard` | Production build for the dashboard |
| `npm run build:web` | Production build for the marketing site |
| `npm run lint` | Lint all workspaces that define `lint` |

Or run a script inside one app:

```bash
npm run dev --workspace=@hire-me/web
```

## Adding another app

1. Create `apps/<name>/` with its own `package.json` (`"name": "@hire-me/<name>"`, `"private": true`).
2. Root `workspaces` already includes `apps/*`; run `npm install` again.
3. Add a root script alias if you want, e.g. `"dev:admin": "npm run dev --workspace=@hire-me/admin"`.

## Shared code

- Put **cross-app contracts** in `packages/types` (later you can add Zod or OpenAPI codegen there).
- Keep **app-specific UI and routes** inside each app.

## Deploying

Point your host at the app directory (e.g. Vercel project root `apps/web`, static or Node hosting for `apps/dashboard` after `npm run build` in that workspace). Add a real process under `apps/api` when you implement a backend.
