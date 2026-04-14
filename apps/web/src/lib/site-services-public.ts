import type { SiteService } from '@hire-me/types'

function apiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  return raw && raw.length > 0 ? raw.replace(/\/$/, '') : 'http://localhost:4000/api/v1'
}

async function parseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

/**
 * Active site service cards for the homepage (no auth).
 * Fails soft when the API is unreachable (e.g. build without API).
 */
export async function fetchPublicSiteServices(): Promise<SiteService[]> {
  try {
    const res = await fetch(`${apiBase()}/site-services`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await parseJson<SiteService[]>(res)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
