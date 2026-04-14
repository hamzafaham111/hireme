import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { WorkerAssignCombobox } from '../../components/domain/WorkerAssignCombobox'
import { Select } from '../../components/ui/Select'
import { useOperationsData } from '../../context/OperationsDataContext'
import { formInputClass, formLabelClass } from '../../lib/formStyles'
import type { Job } from '@hire-me/types'

const defaultForm = (): Omit<Job, 'id' | 'jobId'> => ({
  summary: '',
  service: '',
  area: '',
  status: 'pending',
  assignedWorker: '—',
})

export function JobFormPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const isEdit = Boolean(jobId)
  const navigate = useNavigate()
  const { getJob, saveJob, createJobId, allocateJobCode, workers } =
    useOperationsData()

  const activeWorkers = useMemo(
    () => workers.filter((w) => w.status === 'active'),
    [workers],
  )

  const existing = isEdit && jobId ? getJob(jobId) : undefined

  const [form, setForm] = useState<Omit<Job, 'id' | 'jobId'>>(() =>
    existing
      ? {
          summary: existing.summary,
          service: existing.service,
          area: existing.area,
          status: existing.status,
          assignedWorker: existing.assignedWorker,
        }
      : defaultForm(),
  )

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && jobId) {
      const j = getJob(jobId)
      if (j) {
        setForm({
          summary: j.summary,
          service: j.service,
          area: j.area,
          status: j.status,
          assignedWorker: j.assignedWorker,
        })
      }
    }
  }, [isEdit, jobId, getJob])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.summary.trim()) {
      setError('Request summary is required.')
      return
    }

    try {
      if (isEdit && jobId && existing) {
        await saveJob({
          ...existing,
          ...form,
        })
        navigate('/jobs', { replace: true })
        return
      }

      const id = createJobId()
      const code = await allocateJobCode()
      await saveJob({
        id,
        jobId: code,
        ...form,
      })
      navigate('/jobs', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    }
  }

  if (isEdit && !existing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600">Job not found.</p>
        <Link to="/jobs" className="mt-4 inline-block text-indigo-600">
          ← Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {isEdit ? 'Edit job' : 'Create job'}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Log a customer request after WhatsApp or website contact.
        </p>

        {error ? (
          <p
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {isEdit && existing ? (
            <div className="sm:col-span-2">
              <label className={formLabelClass}>Job ID</label>
              <input
                className={`${formInputClass} bg-slate-50 dark:bg-slate-800/50`}
                value={existing.jobId}
                readOnly
              />
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <label className={formLabelClass} htmlFor="j-summary">
              Request summary
            </label>
            <textarea
              id="j-summary"
              rows={3}
              className={formInputClass}
              value={form.summary}
              onChange={(e) => update('summary', e.target.value)}
              placeholder="e.g. Driver at 1AM Dubai Marina → DXB"
              required
            />
          </div>
          <div>
            <label className={formLabelClass} htmlFor="j-service">
              Service
            </label>
            <input
              id="j-service"
              className={formInputClass}
              value={form.service}
              onChange={(e) => update('service', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={formLabelClass} htmlFor="j-area">
              Area
            </label>
            <input
              id="j-area"
              className={formInputClass}
              value={form.area}
              onChange={(e) => update('area', e.target.value)}
              required
            />
          </div>
          <div>
            <Select
              id="j-status"
              label="Status"
              labelClassName={formLabelClass}
              value={form.status}
              onChange={(v) => update('status', v as Job['status'])}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
          <WorkerAssignCombobox
            activeWorkers={activeWorkers}
            value={form.assignedWorker}
            onChange={(v) => update('assignedWorker', v)}
            label="Assigned worker"
            labelClassName={formLabelClass}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {isEdit ? 'Save changes' : 'Create job'}
          </button>
          <Link
            to="/jobs"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
