import type { Metadata } from 'next'
import { BlogPostCard } from '@/components/blog'
import { fetchPublishedPosts, siteOrigin } from '@/lib/blogPublic'
import { siteName } from '@/lib/site'
import { sectionHeadingClass } from '@/lib/typography'

export const metadata: Metadata = {
  title: 'Blog',
  description: `Tips, updates, and guides from ${siteName}.`,
  alternates: { canonical: `${siteOrigin()}/blog` },
}

export default async function BlogIndexPage() {
  const posts = await fetchPublishedPosts()

  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h1 className={sectionHeadingClass}>Blog</h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            News, tips, and guides from our team.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            No posts yet. Publish from the operations dashboard when ready.
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((p) => (
              <li key={p.id} className="min-h-0">
                <BlogPostCard post={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
