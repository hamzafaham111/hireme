export type BlogPostStatus = 'draft' | 'published'

/** Marketing blog post; stored by the API, rendered on the public Next.js site. */
export interface BlogPost {
  id: string
  /** URL segment, unique */
  slug: string
  title: string
  /** Short SEO / listing blurb */
  excerpt: string
  bodyMarkdown: string
  status: BlogPostStatus
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}
