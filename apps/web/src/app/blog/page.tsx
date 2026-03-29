import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchPublishedPosts, siteOrigin } from '@/lib/blogPublic'
import { formatLongDate } from '@/lib/format-date'
import { siteName } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Blog',
  description: `Tips, updates, and guides from ${siteName}.`,
  alternates: { canonical: `${siteOrigin()}/blog` },
}

export default async function BlogIndexPage() {
  const posts = await fetchPublishedPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Blog
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">News and guides from our team.</p>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-slate-500 dark:text-slate-500">
          No posts yet. Publish from the operations dashboard when ready.
        </p>
      ) : (
        <ul className="mt-10 space-y-8">
          {posts.map((p) => (
            <li key={p.id}>
              <article>
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-brand-700 transition hover:text-brand-600 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{p.excerpt}</p>
                {p.publishedAt ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {formatLongDate(p.publishedAt)}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
