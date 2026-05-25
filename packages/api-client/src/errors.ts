/**
 * Parses NestJS-style `{ message: string | string[] }` bodies from failed JSON responses.
 * Returns null when the payload does not match that shape.
 */
export function nestMessageFromUnknown(errJson: unknown): string | null {
  if (!errJson || typeof errJson !== 'object' || !('message' in errJson)) return null
  const m = (errJson as { message: unknown }).message
  if (Array.isArray(m)) return m.join(', ')
  if (typeof m === 'string') return m
  return null
}
