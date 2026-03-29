/**
 * Base URL of the public Next.js marketing site.
 * Configure `VITE_PUBLIC_WEB_URL` when the dashboard and web app run on different origins.
 */
export function publicWebBaseUrl(): string {
  const raw = (import.meta.env.VITE_PUBLIC_WEB_URL as string | undefined)?.trim()
  if (raw) return raw.replace(/\/$/, '')
  return 'http://localhost:3000'
}

/** Absolute URL for a blog post on the marketing site (`/blog/[slug]`). */
export function publicBlogPostUrl(slug: string): string {
  const base = publicWebBaseUrl()
  const path = `/blog/${encodeURIComponent(slug)}`
  return `${base}${path}`
}
