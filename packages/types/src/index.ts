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
  /** Resolved catalog title when `siteServiceId` is set; legacy fallback string otherwise. */
  service: string
  /** FK to site service catalog; source of truth for service assignment. */
  siteServiceId: string | null
  /** Worker can provide multiple catalog services. */
  siteServiceIds: string[]
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

/**
 * Keys map to SVG components in the public web app (`site-service-icon-registry.tsx`).
 * The API validates `iconKey` against this list.
 */
export const SITE_SERVICE_ICON_KEYS = [
  'express',
  'shopping-bag',
  'grocery',
  'cooking',
  'pharmacy',
  'bank-paper',
  'gift',
  'bulky',
  'car',
  'queue',
  'paw',
  'home-key',
  'real-estate',
  'cleaning',
  'tour-guide',
  'translate',
  'tutor',
  'briefcase',
  'message-spark',
] as const

export type SiteServiceIconKey = (typeof SITE_SERVICE_ICON_KEYS)[number]

export function isSiteServiceIconKey(value: string): value is SiteServiceIconKey {
  return (SITE_SERVICE_ICON_KEYS as readonly string[]).includes(value)
}

/** Public site service card; `GET /site-services` returns active rows only. */
export interface SiteService {
  id: string
  /** Immutable code (e.g. SS-01) for ops / future worker linkage; use `slug` for detail URLs. */
  serviceKey: string
  slug: string
  title: string
  shortDescription: string
  iconKey: string
  iconImageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Dashboard create/update body for `POST/PATCH /site-services`. */
export interface SiteServiceSavePayload {
  id?: string
  title: string
  shortDescription: string
  iconKey: string
  iconImageUrl: string | null
  sortOrder: number
  isActive: boolean
  slug?: string
}

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
