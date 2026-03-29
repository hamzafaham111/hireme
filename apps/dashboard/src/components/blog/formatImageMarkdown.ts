/**
 * Builds standard Markdown for an image. Wraps the URL in angle brackets when it
 * contains parentheses so parsers (e.g. react-markdown) still resolve it correctly.
 */
export function formatImageMarkdown(alt: string, url: string): string {
  const safeAlt = (alt.trim() || 'Image').replace(/[\[\]]/g, '')
  const u = url.trim()
  if (!u) return ''
  const dest = /[()]/.test(u) ? `<${u}>` : u
  // Blank lines help the preview treat the image as its own block.
  return `\n\n![${safeAlt}](${dest})\n\n`
}
