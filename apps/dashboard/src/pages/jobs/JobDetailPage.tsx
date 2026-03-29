import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { JobStatusBadge } from '../../components/domain/StatusBadges'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useOperationsData } from '../../context/OperationsDataContext'

const actionBtn =
  'rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-colors'

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { getJob, deleteJob } = useOperationsData()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const job = jobId ? getJob(jobId) : undefined

  if (!job) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600 dark:text-slate-300">Job not found.</p>
        <Link
          to="/jobs"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to jobs
        </Link>
      </div>
    )
  }

  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Job ID', value: <code className="text-sm">{job.jobId}</code> },
    { label: 'Request summary', value: job.summary },
    { label: 'Service', value: job.service },
    { label: 'Area', value: job.area },
    {
      label: 'Status',
      value: <JobStatusBadge status={job.status} />,
    },
    { label: 'Assigned worker', value: job.assignedWorker },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {job.jobId}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {job.service} · {job.area}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/jobs"
            className={`${actionBtn} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
          >
            Back to list
          </Link>
          <Link
            to={`/jobs/${job.id}/edit`}
            className={`${actionBtn} bg-indigo-600 font-semibold text-white hover:bg-indigo-500`}
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className={`${actionBtn} border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/40`}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
        <dl className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-8"
            >
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {row.label}
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete job?"
        description={
          <>
            Job{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
              {job.jobId}
            </code>{' '}
            will be removed. Demo only — prefer status changes in production.
          </>
        }
        variant="danger"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={async () => {
          await deleteJob(job.id)
          navigate('/jobs', { replace: true })
        }}
      />
    </div>
  )
}
