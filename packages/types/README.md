# @hire-me/types

Shared TypeScript interfaces for domain entities (`Worker`, `Job`, `DashboardUser`).

- Import from apps: `import type { Job } from '@hire-me/types'`
- When the API exists, depend on this package from `@hire-me/api` and map entities to/from your ORM.
- Consider adding **Zod** schemas here next so runtime validation matches these types.
