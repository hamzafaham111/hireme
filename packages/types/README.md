# @hire-me/types

Shared TypeScript interfaces for domain entities (`Worker`, `Job`, `DashboardUser`).

- Import from apps: `import type { Job } from '@hire-me/types'`
- When the API exists, depend on this package from `@hire-me/api` and map entities to/from your ORM.
- **Vite / Rollup consumers (e.g. `@hire-me/dashboard`)**: the published CJS `dist` entry can lose named exports during bundling. The dashboard aliases `@hire-me/types` to `packages/types/src/index.ts` in `apps/dashboard/vite.config.ts` so the TS source is bundled directly. If you remove that alias, prefer an ESM-friendly `exports` map for this package or import from `dist` in a way your bundler resolves cleanly.
- Consider adding **Zod** schemas here next so runtime validation matches these types.
