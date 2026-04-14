/**
 * Allocates the next immutable site service key (SS-01, SS-02, …).
 * Parses existing `SS-<digits>` keys and increments; supports SS-100+ without padding cap.
 */
const SERVICE_KEY_RE = /^SS-(\d+)$/i

export function parseMaxServiceKeyIndex(keys: readonly string[]): number {
  let max = 0
  for (const k of keys) {
    const m = SERVICE_KEY_RE.exec(k.trim())
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return max
}

export function formatServiceKey(n: number): string {
  return `SS-${String(n).padStart(2, '0')}`
}
