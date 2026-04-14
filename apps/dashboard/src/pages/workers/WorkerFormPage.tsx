import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SiteServicePickCombobox } from '../../components/domain/SiteServicePickCombobox'
import { Select } from '../../components/ui/Select'
import { useOperationsData } from '../../context/OperationsDataContext'
import { formInputClass, formLabelClass } from '../../lib/formStyles'
import type { Worker } from '@hire-me/types'

const defaultForm = (): Omit<Worker, 'id' | 'workerId'> => ({
  name: '',
  phone: '',
  location: '',
  service: '',
  siteServiceId: null,
  siteServiceIds: [],
  status: 'active',
  internalRating: 4,
  customerRating: 4,
})

export function WorkerFormPage() {
  const { workerId } = useParams<{ workerId: string }>()
  const isEdit = Boolean(workerId)
  const navigate = useNavigate()
  const {
    getWorker,
    saveWorker,
    createWorkerId,
    allocateWorkerCode,
    siteServices,
    loading: opsLoading,
  } = useOperationsData()

  const existing = isEdit && workerId ? getWorker(workerId) : undefined

  const [form, setForm] = useState<Omit<Worker, 'id' | 'workerId'>>(() =>
    existing
      ? {
          name: existing.name,
          phone: existing.phone,
          location: existing.location,
          service: existing.service,
          siteServiceId: existing.siteServiceId,
          siteServiceIds: existing.siteServiceIds ?? (existing.siteServiceId ? [existing.siteServiceId] : []),
          status: existing.status,
          internalRating: existing.internalRating,
          customerRating: existing.customerRating,
        }
      : defaultForm(),
  )

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && workerId) {
      const w = getWorker(workerId)
      if (w) {
        setForm({
          name: w.name,
          phone: w.phone,
          location: w.location,
          service: w.service,
          siteServiceId: w.siteServiceId,
          siteServiceIds: w.siteServiceIds ?? (w.siteServiceId ? [w.siteServiceId] : []),
          status: w.status,
          internalRating: w.internalRating,
          customerRating: w.customerRating,
        })
      }
    }
  }, [isEdit, workerId, getWorker])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const intR = Number(form.internalRating)
    const custR = Number(form.customerRating)
    if (Number.isNaN(intR) || intR < 0 || intR > 5) {
      setError('Internal rating must be between 0 and 5.')
      return
    }
    if (Number.isNaN(custR) || custR < 0 || custR > 5) {
      setError('Customer rating must be between 0 and 5.')
      return
    }
    if (form.siteServiceIds.length === 0) {
      setError('Select at least one service from the catalog.')
      return
    }

    try {
      if (isEdit && workerId && existing) {
        await saveWorker({
          ...existing,
          ...form,
          internalRating: intR,
          customerRating: custR,
        })
        navigate('/workers', { replace: true })
        return
      }

      const id = createWorkerId()
      const code = await allocateWorkerCode()
      await saveWorker({
        id,
        workerId: code,
        ...form,
        internalRating: intR,
        customerRating: custR,
      })
      navigate('/workers', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    }
  }

  if (isEdit && !existing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600">Worker not found.</p>
        <Link to="/workers" className="mt-4 inline-block text-indigo-600">
          ← Workers
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
          {isEdit ? 'Edit worker' : 'Add worker'}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isEdit
            ? 'Update details shown across the dashboard.'
            : 'Creates a new worker in the API; link them to one or more catalog services.'}
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
              <label className={formLabelClass}>Worker ID</label>
              <input
                className={`${formInputClass} bg-slate-50 dark:bg-slate-800/50`}
                value={existing.workerId}
                readOnly
              />
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <label className={formLabelClass} htmlFor="w-name">
              Full name
            </label>
            <input
              id="w-name"
              className={formInputClass}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={formLabelClass} htmlFor="w-phone">
              Phone
            </label>
            <input
              id="w-phone"
              className={formInputClass}
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={formLabelClass} htmlFor="w-location">
              Location / area
            </label>
            <input
              id="w-location"
              className={formInputClass}
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              required
            />
          </div>
          <SiteServicePickCombobox
            services={siteServices}
            values={form.siteServiceIds}
            onChange={(ids) => {
              const titles = ids
                .map((id) => siteServices.find((s) => s.id === id)?.title)
                .filter((x): x is string => Boolean(x))
              setForm((f) => ({
                ...f,
                siteServiceIds: ids,
                siteServiceId: ids[0] ?? null,
                service: titles.length > 0 ? titles.join(', ') : f.service,
              }))
            }}
            label="Services"
            labelClassName={formLabelClass}
            disabled={opsLoading}
            hint={
              opsLoading
                ? 'Loading catalog…'
                : siteServices.length === 0
                  ? 'No site services in the API yet. Add them under Site services, then refresh.'
                  : undefined
            }
          />
          <div>
            <Select
              id="w-status"
              label="Status"
              labelClassName={formLabelClass}
              value={form.status}
              onChange={(v) => update('status', v as Worker['status'])}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'not-active', label: 'Not active' },
                { value: 'on-hold', label: 'On hold' },
                { value: 'canceled', label: 'Canceled' },
              ]}
            />
          </div>
          <div className="hidden sm:block" aria-hidden />
          <div>
            <label className={formLabelClass} htmlFor="w-int">
              Internal rating (0–5)
            </label>
            <input
              id="w-int"
              type="number"
              step="0.1"
              min={0}
              max={5}
              className={formInputClass}
              value={form.internalRating}
              onChange={(e) => update('internalRating', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className={formLabelClass} htmlFor="w-cust">
              Customer rating (0–5)
            </label>
            <input
              id="w-cust"
              type="number"
              step="0.1"
              min={0}
              max={5}
              className={formInputClass}
              value={form.customerRating}
              onChange={(e) => update('customerRating', Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {isEdit ? 'Save changes' : 'Create worker'}
          </button>
          <Link
            to="/workers"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
