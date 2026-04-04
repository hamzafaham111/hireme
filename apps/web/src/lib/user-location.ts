/**
 * Persisted user area for the marketing site (coords + human label).
 * Used by the header now; same shape can feed future “services near you” APIs.
 */
export const USER_LOCATION_STORAGE_KEY = 'hire-me:user-location:v1' as const

export type StoredUserLocation = {
  lat: number
  lng: number
  label: string
  updatedAt: string
}

export function readStoredUserLocation(): StoredUserLocation | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(USER_LOCATION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const o = parsed as Record<string, unknown>
    const lat = Number(o.lat)
    const lng = Number(o.lng)
    const label = typeof o.label === 'string' ? o.label.trim() : ''
    const updatedAt = typeof o.updatedAt === 'string' ? o.updatedAt : ''
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !label) return null
    return { lat, lng, label, updatedAt }
  } catch {
    return null
  }
}

export function writeStoredUserLocation(value: StoredUserLocation): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* quota / private mode */
  }
}
