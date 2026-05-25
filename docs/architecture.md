# Monorepo architecture

## Folder conventions

### Repository root

- **`apps/`** — deployable apps only (`api`, `web`, `dashboard`).
- **`packages/`** — shared libraries (`types`, `api-client`, `site-icons`, `config-typescript`).
- **`docs/`** — ADRs, migration notes, and this file.

### `packages/types`

Domain modules (`worker.ts`, `job.ts`, …) re-exported from `src/index.ts`. No React.

### `packages/api-client`

Shared `createApiFetch` and Nest error parsing (`nestMessageFromUnknown`). Apps pass `getBaseUrl` from env (`NEXT_PUBLIC_*` vs `VITE_*`).

### `apps/api` (NestJS)

- **`src/<domain>/`** — feature modules (controller, service, dto).
- **`src/common/`** — Prisma, guards (`RolesGuard`), decorators (`@Roles()`), mappers.
- **`prisma/`** — schema and migrations.

Authorization: see [API_AUTH_MATRIX.md](./API_AUTH_MATRIX.md).

### `apps/web` (Next.js App Router)

- **`src/app/`** — routes, layouts, Route Handlers under `app/api/`.
- **`src/components/`** — UI; marketing sections may be **async Server Components** that `fetch` public API data.
- **`src/lib/`** — utilities and API helpers without JSX.

**API URLs:** use `getPublicApiBaseUrl()` / `fetchPublicSiteServices` for **SSG/ISR-safe** public data (see [`apps/web/src/lib/public-api-base.ts`](../apps/web/src/lib/public-api-base.ts)). Use `apiFetch` from `src/lib/api.ts` for **authenticated** client calls (`NEXT_PUBLIC_API_URL`).

**RSC:** marketing pages (`/`, `/blog`, `/terms`, …) stay server-first; keep `'use client'` for maps, auth, and interactive shells. Marketplace routes under `app/(marketplace)/` may stay client-heavy until you add middleware + httpOnly cookies (later phase).

### `apps/dashboard` (Vite)

- **`src/pages/`** — React Router entries.
- **`src/providers/`** — global React providers (auth, operations data, blog data).
- **`src/components/`** — layout shell and domain UI.

## Related docs

- [MIGRATION_USER_ROLE_RENAME.md](./MIGRATION_USER_ROLE_RENAME.md) — optional Prisma enum rename PR.
- [API_AUTH_MATRIX.md](./API_AUTH_MATRIX.md) — who can call which API routes.
