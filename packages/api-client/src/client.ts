import { nestMessageFromUnknown } from './errors.js'

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
 * Returns a JSON REST helper bound to your app’s base URL (including `/api/v1`).
 * Serializes object bodies and attaches JWT when `token` is provided.
 */
export function createApiFetch(getBaseUrl: () => string) {
  return async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const base = getBaseUrl().replace(/\/$/, '')
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
        const parsed = nestMessageFromUnknown(errJson)
        if (parsed) msg = parsed
      } catch {
        /* ignore */
      }
      throw new Error(msg || `Request failed (${res.status})`)
    }

    return parseBody<T>(res)
  }
}
