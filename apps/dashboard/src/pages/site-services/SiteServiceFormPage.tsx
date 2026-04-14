import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Select } from '../../components/ui/Select'
import { useAuth } from '../../context/AuthContext'
import { useOperationsData } from '../../context/OperationsDataContext'
import { apiFetch } from '../../lib/api'
import { formInputClass, formLabelClass } from '../../lib/formStyles'
import {
  isSiteServiceIconKey,
  SITE_SERVICE_ICON_KEYS,
  type SiteServiceSavePayload,
} from '@hire-me/types'

const iconKeyOptions = SITE_SERVICE_ICON_KEYS.map((k) => ({ value: k, label: k }))

export function SiteServiceFormPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const isEdit = Boolean(serviceId)
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { getSiteService, saveSiteService, loading: opsLoading } = useOperationsData()

  const existing = isEdit && serviceId ? getSiteService(serviceId) : undefined

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [iconKey, setIconKey] = useState<string>(SITE_SERVICE_ICON_KEYS[0])
  const [iconImageUrl, setIconImageUrl] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isEdit || !serviceId) {
      setSlug('')
      setTitle('')
      setShortDescription('')
      setIconKey(SITE_SERVICE_ICON_KEYS[0])
      setIconImageUrl('')
      setSortOrder(0)
      setIsActive(true)
      setError(null)
      return
    }
    const s = getSiteService(serviceId)
    if (s) {
      setSlug(s.slug)
      setTitle(s.title)
      setShortDescription(s.shortDescription)
      setIconKey(isSiteServiceIconKey(s.iconKey) ? s.iconKey : SITE_SERVICE_ICON_KEYS[0])
      setIconImageUrl(s.iconImageUrl ?? '')
      setSortOrder(s.sortOrder)
      setIsActive(s.isActive)
    }
  }, [isEdit, serviceId, getSiteService])

  const handleIconFile = async (file: File | null) => {
    if (!file || !accessToken) return
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await apiFetch<{ url: string }>('/site-services/uploads/icon', {
        method: 'POST',
        token: accessToken,
        body: fd,
      })
      if (res?.url) setIconImageUrl(res.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !shortDescription.trim()) {
      setError('Title and short description are required.')
      return
    }

    setSubmitting(true)
    try {
      const payload: SiteServiceSavePayload = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        iconKey,
        iconImageUrl: iconImageUrl.trim() ? iconImageUrl.trim() : null,
        sortOrder: Number(sortOrder) || 0,
        isActive,
      }
      if (slug.trim()) payload.slug = slug.trim()
      if (isEdit && serviceId) payload.id = serviceId

      await saveSiteService(payload)
      navigate('/site-services', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isEdit && serviceId && !opsLoading && !existing) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          Site service not found.
        </p>
        <Link to="/site-services" className="text-sm font-medium text-indigo-600">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
      >
        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="site-svc-title" className={formLabelClass}>
            Title
          </label>
          <input
            id="site-svc-title"
            className={formInputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="site-svc-slug" className={formLabelClass}>
            Slug (optional)
          </label>
          <input
            id="site-svc-slug"
            className={formInputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from title if empty"
            maxLength={100}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Use the slug later for public detail URLs; it can differ from the service key.
          </p>
        </div>

        <div>
          <span className={formLabelClass}>Service key</span>
          {isEdit && existing ? (
            <p
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-100"
              aria-live="polite"
            >
              {existing.serviceKey}
            </p>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 px-3.5 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              Assigned when you save (e.g. SS-19). Cannot be changed.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="site-svc-desc" className={formLabelClass}>
            Short description
          </label>
          <textarea
            id="site-svc-desc"
            className={`${formInputClass} min-h-[88px] resize-y`}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            maxLength={500}
          />
        </div>

        <div>
          <span className={formLabelClass}>Icon key</span>
          <Select
            value={iconKey}
            onChange={setIconKey}
            options={iconKeyOptions}
            ariaLabel="Icon key"
          />
        </div>

        <div>
          <label htmlFor="site-svc-icon-url" className={formLabelClass}>
            Icon image URL (optional — overrides SVG)
          </label>
          <input
            id="site-svc-icon-url"
            className={formInputClass}
            value={iconImageUrl}
            onChange={(e) => setIconImageUrl(e.target.value)}
            placeholder="https://…"
          />
          <div className="mt-2">
            <label className="text-xs text-slate-600 dark:text-slate-400">
              Or upload
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="ml-2 text-xs"
                disabled={uploading || !accessToken}
                onChange={(e) => void handleIconFile(e.target.files?.[0] ?? null)}
              />
              {uploading ? <span className="ml-2">Uploading…</span> : null}
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="site-svc-order" className={formLabelClass}>
              Sort order
            </label>
            <input
              id="site-svc-order"
              type="number"
              className={formInputClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-slate-300"
              />
              Visible on public site
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
          </button>
          <Link
            to="/site-services"
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
