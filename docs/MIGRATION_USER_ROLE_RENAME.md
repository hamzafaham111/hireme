# Follow-up PR: rename `DashboardRole` → `UserRole` (or `AppRole`)

The shared TypeScript type `DashboardRole` (`admin` | `customer` | `worker`) matches app semantics, but the Prisma enum is still named `DashboardRole` in the schema. Renaming it in the database requires a coordinated migration.

## Suggested steps (separate PR)

1. **Prisma**: Add a new enum value or rename via `@map` / migration SQL depending on PostgreSQL needs; prefer a single migration that renames the enum type or column without data loss.
2. **API**: Update `schema.prisma`, generated client imports, and any raw SQL.
3. **Packages**: Rename exported `DashboardRole` in `@hire-me/types` to `UserRole` (or keep a deprecated alias for one release).
4. **Clients**: Update dashboard and web imports.

## Rollout

- Run migrations on staging first; verify login, JWT payloads, and role guards.
- Coordinate deploy so API and clients do not drift on the enum name during the window.

This file documents intent only; it is not an executed migration.
