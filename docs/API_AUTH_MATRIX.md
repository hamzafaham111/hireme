# API authorization matrix

JWT is issued by `POST /auth/login` (and related routes). The `role` claim is one of `admin` | `customer` | `worker` (see Prisma `DashboardRole`).

| Area | Who | Enforcement |
|------|-----|-------------|
| `/users`, `/workers` | `admin` | `RolesGuard` + `@Roles('admin')` on controllers |
| `/roles` | `admin` | Same |
| `/site-services` (non-public) | `admin` | Same on each protected route; `GET /site-services/public` is anonymous |
| `/blog` posts CRUD + uploads + `GET /blog/posts/:id` (manager) | `admin` | `RolesGuard` + `@Roles('admin')`; list/slug use optional JWT for draft visibility (see `BlogService`) |
| `/jobs` | `admin`, `customer`, `worker` | `AuthGuard('jwt')` only; **rules in `JobsService`** (scoped lists, ownership, delete admin-only) |
| `/marketplace/*` | `worker` / `customer` per route | `RolesGuard` + `@Roles(...)` on `MarketplaceController` |

Prefer **guards on controllers** for fixed role sets; keep **service-level checks** when behavior depends on resource ownership or multiple roles share an endpoint.
