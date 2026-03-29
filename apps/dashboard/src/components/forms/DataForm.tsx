import { type FormEvent, useCallback, useMemo, useState } from 'react'
import { Select } from '../ui/Select'
import type { FormField, FormValues } from '../../types/dataForm'

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition ' +
  'placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ' +
  'dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 ' +
  'dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20'

const labelClass =
  'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200'

export interface DataFormProps {
  /** Field schema; same component can power many screens. */
  fields: FormField[]
  title?: string
  description?: string
  submitLabel?: string
  /** Seed controlled-ish defaults; internal state still tracks edits. */
  defaultValues?: Partial<FormValues>
  onSubmit?: (values: FormValues) => void | Promise<void>
  className?: string
}

function emptyValueFor(field: FormField): string | boolean {
  if (field.type === 'checkbox') return false
  return ''
}

/**
 * Reusable data entry form: pass a `fields` array and handle `onSubmit`.
 * Layout is responsive (single column on mobile, 2-column grid on larger screens).
 */
export function DataForm({
  fields,
  title,
  description,
  submitLabel = 'Save',
  defaultValues,
  onSubmit,
  className = '',
}: DataFormProps) {
  const initial = useMemo(() => {
    const base: FormValues = {}
    for (const f of fields) {
      const d = defaultValues?.[f.name]
      if (d !== undefined) base[f.name] = d
      else base[f.name] = emptyValueFor(f)
    }
    return base
  }, [fields, defaultValues])

  const [values, setValues] = useState<FormValues>(initial)
  const [submitting, setSubmitting] = useState(false)

  const setField = useCallback((name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return
    setSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6">
          {title ? (
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const col =
            field.colSpan === 2 ? 'sm:col-span-2' : 'sm:col-span-1'
          const id = `field-${field.name}`
          const v = values[field.name]

          if (field.type === 'checkbox') {
            const checked = Boolean(v)
            return (
              <div key={field.name} className={`flex items-start gap-3 ${col}`}>
                <input
                  id={id}
                  name={field.name}
                  type="checkbox"
                  checked={checked}
                  disabled={field.disabled}
                  required={field.required}
                  onChange={(e) => setField(field.name, e.target.checked)}
                  className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900"
                />
                <div>
                  <label htmlFor={id} className={labelClass}>
                    {field.label}
                    {field.required ? (
                      <span className="text-rose-500"> *</span>
                    ) : null}
                  </label>
                  {field.helperText ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {field.helperText}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className={col}>
                <label htmlFor={id} className={labelClass}>
                  {field.label}
                  {field.required ? (
                    <span className="text-rose-500"> *</span>
                  ) : null}
                </label>
                <textarea
                  id={id}
                  name={field.name}
                  rows={field.rows ?? 4}
                  required={field.required}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  value={String(v ?? '')}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className={inputClass}
                />
                {field.helperText ? (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {field.helperText}
                  </p>
                ) : null}
              </div>
            )
          }

          if (field.type === 'select') {
            const selectOptions = [
              {
                value: '',
                label: field.placeholder ?? 'Select…',
              },
              ...field.options,
            ]
            return (
              <div key={field.name} className={col}>
                <Select
                  id={id}
                  label={
                    <>
                      {field.label}
                      {field.required ? (
                        <span className="text-rose-500"> *</span>
                      ) : null}
                    </>
                  }
                  labelClassName={labelClass}
                  value={String(v ?? '')}
                  onChange={(val) => setField(field.name, val)}
                  options={selectOptions}
                  placeholder={field.placeholder ?? 'Select…'}
                  disabled={field.disabled}
                />
                {field.helperText ? (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {field.helperText}
                  </p>
                ) : null}
              </div>
            )
          }

          const inputType = field.type
          return (
            <div key={field.name} className={col}>
              <label htmlFor={id} className={labelClass}>
                {field.label}
                {field.required ? (
                  <span className="text-rose-500"> *</span>
                ) : null}
              </label>
              <input
                id={id}
                name={field.name}
                type={inputType}
                required={field.required}
                disabled={field.disabled}
                placeholder={field.placeholder}
                value={String(v ?? '')}
                onChange={(e) => setField(field.name, e.target.value)}
                className={inputClass}
              />
              {field.helperText ? (
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {field.helperText}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      {onSubmit ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {submitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      ) : null}
    </form>
  )
}
