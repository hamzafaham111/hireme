'use client'

import type { Worker } from '@hire-me/types'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { useWebAuth } from '@/context/WebAuthContext'

const DEFAULT_LAT = 25.0772
const DEFAULT_LNG = 55.1398

export default function CustomerHomePage() {
  const { accessToken } = useWebAuth()
  const [workers, setWorkers] = useState<Worker[]>([])
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
      const list = await apiFetch<Worker[]>(
        `/marketplace/customer/workers-nearby?lat=${lat}&lng=${lng}&radiusKm=80`,
        { token: accessToken },
      )
      setWorkers(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load nearby workers.')
      setWorkers([])
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Popular workers near you
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Based on your browser location when available. You can post a job and compare
          providers.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/customer/jobs/new"
          className="inline-flex items-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Post a job
        </Link>
        <Link
          href="/customer/jobs"
          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          My jobs
        </Link>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Refresh list
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading providers…</p>
      ) : error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      ) : workers.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No workers with a live location match this area yet. Try again later or widen
          your search from the API.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {workers.map((w) => (
            <li
              key={w.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{w.name}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{w.service}</p>
              <p className="mt-2 text-xs text-slate-500">{w.location}</p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                ★ {w.customerRating.toFixed(1)} customer rating
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
