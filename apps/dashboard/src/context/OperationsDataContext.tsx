import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DashboardUser, Job, Worker } from '@hire-me/types'
import { apiFetch } from '../lib/api'
import { useAuth } from './AuthContext'

/** API returns users without passwords; keep empty string locally for form typing. */
function withPasswordShell(u: Omit<DashboardUser, 'password'>): DashboardUser {
  return { ...u, password: '' }
}

interface OperationsDataContextValue {
  workers: Worker[]
  jobs: Job[]
  users: DashboardUser[]
  /** True while the first ops fetch after login is in flight. */
  loading: boolean
  getWorker: (id: string) => Worker | undefined
  getJob: (id: string) => Job | undefined
  getUser: (id: string) => DashboardUser | undefined
  saveWorker: (worker: Worker) => Promise<Worker>
  saveJob: (job: Job) => Promise<Job>
  saveUser: (user: DashboardUser) => Promise<DashboardUser>
  deleteWorker: (id: string) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  createWorkerId: () => string
  createJobId: () => string
  createUserId: () => string
  allocateWorkerCode: () => Promise<string>
  allocateJobCode: () => Promise<string>
}

const OperationsDataContext = createContext<OperationsDataContextValue | null>(
  null,
)

export function OperationsDataProvider({ children }: { children: ReactNode }) {
  const { accessToken, user } = useAuth()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!accessToken || !user) {
      setWorkers([])
      setJobs([])
      setUsers([])
      setLoading(false)
      return
    }
    if (user.role === 'content_editor') {
      setWorkers([])
      setJobs([])
      setUsers([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const [w, j, u] = await Promise.all([
          apiFetch<Worker[]>('/workers', { token: accessToken }),
          apiFetch<Job[]>('/jobs', { token: accessToken }),
          apiFetch<Omit<DashboardUser, 'password'>[]>('/users', { token: accessToken }),
        ])
        if (!cancelled) {
          setWorkers(w)
          setJobs(j)
          setUsers(u.map(withPasswordShell))
        }
      } catch {
        if (!cancelled) {
          setWorkers([])
          setJobs([])
          setUsers([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [accessToken, user?.role, user?.userId])

  const getWorker = useCallback(
    (id: string) => workers.find((w) => w.id === id),
    [workers],
  )

  const getJob = useCallback(
    (id: string) => jobs.find((j) => j.id === id),
    [jobs],
  )

  const getUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users],
  )

  const saveWorker = useCallback(
    async (worker: Worker) => {
      if (!accessToken) throw new Error('Not signed in.')
      const existsOnServer = workers.some((w) => w.id === worker.id)
      if (existsOnServer) {
        const updated = await apiFetch<Worker>(`/workers/${worker.id}`, {
          method: 'PATCH',
          token: accessToken,
          body: {
            workerId: worker.workerId,
            name: worker.name,
            phone: worker.phone,
            location: worker.location,
            service: worker.service,
            status: worker.status,
            internalRating: worker.internalRating,
            customerRating: worker.customerRating,
          },
        })
        setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
        return updated
      }
      const created = await apiFetch<Worker>('/workers', {
        method: 'POST',
        token: accessToken,
        body: {
          workerId: worker.workerId,
          name: worker.name,
          phone: worker.phone,
          location: worker.location,
          service: worker.service,
          status: worker.status,
          internalRating: worker.internalRating,
          customerRating: worker.customerRating,
        },
      })
      setWorkers((prev) => [...prev, created])
      return created
    },
    [accessToken, workers],
  )

  const saveJob = useCallback(
    async (job: Job) => {
      if (!accessToken) throw new Error('Not signed in.')
      const existsOnServer = jobs.some((j) => j.id === job.id)
      if (existsOnServer) {
        const updated = await apiFetch<Job>(`/jobs/${job.id}`, {
          method: 'PATCH',
          token: accessToken,
          body: {
            jobId: job.jobId,
            summary: job.summary,
            service: job.service,
            area: job.area,
            status: job.status,
            assignedWorker: job.assignedWorker,
          },
        })
        setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
        return updated
      }
      const created = await apiFetch<Job>('/jobs', {
        method: 'POST',
        token: accessToken,
        body: {
          jobId: job.jobId,
          summary: job.summary,
          service: job.service,
          area: job.area,
          status: job.status,
          assignedWorker: job.assignedWorker,
        },
      })
      setJobs((prev) => [...prev, created])
      return created
    },
    [accessToken, jobs],
  )

  const saveUser = useCallback(
    async (u: DashboardUser) => {
      if (!accessToken) throw new Error('Not signed in.')
      const existsOnServer = users.some((x) => x.id === u.id)
      if (existsOnServer) {
        const body: Record<string, unknown> = {
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
        }
        if (u.password.trim()) {
          body.password = u.password.trim()
        }
        const updated = await apiFetch<Omit<DashboardUser, 'password'>>(
          `/users/${u.id}`,
          {
            method: 'PATCH',
            token: accessToken,
            body,
          },
        )
        const next = withPasswordShell(updated)
        setUsers((prev) => prev.map((row) => (row.id === next.id ? next : row)))
        return next
      }
      const created = await apiFetch<Omit<DashboardUser, 'password'>>('/users', {
        method: 'POST',
        token: accessToken,
        body: {
          name: u.name,
          email: u.email,
          password: u.password.trim(),
          role: u.role,
          status: u.status,
        },
      })
      const next = withPasswordShell(created)
      setUsers((prev) => [...prev, next])
      return next
    },
    [accessToken, users],
  )

  const deleteWorker = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error('Not signed in.')
      await apiFetch(`/workers/${id}`, { method: 'DELETE', token: accessToken })
      setWorkers((prev) => prev.filter((w) => w.id !== id))
    },
    [accessToken],
  )

  const deleteJob = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error('Not signed in.')
      await apiFetch(`/jobs/${id}`, { method: 'DELETE', token: accessToken })
      setJobs((prev) => prev.filter((j) => j.id !== id))
    },
    [accessToken],
  )

  const deleteUser = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error('Not signed in.')
      await apiFetch(`/users/${id}`, { method: 'DELETE', token: accessToken })
      setUsers((prev) => prev.filter((u) => u.id !== id))
    },
    [accessToken],
  )

  const createWorkerId = useCallback(() => crypto.randomUUID(), [])
  const createJobId = useCallback(() => crypto.randomUUID(), [])
  const createUserId = useCallback(() => crypto.randomUUID(), [])

  const allocateWorkerCode = useCallback(async () => {
    if (!accessToken) throw new Error('Not signed in.')
    const { workerId } = await apiFetch<{ workerId: string }>('/workers/next-code', {
      token: accessToken,
    })
    return workerId
  }, [accessToken])

  const allocateJobCode = useCallback(async () => {
    if (!accessToken) throw new Error('Not signed in.')
    const { jobId } = await apiFetch<{ jobId: string }>('/jobs/next-code', {
      token: accessToken,
    })
    return jobId
  }, [accessToken])

  const value = useMemo<OperationsDataContextValue>(
    () => ({
      workers,
      jobs,
      users,
      loading,
      getWorker,
      getJob,
      getUser,
      saveWorker,
      saveJob,
      saveUser,
      deleteWorker,
      deleteJob,
      deleteUser,
      createWorkerId,
      createJobId,
      createUserId,
      allocateWorkerCode,
      allocateJobCode,
    }),
    [
      workers,
      jobs,
      users,
      loading,
      getWorker,
      getJob,
      getUser,
      saveWorker,
      saveJob,
      saveUser,
      deleteWorker,
      deleteJob,
      deleteUser,
      createWorkerId,
      createJobId,
      createUserId,
      allocateWorkerCode,
      allocateJobCode,
    ],
  )

  return (
    <OperationsDataContext.Provider value={value}>
      {children}
    </OperationsDataContext.Provider>
  )
}

export function useOperationsData() {
  const ctx = useContext(OperationsDataContext)
  if (!ctx)
    throw new Error('useOperationsData must be used within OperationsDataProvider')
  return ctx
}
