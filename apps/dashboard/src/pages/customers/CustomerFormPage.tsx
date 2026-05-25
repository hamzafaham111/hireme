import { type FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Select } from '../../components/ui/Select'
import { useOperationsData } from '../../providers/OperationsDataContext'
import { formInputClass, formLabelClass } from '../../lib/formStyles'
import type { Customer } from '@hire-me/types'

export function CustomerFormPage() {
  const { customerId } = useParams<{ customerId: string }>()
  const isEdit = Boolean(customerId)
  const {
    getCustomer,
    saveCustomer,
  } = useOperationsData()

  const existing = isEdit && customerId ? getCustomer(customerId) : undefined

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        customerType: existing.customerType,
        preferredLocation: existing.preferredLocation || '',
        preferredServices: existing.preferredServices,
        billingAddress: existing.billingAddress || '',
        communicationPref: existing.communicationPref,
      }
    }
    return {
      customerType: 'individual' as Customer['customerType'],
      preferredLocation: '',
      preferredServices: [] as string[],
      billingAddress: '',
      communicationPref: 'whatsapp',
    }
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && customerId) {
      const c = getCustomer(customerId)
      if (c) {
        setForm({
          customerType: c.customerType,
          preferredLocation: c.preferredLocation || '',
          preferredServices: c.preferredServices,
          billingAddress: c.billingAddress || '',
          communicationPref: c.communicationPref,
        })
      }
    }
  }, [isEdit, customerId, getCustomer])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!existing) {
      setError('Cannot create customers from dashboard. Use registration.')
      return
    }

    try {
      await saveCustomer({
        ...existing,
        ...form,
      })
      setSuccess('Customer profile updated successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    }
  }

  if (isEdit && !existing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600">Customer not found.</p>
        <Link to="/customers" className="mt-4 inline-block text-indigo-600">
          ← Customers
        </Link>
      </div>
    )
  }

  if (!isEdit) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600">
          Customers are created via marketplace registration, not from the dashboard.
        </p>
        <Link to="/customers" className="mt-4 inline-block text-indigo-600">
          ← Back to customers
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
          Edit customer profile
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update customer preferences and settings.
        </p>

        {error ? (
          <p
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
            role="status"
          >
            {success}
          </p>
        ) : null}

        <div className="mt-6 space-y-5">
          <div className="sm:col-span-2">
            <label className={formLabelClass}>Customer ID</label>
            <input
              className={`${formInputClass} bg-slate-50 dark:bg-slate-800/50`}
              value={existing?.id}
              readOnly
            />
          </div>

          <div>
            <label className={formLabelClass}>Name (from user account)</label>
            <input
              className={`${formInputClass} bg-slate-50 dark:bg-slate-800/50`}
              value={existing?.name || '—'}
              readOnly
            />
          </div>

          <div>
            <label className={formLabelClass}>Email (from user account)</label>
            <input
              className={`${formInputClass} bg-slate-50 dark:bg-slate-800/50`}
              value={existing?.email || '—'}
              readOnly
            />
          </div>

          <div>
            <Select
              id="c-type"
              label="Customer Type"
              labelClassName={formLabelClass}
              value={form.customerType}
              onChange={(v) => update('customerType', v as Customer['customerType'])}
              options={[
                { value: 'individual', label: 'Individual' },
                { value: 'residential', label: 'Residential' },
                { value: 'commercial', label: 'Commercial' },
              ]}
            />
          </div>

          <div>
            <label className={formLabelClass} htmlFor="c-location">
              Preferred Location
            </label>
            <input
              id="c-location"
              className={formInputClass}
              value={form.preferredLocation}
              onChange={(e) => update('preferredLocation', e.target.value)}
              placeholder="e.g., Dubai Marina, Downtown"
            />
          </div>

          <div>
            <label className={formLabelClass} htmlFor="c-services">
              Preferred Services
            </label>
            <input
              id="c-services"
              className={formInputClass}
              value={form.preferredServices.join(', ')}
              onChange={(e) => 
                update('preferredServices', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
              }
              placeholder="e.g., Plumbing, Electrical"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Comma-separated list of preferred service types
            </p>
          </div>

          <div>
            <label className={formLabelClass} htmlFor="c-billing">
              Billing Address
            </label>
            <textarea
              id="c-billing"
              className={formInputClass}
              rows={3}
              value={form.billingAddress}
              onChange={(e) => update('billingAddress', e.target.value)}
              placeholder="Full billing address"
            />
          </div>

          <div>
            <Select
              id="c-comm"
              label="Communication Preference"
              labelClassName={formLabelClass}
              value={form.communicationPref}
              onChange={(v) => update('communicationPref', v)}
              options={[
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone Call' },
                { value: 'sms', label: 'SMS' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jobs Posted</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {existing?.totalJobsPosted || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Spent</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                ${existing?.totalSpent.toFixed(2) || '0.00'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reputation</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {existing?.reputationScore.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Save changes
          </button>
          <Link
            to="/customers"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
