import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable } from '../../components/data/DataTable'
import { AssignWorkerModal } from '../../components/domain/AssignWorkerModal'
import { JobStatusBadge } from '../../components/domain/StatusBadges'
import { IconAssignWorker } from '../../components/icons/AssignWorkerIcon'
import { AddActionLink } from '../../components/ui/AddActionLink'
import {
  ListFilterToolbar,
  type StatusFilterOption,
} from '../../components/ui/ListFilterToolbar'
import { useOperationsData } from '../../context/OperationsDataContext'
import type { DataTableColumn } from '../../types/dataTable'
import type { Job } from '@hire-me/types'

const JOB_STATUS_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function jobMatchesSearch(job: Job, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const blob = [
    job.jobId,
    job.summary,
    job.service,
    job.area,
    job.status,
    job.assignedWorker,
  ]
    .join(' ')
    .toLowerCase()
  return blob.includes(q)
}

/** Treat empty, hyphen, or em dash as “no worker yet” for the quick-assign control. */
function isJobUnassigned(job: Job): boolean {
  const a = job.assignedWorker?.trim() ?? ''
  if (!a) return true
  if (a === '—' || a === '-') return true
  return false
}

export function JobsListPage() {
  const { jobs, workers, saveJob } = useOperationsData()
  const [assignJob, setAssignJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (statusFilter && j.status !== statusFilter) return false
      return jobMatchesSearch(j, searchQuery)
    })
  }, [jobs, statusFilter, searchQuery])

  const activeWorkers = useMemo(
    () => workers.filter((w) => w.status === 'active'),
    [workers],
  )

  const columns: DataTableColumn<Job>[] = [
    {
      key: 'jobId',
      header: 'Job ID',
      cell: (row) => (
        <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {row.jobId}
        </code>
      ),
    },
    { key: 'summary', header: 'Request summary', className: 'max-w-[280px]' },
    { key: 'service', header: 'Service' },
    { key: 'area', header: 'Area' },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <JobStatusBadge status={row.status} />,
    },
    { key: 'assignedWorker', header: 'Assigned worker' },
    {
      key: 'id',
      header: 'Actions',
      headerClassName:
        'min-w-[220px] whitespace-nowrap text-right align-middle',
      className: 'whitespace-nowrap text-right align-middle',
      cell: (row) => (
        <div className="flex flex-row flex-nowrap items-center justify-end gap-2">
          {isJobUnassigned(row) ? (
            <button
              type="button"
              aria-label={`Assign worker to ${row.jobId}`}
              onClick={() => setAssignJob(row)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-indigo-200/90 bg-indigo-50/90 px-2 py-1 text-xs font-medium text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-200 dark:hover:bg-indigo-900/50"
            >
              <IconAssignWorker className="size-3.5 shrink-0 opacity-90" />
              Assign
            </button>
          ) : null}
          <Link
            to={`/jobs/${row.id}`}
            className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
          >
            View
          </Link>
          <Link
            to={`/jobs/${row.id}/edit`}
            className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Edit
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Jobs created from customer requests. Pending = not assigned yet; in
        progress = worker on the job. Unassigned rows show an{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Assign
        </span>{' '}
        action; use Edit to change an existing assignment.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <ListFilterToolbar
          idPrefix="jobs"
          searchPlaceholder="Search by job ID, summary, service, area, worker…"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={JOB_STATUS_OPTIONS}
        />
        <div className="flex shrink-0 justify-end sm:justify-start sm:pb-0.5">
          <AddActionLink to="/jobs/new">Create job</AddActionLink>
        </div>
      </div>

      <DataTable<Job>
        caption="Jobs"
        columns={columns}
        rows={filteredJobs}
        rowKey={(row) => row.id}
        tableClassName="min-w-[1180px]"
        emptyMessage={
          jobs.length > 0 && filteredJobs.length === 0
            ? 'No jobs match your search or status filter.'
            : 'No rows to display.'
        }
      />

      <AssignWorkerModal
        job={assignJob}
        open={assignJob !== null}
        onClose={() => setAssignJob(null)}
        activeWorkers={activeWorkers}
        onSave={async (job, assignedWorker) => {
          await saveJob({ ...job, assignedWorker })
        }}
      />
    </div>
  )
}
