import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable } from '../../components/data/DataTable'
import { AddActionLink } from '../../components/ui/AddActionLink'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useOperationsData } from '../../context/OperationsDataContext'
import type { DataTableColumn } from '../../types/dataTable'
import { SiteServiceIconVisual } from '@hire-me/site-icons/site-service-visual'
import type { SiteService } from '@hire-me/types'

function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
      Active
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
      Hidden
    </span>
  )
}

export function SiteServicesListPage() {
  const { siteServices, deleteSiteService, loading } = useOperationsData()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  const columns = useMemo<DataTableColumn<SiteService>[]>(
    () => [
      { key: 'sortOrder', header: '#', className: 'w-[30px] tabular-nums' },
      {
        key: 'serviceKey',
        header: 'Key',
        className: 'w-[100px] max-w-[100px]',
        cell: (row) => (
          <code className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
            {row.serviceKey}
          </code>
        ),
      },
      {
        key: 'iconKey',
        header: 'Icon',
        className: 'w-[4.5rem]',
        cell: (row) => (
          <div
            className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 text-indigo-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-indigo-300 [&_img]:size-7 [&_img]:object-contain"
            title={`${row.iconKey}${row.iconImageUrl ? ' · custom image' : ''}`}
          >
            <SiteServiceIconVisual service={row} className="size-7" />
          </div>
        ),
      },
      { key: 'title', header: 'Title', className: 'w-[150px] max-w-[180px]' },
      {
        key: 'slug',
        header: 'Slug',
        className: 'w-[180px] max-w-[180px]',
        cell: (row) => (
          <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {row.slug}
          </code>
        ),
      },
      {
        key: 'isActive',
        header: 'Status',
        cell: (row) => <ActiveBadge active={row.isActive} />,
      },
      {
        key: 'id',
        header: 'Actions',
        headerClassName: 'min-w-[160px] whitespace-nowrap text-right align-middle',
        className: 'whitespace-nowrap text-right align-middle',
        cell: (row) => (
          <div className="flex flex-row flex-nowrap items-center justify-end gap-2">
            <Link
              to={`/site-services/${row.id}/edit`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
            >
              Edit
            </Link>
            <button
              type="button"
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              onClick={() => setDeleteTarget({ id: row.id, title: row.title })}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {loading ? 'Loading…' : 'These cards power the Services section on the public site (#services).'}
        </p>
        <AddActionLink to="/site-services/new">Add service</AddActionLink>
      </div>

      <DataTable
        columns={columns}
        rows={siteServices}
        rowKey={(row) => row.id}
        emptyMessage="No site services yet. Add one or run the API seed."
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete site service?"
        description={
          deleteTarget ? (
            <>
              Remove “
              <strong className="text-slate-800 dark:text-slate-200">
                {deleteTarget.title}
              </strong>
              ”? It will disappear from the public homepage when inactive or deleted.
            </>
          ) : null
        }
        variant="danger"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteTarget) return
          try {
            await deleteSiteService(deleteTarget.id)
          } finally {
            setDeleteTarget(null)
          }
        }}
      />
    </div>
  )
}
