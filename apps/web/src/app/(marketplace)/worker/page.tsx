'use client'

import type { Job } from '@hire-me/types'
import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useWebAuth } from '@/context/WebAuthContext'

const DEFAULT_LAT = 25.0772
const DEFAULT_LNG = 55.1398

export default function WorkerJobsPage() {
  const { accessToken } = useWebAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      let lat = DEFAULT_LAT
      let lng = DEFAULT_LNG
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
            maximumAge: 60_000,
          })
        }).catch(() => null)
        if (pos) {
          lat = pos.coords.latitude
          lng = pos.coords.longitude
        }
      }
      const list = await apiFetch<Job[]>(
        `/marketplace/worker/jobs-nearby?lat=${lat}&lng=${lng}&radiusKm=80`,
        { token: accessToken },
      )
      setJobs(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load jobs.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Jobs near you
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Matched to your worker profile services and location. Link your dashboard worker
          row to this login and set services there.
        </p>
      </div>
      <button
        type="button"
        onClick={() => void load()}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Set location &amp; refresh
      </button>

      {loading ? (
        <p className="text-sm text-slate-500">Loading jobs…</p>
      ) : error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No open jobs match your linked profile and area. Ensure your account is linked
          to a worker with catalog services and that jobs include coordinates.
        </p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((j) => (
            <li
              key={j.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
            >
              <p className="font-mono text-xs text-slate-500">{j.jobId}</p>
              <p className="mt-1 font-medium text-slate-900 dark:text-white">{j.summary}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {j.service} · {j.area}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
