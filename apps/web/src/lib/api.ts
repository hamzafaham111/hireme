import { createApiFetch } from '@hire-me/api-client'

/** Base URL including `/api/v1` (e.g. `http://localhost:4000/api/v1`). */
export function apiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL as string | undefined
  const trimmed = raw?.trim()
  return trimmed && trimmed.length > 0 ? trimmed.replace(/\/$/, '') : 'http://localhost:4000/api/v1'
}

/**
 * JSON REST helper for the Hire Me API from the Next.js web app.
 */
export const apiFetch = createApiFetch(apiBaseUrl)

export type { ApiFetchOptions } from '@hire-me/api-client'
