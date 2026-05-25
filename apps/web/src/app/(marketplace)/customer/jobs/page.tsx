'use client'

import type { Job, Worker } from '@hire-me/types'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { useWebAuth } from '@/context/WebAuthContext'

export default function CustomerJobsPage() {
  const { accessToken } = useWebAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [expanded, setExpanded] = useState<Record<string, Worker[]>>({})
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadJobs = useCallback(async () => {
    if (!accessToken) return
    setLoadingJobs(true)
    setError(null)
    try {
      const list = await apiFetch<Job[]>('/jobs', { token: accessToken })
      setJobs(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load jobs.')
    } finally {
      setLoadingJobs(false)
    }
  }, [accessToken])

  useEffect(() => {
    void loadJobs()
  }, [loadJobs])

  const loadSuggestions = async (jobId: string) => {
    if (!accessToken) return
    try {
      const workers = await apiFetch<Worker[]>(
        `/marketplace/customer/jobs/${jobId}/suggested-workers`,
        { token: accessToken },
      )
      setExpanded((prev) => ({ ...prev, [jobId]: workers }))
    } catch {
      setExpanded((prev) => ({ ...prev, [jobId]: [] }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/customer"
          className="inline-block text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          ← Home
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            My jobs
          </h1>
          <Link
            href="/customer/jobs/new"
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Post a job
          </Link>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Jobs you created from this account. Open a job to see workers that match its
        service and location.
      </p>

      {loadingJobs ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : error ? (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You have no jobs yet. Post your first request with a location so we can match
            nearby workers.
          </p>
          <Link
            href="/customer/jobs/new"
            className="mt-4 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Post a job
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-slate-500">{job.jobId}</p>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">
                    {job.summary}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {job.service} · {job.area}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadSuggestions(job.id)}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
                >
                  Show matching workers
                </button>
              </div>
              {expanded[job.id] ? (
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {expanded[job.id].length === 0 ? (
                    <li className="text-sm text-slate-500">No matches in range.</li>
                  ) : (
                    expanded[job.id].map((w) => (
                      <li key={w.id} className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-medium">{w.name}</span> — {w.service} (
                        {w.location})
                      </li>
                    ))
                  )}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
