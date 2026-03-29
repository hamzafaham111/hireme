/** Long-form locale date for blog post bylines (e.g. "March 29, 2026"). */
export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
