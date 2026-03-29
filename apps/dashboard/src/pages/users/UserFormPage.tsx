import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Select } from '../../components/ui/Select'
import { useOperationsData } from '../../context/OperationsDataContext'
import type { DashboardUser } from '@hire-me/types'

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-indigo-400'

const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200'

const defaultForm = (): Omit<DashboardUser, 'id' | 'password'> & {
  password: string
} => ({
  name: '',
  email: '',
  password: '',
  role: 'agent',
  status: 'invited',
})

export function UserFormPage() {
  const { userId } = useParams<{ userId: string }>()
  const isEdit = Boolean(userId)
  const navigate = useNavigate()
  const { getUser, saveUser, createUserId, users } = useOperationsData()

  const existing = isEdit && userId ? getUser(userId) : undefined

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          email: existing.email,
          password: '',
          role: existing.role,
          status: existing.status,
        }
      : defaultForm(),
  )

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && userId) {
      const u = getUser(userId)
      if (u) {
        setForm({
          name: u.name,
          email: u.email,
          password: '',
          role: u.role,
          status: u.status,
        })
      }
    }
  }, [isEdit, userId, getUser])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const email = form.email.trim().toLowerCase()
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email.')
      return
    }

    const emailTaken = users.some(
      (u) =>
        u.email.toLowerCase() === email &&
        (!isEdit || !existing || u.id !== existing.id),
    )
    if (emailTaken) {
      setError('That email is already used by another user.')
      return
    }

    if (!isEdit && !form.password.trim()) {
      setError('Set an initial password for new users.')
      return
    }

    try {
      if (isEdit && userId && existing) {
        await saveUser({
          ...existing,
          name: form.name.trim(),
          email,
          role: form.role,
          status: form.status,
          password: form.password.trim() !== '' ? form.password.trim() : '',
        })
        navigate('/users', { replace: true })
        return
      }

      const id = createUserId()
      await saveUser({
        id,
        name: form.name.trim(),
        email,
        role: form.role,
        status: form.status,
        password: form.password.trim(),
      })
      navigate('/users', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    }
  }

  if (isEdit && !existing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600">User not found.</p>
        <Link to="/users" className="mt-4 inline-block text-indigo-600">
          ← Users
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
          {isEdit ? 'Edit user' : 'Add user'}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Users are stored in the API (bcrypt passwords). Leave password blank when
          editing to keep the current hash.
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
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="u-name">
              Full name
            </label>
            <input
              id="u-name"
              className={inputClass}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="u-email">
              Email
            </label>
            <input
              id="u-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="u-password">
              Password
            </label>
            <input
              id="u-password"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder={isEdit ? 'Leave blank to keep current password' : '••••••••'}
              required={!isEdit}
            />
            {isEdit ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Empty field keeps the current password on the server.
              </p>
            ) : null}
          </div>
          <div>
            <Select
              id="u-role"
              label="Role"
              labelClassName={labelClass}
              value={form.role}
              onChange={(v) => update('role', v as DashboardUser['role'])}
              options={[
                { value: 'superadmin', label: 'superadmin' },
                { value: 'admin', label: 'admin' },
                { value: 'agent', label: 'agent' },
                { value: 'content_editor', label: 'content editor' },
              ]}
            />
          </div>
          <div>
            <Select
              id="u-status"
              label="Status"
              labelClassName={labelClass}
              value={form.status}
              onChange={(v) => update('status', v as DashboardUser['status'])}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'invited', label: 'Invited' },
              ]}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {isEdit ? 'Save changes' : 'Create user'}
          </button>
          <Link
            to="/users"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
