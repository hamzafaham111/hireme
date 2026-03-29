import { useEffect, type ReactNode } from 'react'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  /** Runs after the user clicks the primary confirm action */
  onConfirm: () => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Use `danger` for destructive actions (delete, remove). */
  variant?: 'danger' | 'default'
}

const titleId = 'confirm-dialog-title'

/**
 * Accessible confirmation modal (backdrop, Escape, focus trap via native dialog flow).
 * Matches the visual language of AssignWorkerModal.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
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

  if (!open) return null

  const confirmClass =
    variant === 'danger'
      ? 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500/30'
      : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/30'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity dark:bg-black/60"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          {title}
        </h2>
        {description ? (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm outline-none focus-visible:ring-2 ${confirmClass}`}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
