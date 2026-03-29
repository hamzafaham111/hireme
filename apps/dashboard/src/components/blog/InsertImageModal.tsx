import { useEffect, useId, useRef, useState } from 'react'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400'

const acceptTypes = 'image/jpeg,image/png,image/gif,image/webp'

export interface InsertImageModalProps {
  open: boolean
  onClose: () => void
  onInsert: (url: string, alt: string) => void
  /** When set, users can pick a file; it is uploaded to the API and the returned URL is used. */
  uploadImage?: (file: File) => Promise<string>
}

/**
 * Insert `![](url)` markdown: upload from disk (authenticated API) or paste an external URL.
 */
export function InsertImageModal({
  open,
  onClose,
  onInsert,
  uploadImage,
}: InsertImageModalProps) {
  const titleId = useId()
  const urlId = useId()
  const altId = useId()
  const fileId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setUrl('')
    setAlt('')
    setUploading(false)
    setUploadError(null)
    if (fileRef.current) fileRef.current.value = ''
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadImage) return
    setUploading(true)
    setUploadError(null)
    try {
      const publicUrl = await uploadImage(file)
      setUrl(publicUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (!open) return null

  const submit = () => {
    const u = url.trim()
    if (!u || uploading) return
    onInsert(u, alt)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity dark:bg-black/60"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          Insert image
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Upload a file from your computer (stored on the API and linked in Markdown) or paste an
          image URL. JPEG, PNG, GIF, or WebP — max 5&nbsp;MB.
        </p>

        {uploadImage ? (
          <div className="mt-4">
            <label
              htmlFor={fileId}
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Upload from computer
            </label>
            <input
              ref={fileRef}
              id={fileId}
              type="file"
              accept={acceptTypes}
              disabled={uploading}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 dark:text-slate-400 dark:file:bg-indigo-950/50 dark:file:text-indigo-200"
              onChange={onPickFile}
            />
            {uploading ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Uploading…</p>
            ) : null}
            {uploadError ? (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400" role="alert">
                {uploadError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor={urlId} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Image URL {uploadImage ? <span className="font-normal text-slate-500">(or after upload)</span> : null}{' '}
              <span className="text-rose-600 dark:text-rose-400">*</span>
            </label>
            <input
              id={urlId}
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://…"
              className={inputClass}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              readOnly={uploading}
            />
          </div>
          <div>
            <label htmlFor={altId} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Alt text (optional)
            </label>
            <input
              id={altId}
              type="text"
              placeholder="Describe the image for accessibility"
              className={inputClass}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!url.trim() || uploading}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={submit}
          >
            Insert image
          </button>
        </div>
      </div>
    </div>
  )
}
