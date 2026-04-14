import type { Job, Worker } from '@hire-me/types'
import type { Job as PrismaJob, Worker as PrismaWorker } from '@prisma/client'

/** Prisma `WorkerStatus` → dashboard `Worker['status']`. */
export function workerToApi(
  w: PrismaWorker,
  resolvedTitlesById: ReadonlyMap<string, string> = new Map(),
): Worker {
  const statusMap: Record<PrismaWorker['status'], Worker['status']> = {
    active: 'active',
    not_active: 'not-active',
    on_hold: 'on-hold',
    canceled: 'canceled',
  }
  const titleFromIds = w.siteServiceIds
    .map((id) => resolvedTitlesById.get(id))
    .filter((x): x is string => Boolean(x))
  const resolvedService =
    titleFromIds.length > 0 ? titleFromIds.join(', ') : w.service
  return {
    id: w.id,
    workerId: w.workerId,
    name: w.name,
    phone: w.phone,
    location: w.location,
    siteServiceId: w.siteServiceIds[0] ?? w.siteServiceId,
    siteServiceIds: w.siteServiceIds,
    service: resolvedService,
    status: statusMap[w.status],
    internalRating: w.internalRating,
    customerRating: w.customerRating,
  }
}

export function workerStatusFromApi(s: Worker['status']): PrismaWorker['status'] {
  const m: Record<Worker['status'], PrismaWorker['status']> = {
    active: 'active',
    'not-active': 'not_active',
    'on-hold': 'on_hold',
    canceled: 'canceled',
  }
  return m[s]
}

export function jobToApi(j: PrismaJob): Job {
  const statusMap: Record<PrismaJob['status'], Job['status']> = {
    pending: 'pending',
    in_progress: 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled',
  }
  return {
    id: j.id,
    jobId: j.jobId,
    summary: j.summary,
    service: j.service,
    area: j.area,
    status: statusMap[j.status],
    assignedWorker: j.assignedWorker,
  }
}

export function jobStatusFromApi(s: Job['status']): PrismaJob['status'] {
  const m: Record<Job['status'], PrismaJob['status']> = {
    pending: 'pending',
    'in-progress': 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
  }
  return m[s]
}
