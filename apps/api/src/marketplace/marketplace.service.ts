import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import type { Job, Worker } from '@hire-me/types'
import { jobToApi, workerToApi } from '../common/mappers/domain'
import { PrismaService } from '../common/prisma/prisma.service'

/** Earth radius in km for haversine distance. */
const R_KM = 6371

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R_KM * c
}

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Jobs near a point that overlap the worker's catalog services and have coordinates.
   */
  async jobsNearbyForWorker(
    userId: string,
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<Job[]> {
    const worker = await this.prisma.worker.findFirst({
      where: { userId },
    })
    if (!worker) {
      return []
    }
    const serviceIds = new Set(worker.siteServiceIds)
    const jobs = await this.prisma.job.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        status: { in: ['pending', 'in_progress'] },
      },
      orderBy: { createdAt: 'desc' },
    })
    const out: Job[] = []
    for (const j of jobs) {
      if (j.latitude == null || j.longitude == null) continue
      if (j.siteServiceId && !serviceIds.has(j.siteServiceId)) {
        continue
      }
      if (!j.siteServiceId) {
        // Legacy jobs without catalog id: skip strict service filter
        continue
      }
      if (haversineKm(lat, lng, j.latitude, j.longitude) <= radiusKm) {
        out.push(jobToApi(j))
      }
    }
    return out
  }

  /**
   * Active workers with a linked login and last known coordinates from the user row.
   */
  async workersNearbyForCustomer(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<Worker[]> {
    const rows = await this.prisma.worker.findMany({
      where: {
        status: 'active',
        userId: { not: null },
      },
      include: {
        user: {
          select: {
            lastLatitude: true,
            lastLongitude: true,
          },
        },
      },
    })
    const titlesById = await this.buildTitlesMap(rows)
    const out: Worker[] = []
    for (const w of rows) {
      const uLat = w.user?.lastLatitude
      const uLng = w.user?.lastLongitude
      if (uLat == null || uLng == null) continue
      if (haversineKm(lat, lng, uLat, uLng) <= radiusKm) {
        out.push(workerToApi(w, titlesById))
      }
    }
    return out.sort((a, b) => b.customerRating - a.customerRating)
  }

  /**
   * Workers matching a customer's job (ownership check + service + distance to job coords).
   */
  async suggestedWorkersForJob(
    customerUserId: string,
    jobId: string,
    radiusKm: number,
  ): Promise<Worker[]> {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, customerUserId },
    })
    if (!job) {
      throw new NotFoundException('Job not found.')
    }
    if (job.latitude == null || job.longitude == null) {
      return []
    }
    const workers = await this.prisma.worker.findMany({
      where: { status: 'active' },
      include: {
        user: {
          select: {
            lastLatitude: true,
            lastLongitude: true,
          },
        },
      },
    })
    const titlesById = await this.buildTitlesMap(workers)
    const out: Worker[] = []
    for (const w of workers) {
      if (job.siteServiceId && !w.siteServiceIds.includes(job.siteServiceId)) {
        continue
      }
      if (!job.siteServiceId) {
        continue
      }
      const uLat = w.user?.lastLatitude
      const uLng = w.user?.lastLongitude
      if (uLat == null || uLng == null) continue
      if (haversineKm(job.latitude, job.longitude, uLat, uLng) <= radiusKm) {
        out.push(workerToApi(w, titlesById))
      }
    }
    return out.sort((a, b) => b.customerRating - a.customerRating)
  }

  private async buildTitlesMap(
    workers: Array<{ siteServiceIds: string[]; siteServiceId: string | null }>,
  ): Promise<Map<string, string>> {
    const allIds = new Set<string>()
    for (const w of workers) {
      for (const id of w.siteServiceIds) allIds.add(id)
      if (w.siteServiceId) allIds.add(w.siteServiceId)
    }
    if (allIds.size === 0) return new Map()
    const rows = await this.prisma.siteService.findMany({
      where: { id: { in: [...allIds] } },
      select: { id: true, title: true },
    })
    return new Map(rows.map((r) => [r.id, r.title]))
  }

  assertCustomer(userId: string, role: string) {
    if (role !== 'customer') {
      throw new ForbiddenException('Customer role required.')
    }
    return userId
  }

  assertWorker(userId: string, role: string) {
    if (role !== 'worker') {
      throw new ForbiddenException('Worker role required.')
    }
    return userId
  }
}
