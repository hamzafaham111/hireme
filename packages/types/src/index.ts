/**
 * Shared domain types for Hire Me (dashboard, API, and future clients).
 * Keep this package free of React or framework imports.
 */

export type { Worker } from './worker'
export type { Job } from './job'
export type { Customer } from './customer'
export type { DashboardRole, DashboardUser } from './user'
export type { BlogPost, BlogPostStatus } from './blog'
export {
  SITE_SERVICE_ICON_KEYS,
  isSiteServiceIconKey,
  type SiteServiceIconKey,
  type SiteService,
  type SiteServiceSavePayload,
} from './site-service'
