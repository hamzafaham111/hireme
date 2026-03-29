import type { BlogPost } from '@hire-me/types'

function apiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  return raw && raw.length > 0 ? raw.replace(/\/$/, '') : 'http://localhost:4000/api/v1'
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

/**
 * Published marketing posts from `apps/api` (no auth).
 * Fails soft when the API is unreachable (e.g. `next build` while the API is down).
 */
export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${apiBase()}/blog/posts`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return parseJson<BlogPost[]>(res)
  } catch {
    return []
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const enc = encodeURIComponent(slug)
    const res = await fetch(`${apiBase()}/blog/posts/by-slug/${enc}`, {
      next: { revalidate: 60 },
    })
    if (res.status === 404) return null
    if (!res.ok) return null
    return parseJson<BlogPost>(res)
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
