import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogMarkdown } from '@/components/blog'
import { siteName } from '@/lib/site'
import { fetchPostBySlug, fetchPublishedPosts, siteOrigin } from '@/lib/blogPublic'
import { formatLongDate } from '@/lib/format-date'
import { sectionHeadingClass } from '@/lib/typography'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)
  if (!post) {
    return { title: 'Post not found' }
  }
  const url = `${siteOrigin()}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      siteName,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
        <Link href="/blog" className="hover:underline">
          ← Blog
        </Link>
      </p>
      <header className="mt-6">
        <h1 className={sectionHeadingClass}>{post.title}</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{post.excerpt}</p>
        <p className="mt-4 text-sm text-slate-500">
          {post.publishedAt ? formatLongDate(post.publishedAt) : null}
          {post.authorName ? ` · ${post.authorName}` : null}
        </p>
      </header>
      <div className="mt-10 border-t border-slate-200 pt-10 dark:border-slate-800">
        <BlogMarkdown source={post.bodyMarkdown} />
      </div>
    </article>
  )
}
