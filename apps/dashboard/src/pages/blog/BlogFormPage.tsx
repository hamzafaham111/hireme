import MDEditor from '@uiw/react-md-editor'
import type {
  ExecuteState,
  ICommand,
  TextAreaTextApi,
} from '@uiw/react-md-editor/commands'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatImageMarkdown } from '../../components/blog/formatImageMarkdown'
import { InsertImageModal } from '../../components/blog/InsertImageModal'
import { Select } from '../../components/ui/Select'
import { useAuth } from '../../context/AuthContext'
import { useBlogData } from '../../context/BlogDataContext'
import { usePrefersDark } from '../../lib/usePrefersDark'
import type { BlogPostStatus } from '@hire-me/types'

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-indigo-400'

const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200'

export function BlogFormPage() {
  const { postId } = useParams<{ postId: string }>()
  const isEdit = Boolean(postId)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getPost, createPost, updatePost, uploadBlogImage } = useBlogData()
  const prefersDark = usePrefersDark()
  const imageApiRef = useRef<TextAreaTextApi | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const closeImageModal = useCallback(() => {
    imageApiRef.current = null
    setImageModalOpen(false)
  }, [])

  /** Replace default “![image](url)” snippet with a URL/alt dialog for clearer authoring. */
  const commandsFilter = useCallback((command: ICommand) => {
    if (command.keyCommand !== 'image') return command
    const originalExecute = command.execute
    return {
      ...command,
      execute: (state: ExecuteState, api: TextAreaTextApi) => {
        const selected = state.selectedText?.trim() ?? ''
        if (
          selected.length > 0 &&
          (selected.includes('http') || selected.includes('www.')) &&
          originalExecute
        ) {
          originalExecute(state, api)
          return
        }
        imageApiRef.current = api
        setImageModalOpen(true)
      },
    }
  }, [])

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [bodyMarkdown, setBodyMarkdown] = useState('')
  const [status, setStatus] = useState<BlogPostStatus>('draft')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) {
      setTitle('')
      setSlug('')
      setExcerpt('')
      setBodyMarkdown('')
      setStatus('draft')
      setError(null)
      return
    }
    if (!postId) return
    const p = getPost(postId)
    if (p) {
      setTitle(p.title)
      setSlug(p.slug)
      setExcerpt(p.excerpt)
      setBodyMarkdown(p.bodyMarkdown)
      setStatus(p.status)
      setError(null)
    } else {
      setError('Post not found.')
    }
  }, [isEdit, postId, getPost])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user) {
      setError('You must be signed in.')
      return
    }
    const t = title.trim()
    if (!t) {
      setError('Title is required.')
      return
    }
    setSubmitting(true)
    try {
      if (isEdit && postId) {
        await updatePost(postId, {
          title: t,
          excerpt: excerpt.trim(),
          bodyMarkdown,
          status,
          slug: slug.trim() || undefined,
        })
      } else {
        await createPost({
          title: t,
          excerpt: excerpt.trim(),
          bodyMarkdown,
          status,
          slug: slug.trim() || undefined,
          authorId: user.userId,
          authorName: user.name,
        })
      }
      navigate('/blog', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isEdit && error === 'Post not found.' && !title) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
        <Link to="/blog" className="text-sm font-medium text-indigo-600">
          Back to posts
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isEdit ? 'Edit post' : 'New post'}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Use the toolbar for headings, lists, links, and images. The excerpt is the short summary
            for blog listings and SEO — not shown as the full article body.
          </p>
        </div>

        {error ? (
          <p
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="bp-title">
            Title
          </label>
          <input
            id="bp-title"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-slug">
            Slug (optional)
          </label>
          <input
            id="bp-slug"
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from title if empty"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-excerpt">
            Excerpt
          </label>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
            One or two sentences shown on the public blog index, meta description, and social
            previews — keep it concise and compelling.
          </p>
          <textarea
            id="bp-excerpt"
            className={`${inputClass} min-h-[80px] resize-y`}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-body">
            Body (Markdown)
          </label>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
            Drag the divider to resize the editor. The image toolbar button opens a dialog: you can{' '}
            <strong className="font-medium text-slate-600 dark:text-slate-300">upload a file</strong> (saved on the
            API) or paste an external image URL. Markdown only stores the final image address.
          </p>
          <div
            className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
            data-color-mode={prefersDark ? 'dark' : 'light'}
          >
            <MDEditor
              value={bodyMarkdown}
              onChange={(v) => setBodyMarkdown(v ?? '')}
              height={440}
              visibleDragbar
              preview="live"
              commandsFilter={commandsFilter}
              textareaProps={{
                id: 'bp-body',
                name: 'bodyMarkdown',
                placeholder:
                  'Start writing… Use H1–H6, lists, links, code blocks, and images via the toolbar.',
              }}
              data-color-mode={prefersDark ? 'dark' : 'light'}
            />
          </div>
        </div>

        <InsertImageModal
          open={imageModalOpen}
          onClose={closeImageModal}
          uploadImage={uploadBlogImage}
          onInsert={(url, alt) => {
            const api = imageApiRef.current
            if (!api) return
            api.replaceSelection(formatImageMarkdown(alt, url))
            imageApiRef.current = null
          }}
        />

        <div className="max-w-xs">
          <Select
            id="bp-status"
            label="Status"
            labelClassName={labelClass}
            value={status}
            onChange={(v) => setStatus(v as BlogPostStatus)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
          <Link
            to="/blog"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
