'use client'

import ReactMarkdown from 'react-markdown'

/**
 * Client-rendered markdown for blog bodies. Keeps the article route as a server
 * component while isolating `react-markdown` in the client bundle.
 */
export function BlogMarkdown({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-brand-400">
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  )
}
