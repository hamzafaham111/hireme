import Link from 'next/link'
import type { BlogPost } from '@hire-me/types'
import { BlogCardThumbnail } from '@/components/blog/BlogCardThumbnail'
import {
  extractFirstImageUrlFromMarkdown,
  resolveBlogImageUrl,
} from '@/lib/blog-card-image'
import { formatLongDate } from '@/lib/format-date'

export function BlogPostCard({ post }: { post: BlogPost }) {
  const raw = extractFirstImageUrlFromMarkdown(post.bodyMarkdown)
  const imageSrc = raw ? resolveBlogImageUrl(raw) : null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-300/60 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-brand-500/35">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full min-h-0 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <BlogCardThumbnail src={imageSrc} title={post.title} />
        </div>

        <div className="flex flex-1 flex-col px-3 py-2">
          <time
            dateTime={post.publishedAt ?? post.createdAt}
            className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            {post.publishedAt
              ? formatLongDate(post.publishedAt)
              : formatLongDate(post.createdAt)}
          </time>
          <h2 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-slate-900 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 sm:text-xl">
            {post.title}
          </h2>
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {post.excerpt}
          </p>
          {post.authorName ? (
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
              {post.authorName}
            </p>
          ) : null}
          <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
            Read article →
          </span>
        </div>
      </Link>
    </article>
  )
}
