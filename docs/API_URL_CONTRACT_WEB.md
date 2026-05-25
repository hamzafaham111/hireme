# Web app: which API base URL to use

| Need | Mechanism |
|------|-----------|
| Public marketing data during **build** or **ISR** (blog list, site services) | `getPublicApiBaseUrl()` in [`apps/web/src/lib/public-api-base.ts`](../apps/web/src/lib/public-api-base.ts) — returns empty at build time when unset so pages degrade gracefully. |
| **Authenticated** JSON from the browser | `apiFetch` from [`apps/web/src/lib/api.ts`](../apps/web/src/lib/api.ts) — uses `NEXT_PUBLIC_API_URL` (must include `/api/v1`). |

Dashboard uses `VITE_API_URL` the same way as the web app’s authenticated helper (via `@hire-me/api-client`).

Do not call `apiFetch` from Server Components unless you intentionally pass cookies/headers; prefer the public fetch helpers for anonymous marketing content.
