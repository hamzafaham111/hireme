/** Base URL including `/api/v1` (e.g. `http://localhost:4000/api/v1`). */
export function apiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined
  const trimmed = raw?.trim()
  return trimmed && trimmed.length > 0 ? trimmed.replace(/\/$/, '') : 'http://localhost:4000/api/v1'
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  /** When set, sends `Authorization: Bearer …`. */
  token?: string | null
  body?: BodyInit | Record<string, unknown> | null
}

async function parseBody<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

/**
 * JSON REST helper for the Hire Me API. Serializes object bodies and attaches JWT when provided.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const base = apiBaseUrl()
  const url = path.startsWith('http')
    ? path
    : `${base}${path.startsWith('/') ? '' : '/'}${path}`

  const { token, body, headers: initHeaders, ...rest } = options
  const headers = new Headers(initHeaders)

  let payload: BodyInit | undefined
  if (body !== undefined && body !== null) {
    if (typeof body === 'string' || body instanceof FormData || body instanceof Blob) {
      payload = body
    } else {
      headers.set('Content-Type', 'application/json')
      payload = JSON.stringify(body)
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, { ...rest, headers, body: payload })

  if (!res.ok) {
    let msg = res.statusText
    try {
      const errJson: unknown = await res.json()
      if (errJson && typeof errJson === 'object' && 'message' in errJson) {
        const m = (errJson as { message: unknown }).message
        if (Array.isArray(m)) msg = m.join(', ')
        else if (typeof m === 'string') msg = m
      }
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Request failed (${res.status})`)
  }

  return parseBody<T>(res)
}
