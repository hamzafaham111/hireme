const DEFAULT_LOCAL_API = 'http://localhost:4000/api/v1'

/**
 * Whether to avoid defaulting to localhost during production *build* (static generation).
 * `next start` and `next dev` should still reach a local API when env is unset.
 */
function shouldSkipDefaultLocalApi(): boolean {
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) return false
  if (process.env.NODE_ENV !== 'production') return false

  if (process.env.npm_lifecycle_event === 'build') return true
  if (process.env.CI === 'true') return true
  if (process.env.VERCEL === '1') return true
  // e.g. `npx next build` (no npm lifecycle) — still the compile/prerender pass
  if (process.argv.includes('build')) return true

  return false
}

/**
 * Base URL for public (no-auth) API routes used by the marketing site.
 *
 * When unset, we use the local API in dev and in `next start`, but skip network calls
 * during `next build` so static generation does not log `ECONNREFUSED` against a dead
 * localhost server. Set `NEXT_PUBLIC_API_URL` in CI/Vercel to prerender real data.
 */
export function getPublicApiBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (raw && raw.length > 0) return raw.replace(/\/$/, '')

  if (shouldSkipDefaultLocalApi()) return null

  return DEFAULT_LOCAL_API
}
