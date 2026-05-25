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

/** Public site service card; `GET /site-services/public` returns active rows only. */
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
