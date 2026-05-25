'use client'

import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Job, SiteService } from '@hire-me/types'
import {
  JobServiceCombobox,
  type JobServiceComboboxHandle,
  type JobServicePick,
} from '@/components/domain/JobServiceCombobox'
import { apiFetch } from '@/lib/api'
import { formInputClass, formLabelClass } from '@/lib/formStyles'
import { getPublicApiBaseUrl } from '@/lib/public-api-base'
import { useWebAuth } from '@/context/WebAuthContext'

const UNASSIGNED_WORKER = '—'

type GeoState = {
  lat: number
  lng: number
  areaLabel: string
}

export default function CustomerNewJobPage() {
  const { accessToken } = useWebAuth()
  const [services, setServices] = useState<SiteService[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicePick, setServicePick] = useState<JobServicePick | null>(null)
  const serviceComboboxRef = useRef<JobServiceComboboxHandle>(null)
  const [summary, setSummary] = useState('')
  const [area, setArea] = useState('')
  const [geo, setGeo] = useState<GeoState | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [doneJob, setDoneJob] = useState<Job | null>(null)

  useEffect(() => {
    let cancelled = false
    const base = getPublicApiBaseUrl()
    setServicesLoading(true)
    void (async () => {
      try {
        if (!base) {
          if (!cancelled) setServices([])
          return
        }
        // Nest global prefix is `api/v1` — must use same base as `NEXT_PUBLIC_API_URL`.
        const res = await fetch(`${base}/site-services/public`)
        if (!res.ok) {
          if (!cancelled) setServices([])
          return
        }
        const data = (await res.json()) as unknown
        if (cancelled || !Array.isArray(data)) return
        setServices(data as SiteService[])
      } catch {
        if (!cancelled) setServices([])
      } finally {
        if (!cancelled) setServicesLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const captureLocation = useCallback(async () => {
    setGeoError(null)
    setLocating(true)
    try {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        throw new Error('Location is not available in this browser.')
      }
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15_000,
          maximumAge: 0,
        })
      })
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const rev = await fetch(
        `/api/reverse-geocode?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`,
      )
      if (!rev.ok) {
        const err = (await rev.json().catch(() => null)) as { error?: string } | null
        throw new Error(err?.error || 'Could not resolve address from your location.')
      }
      const payload = (await rev.json()) as { label?: string }
      const label =
        typeof payload.label === 'string' && payload.label.trim().length > 0
          ? payload.label.trim()
          : `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setGeo({ lat, lng, areaLabel: label })
      setArea((a) => (a.trim().length === 0 ? label : a))
    } catch (e) {
      setGeoError(e instanceof Error ? e.message : 'Could not read your location.')
    } finally {
      setLocating(false)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!accessToken) {
      setFormError('You need to be signed in.')
      return
    }
    const resolvedPick = serviceComboboxRef.current?.resolveSubmitPick() ?? null
    if (!resolvedPick) {
      setFormError('Enter a type of service — search the catalog or describe your own.')
      return
    }
    if (!summary.trim()) {
      setFormError('Describe what you need.')
      return
    }
    if (!geo) {
      setFormError('Set your job location using the button so we can match nearby workers.')
      return
    }
    if (!area.trim()) {
      setFormError('Add an area or address for this job.')
      return
    }

    const serviceTitle =
      resolvedPick.source === 'catalog'
        ? resolvedPick.service.title
        : resolvedPick.label.trim()
    const siteServiceId =
      resolvedPick.source === 'catalog' ? resolvedPick.service.id : undefined

    setSubmitting(true)
    try {
      const { jobId } = await apiFetch<{ jobId: string }>('/jobs/next-code', {
        token: accessToken,
      })
      const body: Record<string, unknown> = {
        jobId,
        summary: summary.trim(),
        service: serviceTitle,
        area: area.trim(),
        status: 'pending',
        assignedWorker: UNASSIGNED_WORKER,
        latitude: geo.lat,
        longitude: geo.lng,
      }
      if (siteServiceId) body.siteServiceId = siteServiceId

      const job = await apiFetch<Job>('/jobs', {
        token: accessToken,
        method: 'POST',
        body,
      })
      setDoneJob(job)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create job.')
    } finally {
      setSubmitting(false)
    }
  }

  if (doneJob) {
    return (
      <div className="w-full max-w-2xl space-y-4 text-left">
        <Link
          href="/customer/jobs"
          className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← My jobs
        </Link>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Job posted
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your request <span className="font-mono font-semibold">{doneJob.jobId}</span> is live.
          You can view it under My jobs or find matching workers from there.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/customer/jobs"
            className="inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            My jobs
          </Link>
          <Link
            href="/customer"
            className="inline-flex rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-6 text-left">
      <div className="space-y-3">
        <Link
          href="/customer/jobs"
          className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← My jobs
        </Link>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Post a job
        </h1>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        We use your location to match workers and route requests. Use{' '}
        <strong>Use my location</strong> so the job is tied to a place on the map.
      </p>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
      >
        {formError ? (
          <p
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <JobServiceCombobox
          ref={serviceComboboxRef}
          services={services}
          loading={servicesLoading}
          value={servicePick}
          onChange={setServicePick}
        />

        <div>
          <label className={formLabelClass} htmlFor="job-summary">
            What do you need?
          </label>
          <textarea
            id="job-summary"
            rows={4}
            className={formInputClass}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="e.g. Pick up groceries from Carrefour and deliver to my building."
            required
          />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Job location
            </span>
            <button
              type="button"
              onClick={() => void captureLocation()}
              disabled={locating}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {locating ? 'Getting location…' : 'Use my location'}
            </button>
          </div>
          {geoError ? (
            <p className="mb-2 text-sm text-rose-600 dark:text-rose-400">{geoError}</p>
          ) : null}
          {geo ? (
            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
              Pin: {geo.lat.toFixed(5)}, {geo.lng.toFixed(5)} · {geo.areaLabel}
            </p>
          ) : (
            <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">
              Required: use the button above so we can store coordinates with your job.
            </p>
          )}
          <label className={formLabelClass} htmlFor="job-area">
            Area / address (editable)
          </label>
          <input
            id="job-area"
            className={formInputClass}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Neighborhood, building, or landmark"
            required
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Post job'}
          </button>
          <Link
            href="/customer/jobs"
            className="inline-flex items-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
