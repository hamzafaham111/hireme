import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddActionLink } from '../../components/ui/AddActionLink'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useBlogData } from '../../context/BlogDataContext'
import { publicBlogPostUrl } from '../../lib/publicWebUrl'
import type { BlogPost } from '@hire-me/types'

function statusPill(status: BlogPost['status']) {
  const cls =
    status === 'published'
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
      : 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

export function BlogListPage() {
  const { postsSorted, removePost, loading } = useBlogData()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
        role="status"
      >
        Posts load from <code className="rounded bg-slate-200/80 px-1 text-xs dark:bg-slate-800">@hire-me/api</code>
        . Published items appear on the public Next.js site via the same API.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {loading ? 'Loading posts…' : 'Draft vs published controls what the marketing site shows.'}
        </p>
        <AddActionLink to="/blog/new">New post</AddActionLink>
      </div>

      {postsSorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No posts yet. Create one to try the editor and listing.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-800 dark:bg-slate-900/40">
          {postsSorted.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-white">{p.title}</span>
                  {statusPill(p.status)}
                </div>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  /blog/{p.slug} · updated {new Date(p.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {p.status === 'published' ? (
                  <a
                    href={publicBlogPostUrl(p.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    View
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Publish the post to view it on the marketing site."
                    className="cursor-not-allowed rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-400 opacity-60 dark:border-slate-600 dark:text-slate-500"
                  >
                    View
                  </button>
                )}
                <Link
                  to={`/blog/${p.id}/edit`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: p.id, title: p.title })}
                  className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete post?"
        description={
          deleteTarget ? (
            <>
              <strong className="text-slate-800 dark:text-slate-200">
                {deleteTarget.title}
              </strong>{' '}
              will be permanently removed. This cannot be undone.
            </>
          ) : null
        }
        variant="danger"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleteTarget) {
            await removePost(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
      />
    </div>
  )
}
