import type { BlogPost } from '@hire-me/types'

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
 * Published marketing posts from `apps/api` (no auth).
 * Fails soft when the API is unreachable (e.g. `next build` while the API is down).
 */
export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const base = getPublicApiBaseUrl()
  if (!base) return []
  try {
    const res = await fetch(`${base}/blog/posts`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data = await parseJson<BlogPost[]>(res)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const base = getPublicApiBaseUrl()
  if (!base) return null
  try {
    const enc = encodeURIComponent(slug)
    const res = await fetch(`${base}/blog/posts/by-slug/${enc}`, {
      next: { revalidate: 60 },
    })
    if (res.status === 404) return null
    if (!res.ok) return null
    return (await parseJson<BlogPost>(res)) ?? null
  } catch {
    return null
  }
}

export function siteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}
