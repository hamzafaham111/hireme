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
  /** Admin approval workflow status - whether worker has been reviewed and approved */
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'suspended'
  internalRating: number
  customerRating: number
  /** Linked marketplace account (`User` id) when the worker can log in on the web. */
  userId?: string | null
}
