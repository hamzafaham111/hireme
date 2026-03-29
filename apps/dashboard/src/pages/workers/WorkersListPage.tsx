import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable } from '../../components/data/DataTable'
import { WorkerStatusBadge } from '../../components/domain/StatusBadges'
import { AddActionLink } from '../../components/ui/AddActionLink'
import {
  ListFilterToolbar,
  type StatusFilterOption,
} from '../../components/ui/ListFilterToolbar'
import { useOperationsData } from '../../context/OperationsDataContext'
import type { DataTableColumn } from '../../types/dataTable'
import type { Worker } from '@hire-me/types'

const WORKER_STATUS_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'not-active', label: 'Not active' },
  { value: 'on-hold', label: 'On hold' },
  { value: 'canceled', label: 'Canceled' },
]

function workerMatchesSearch(worker: Worker, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const blob = [
    worker.workerId,
    worker.name,
    worker.phone,
    worker.location,
    worker.service,
    worker.status,
    String(worker.internalRating),
    String(worker.customerRating),
  ]
    .join(' ')
    .toLowerCase()
  return blob.includes(q)
}

function StarCell({ value }: { value: number }) {
  return (
    <span className="tabular-nums text-slate-700 dark:text-slate-300">
      {value.toFixed(1)}
    </span>
  )
}

export function WorkersListPage() {
  const { workers } = useOperationsData()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      if (statusFilter && w.status !== statusFilter) return false
      return workerMatchesSearch(w, searchQuery)
    })
  }, [workers, statusFilter, searchQuery])

  const columns = useMemo<DataTableColumn<Worker>[]>(
    () => [
      {
        key: 'workerId',
        header: 'Worker ID',
        cell: (row) => (
          <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {row.workerId}
          </code>
        ),
      },
      { key: 'name', header: 'Name' },
      { key: 'phone', header: 'Phone', className: 'whitespace-nowrap' },
      { key: 'location', header: 'Location' },
      { key: 'service', header: 'Service' },
      {
        key: 'status',
        header: 'Status',
        cell: (row) => <WorkerStatusBadge status={row.status} />,
      },
      {
        key: 'internalRating',
        header: 'Int. rating',
        headerClassName: 'text-right',
        className: 'text-right',
        cell: (row) => <StarCell value={row.internalRating} />,
      },
      {
        key: 'customerRating',
        header: 'Customer',
        headerClassName: 'text-right',
        className: 'text-right',
        cell: (row) => <StarCell value={row.customerRating} />,
      },
      {
        key: 'id',
        header: 'Actions',
        headerClassName:
          'min-w-[140px] whitespace-nowrap text-right align-middle',
        className: 'whitespace-nowrap text-right align-middle',
        cell: (row) => (
          <div className="flex flex-row flex-nowrap items-center justify-end gap-2">
            <Link
              to={`/workers/${row.id}`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
            >
              View
            </Link>
            <Link
              to={`/workers/${row.id}/edit`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Edit
            </Link>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Service providers your team can call for jobs. Data is stored in the
        browser for this demo (replace with your Nest API).
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <ListFilterToolbar
          idPrefix="workers"
          searchPlaceholder="Search by name, ID, phone, location, service…"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={WORKER_STATUS_OPTIONS}
        />
        <div className="flex shrink-0 justify-end sm:justify-start sm:pb-0.5">
          <AddActionLink to="/workers/new">Add worker</AddActionLink>
        </div>
      </div>

      <DataTable<Worker>
        caption="Workers"
        columns={columns}
        rows={filteredWorkers}
        rowKey={(row) => row.id}
        tableClassName="min-w-[1120px]"
        emptyMessage={
          workers.length > 0 && filteredWorkers.length === 0
            ? 'No workers match your search or status filter.'
            : 'No rows to display.'
        }
      />
    </div>
  )
}
