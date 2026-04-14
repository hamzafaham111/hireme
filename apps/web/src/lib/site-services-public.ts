import type { SiteService } from '@hire-me/types'

import { getPublicApiBaseUrl } from '@/lib/public-api-base'

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
  const base = getPublicApiBaseUrl()
  if (!base) return []
  try {
    const res = await fetch(`${base}/site-services`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await parseJson<SiteService[]>(res)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
