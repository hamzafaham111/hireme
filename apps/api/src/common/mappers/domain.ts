import type { Customer, Job, Worker } from '@hire-me/types'
import type { Customer as PrismaCustomer, Job as PrismaJob, User as PrismaUser, Worker as PrismaWorker } from '@prisma/client'

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
  const approvalStatusMap: Record<PrismaWorker['approvalStatus'], Worker['approvalStatus']> = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    suspended: 'suspended',
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
    approvalStatus: approvalStatusMap[w.approvalStatus],
    internalRating: w.internalRating,
    customerRating: w.customerRating,
    userId: w.userId ?? null,
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

/** Convert Worker approval status from API format to Prisma format */
export function workerApprovalStatusFromApi(s: Worker['approvalStatus']): PrismaWorker['approvalStatus'] {
  const m: Record<Worker['approvalStatus'], PrismaWorker['approvalStatus']> = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    suspended: 'suspended',
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
    customerUserId: j.customerUserId ?? null,
    latitude: j.latitude ?? null,
    longitude: j.longitude ?? null,
    siteServiceId: j.siteServiceId ?? null,
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

/** Prisma `Customer` + joined `User` → dashboard `Customer` */
export function customerToApi(
  c: PrismaCustomer & { user?: PrismaUser | null },
): Customer {
  const customerTypeMap: Record<PrismaCustomer['customerType'], Customer['customerType']> = {
    individual: 'individual',
    residential: 'residential',
    commercial: 'commercial',
  }
  
  return {
    id: c.id,
    userId: c.userId,
    customerType: customerTypeMap[c.customerType],
    preferredLocation: c.preferredLocation,
    preferredServices: c.preferredServices,
    totalJobsPosted: c.totalJobsPosted,
    totalSpent: Number(c.totalSpent),
    reputationScore: c.reputationScore,
    billingAddress: c.billingAddress,
    communicationPref: c.communicationPref,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    // Include linked user data if available
    name: c.user?.name,
    email: c.user?.email,
    phone: c.user?.phone ?? undefined,
    status: c.user?.status,
  }
}

/** Convert Customer type from API format to Prisma format */
export function customerTypeFromApi(t: Customer['customerType']): PrismaCustomer['customerType'] {
  const m: Record<Customer['customerType'], PrismaCustomer['customerType']> = {
    individual: 'individual',
    residential: 'residential',
    commercial: 'commercial',
  }
  return m[t]
}
