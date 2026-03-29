/**
 * Shared domain types for Hire Me (dashboard, API, and future clients).
 * Keep this package free of React or framework imports.
 */

export interface Worker {
  id: string
  workerId: string
  name: string
  phone: string
  location: string
  service: string
  status: 'active' | 'not-active' | 'on-hold' | 'canceled'
  internalRating: number
  customerRating: number
}

export interface Job {
  id: string
  jobId: string
  summary: string
  service: string
  area: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  assignedWorker: string
}

/**
 * Internal dashboard operator (Nest + JWT later). `password` is demo-only in local storage.
 * `content_editor` — blog/CMS only; no workers/jobs/users admin.
 */
export type DashboardRole =
  | 'superadmin'
  | 'admin'
  | 'agent'
  | 'content_editor'

export interface DashboardUser {
  id: string
  name: string
  email: string
  role: DashboardRole
  status: 'active' | 'invited'
  password: string
}

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
