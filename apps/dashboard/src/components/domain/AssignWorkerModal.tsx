import { useEffect, useState } from 'react'
import type { Job, Worker } from '@hire-me/types'
import { WorkerAssignCombobox } from './WorkerAssignCombobox'

const labelClass =
  'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200'

export interface AssignWorkerModalProps {
  job: Job | null
  open: boolean
  onClose: () => void
  activeWorkers: Worker[]
  onSave: (job: Job, assignedWorker: string) => void | Promise<void>
}

/**
 * Quick-assign flow from the jobs table without opening the full edit form.
 */
export function AssignWorkerModal({
  job,
  open,
  onClose,
  activeWorkers,
  onSave,
}: AssignWorkerModalProps) {
  const [assigned, setAssigned] = useState('—')

  useEffect(() => {
    if (job && open) setAssigned(job.assignedWorker)
  }, [job, open])

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

  if (!open || !job) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity dark:bg-black/60"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-worker-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="assign-worker-title"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          Assign worker
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
            {job.jobId}
          </span>
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
          {job.summary}
        </p>

        <div className="mt-6">
          <WorkerAssignCombobox
            activeWorkers={activeWorkers}
            value={assigned}
            onChange={setAssigned}
            label="Worker"
            labelClassName={labelClass}
            hint="Search by name or Worker ID. Only active workers are listed."
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(job, assigned)
              onClose()
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Save assignment
          </button>
        </div>
      </div>
    </div>
  )
}
