export interface Job {
  id: string
  jobId: string
  summary: string
  service: string
  area: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  assignedWorker: string
  /** Customer account that created this job (web app). */
  customerUserId?: string | null
  latitude?: number | null
  longitude?: number | null
  /** Catalog service id for matching workers. */
  siteServiceId?: string | null
}
