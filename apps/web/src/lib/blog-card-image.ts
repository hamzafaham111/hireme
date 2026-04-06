import { siteOrigin } from '@/lib/blogPublic'

/**
 * API host for static files (`/uploads/...`), derived from `NEXT_PUBLIC_API_URL`
 * (strip trailing `/api/v1`).
 */
export function apiStaticOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '') ||
    'http://localhost:4000/api/v1'
  return raw.replace(/\/api\/v1$/i, '')
}

/**
 * First markdown `![](url)` or `<img src="...">` in post body, for card thumbnails.
 */
export function extractFirstImageUrlFromMarkdown(markdown: string): string | null {
  if (!markdown?.trim()) return null

  const mdImg = /!\[[^\]]*]\(\s*<?([^\s)<>]+)>?\s*(?:["'][^"']*["'])?\s*\)/.exec(
    markdown,
  )
  if (mdImg?.[1]) return mdImg[1].trim()

  const htmlImg = /<img[^>]+src=["']([^"']+)["']/i.exec(markdown)
  if (htmlImg?.[1]) return htmlImg[1].trim()

  return null
}

/**
 * Turn relative or protocol-relative URLs into an absolute URL the browser can load.
 */
export function resolveBlogImageUrl(raw: string): string {
  const t = raw.trim()
  if (/^https?:\/\//i.test(t)) return rewriteLoopbackUploadsToConfiguredApi(t)
  if (t.startsWith('//')) return rewriteLoopbackUploadsToConfiguredApi(`https:${t}`)
  if (t.startsWith('/uploads/')) return `${apiStaticOrigin()}${t}`
  if (t.startsWith('/')) return `${siteOrigin()}${t}`
  return `${siteOrigin()}/${t.replace(/^\.\//, '')}`
}

/**
 * Blog bodies often store `http://localhost:4000/uploads/...` from local authoring.
 * If `NEXT_PUBLIC_API_URL` points at a public API host, rewrite so the browser can load the file.
 */
export function rewriteLoopbackUploadsToConfiguredApi(absoluteUrl: string): string {
  try {
    const parsed = new URL(absoluteUrl)
    if (!parsed.pathname.startsWith('/uploads/')) return absoluteUrl

    const loopback =
      parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    if (!loopback) return absoluteUrl

    const base = apiStaticOrigin().replace(/\/$/, '')
    const configured = new URL(base.match(/^https?:\/\//i) ? base : `https://${base}`)
    const configuredLoopback =
      configured.hostname === 'localhost' || configured.hostname === '127.0.0.1'
    if (configuredLoopback) return absoluteUrl

    return `${configured.origin}${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return absoluteUrl
  }
}
