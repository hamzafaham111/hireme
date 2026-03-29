import type { MetadataRoute } from 'next'
import { fetchPublishedPosts, siteOrigin } from '@/lib/blogPublic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin()
  const posts = await fetchPublishedPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: origin, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${origin}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${origin}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${origin}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogEntries]
}
