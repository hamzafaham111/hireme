import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { workerToApi, workerStatusFromApi } from '../common/mappers/domain'
import { CreateWorkerDto } from './dto/create-worker.dto'
import { UpdateWorkerDto } from './dto/update-worker.dto'

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  private uniqueOrderedSiteServiceIds(ids: string[]): string[] {
    const out: string[] = []
    const seen = new Set<string>()
    for (const id of ids) {
      const next = id.trim()
      if (!next || seen.has(next)) continue
      seen.add(next)
      out.push(next)
    }
    return out
  }

  private async resolveSiteServiceTitles(
    siteServiceIds: string[],
  ): Promise<{ orderedIds: string[]; titlesById: Map<string, string>; joinedTitle: string }> {
    const orderedIds = this.uniqueOrderedSiteServiceIds(siteServiceIds)
    const rows = await this.prisma.siteService.findMany({
      where: { id: { in: orderedIds } },
      select: { id: true, title: true },
    })
    if (rows.length !== orderedIds.length) {
      throw new BadRequestException('One or more site services were not found.')
    }
    const titlesById = new Map(rows.map((row) => [row.id, row.title]))
    const joinedTitle = orderedIds
      .map((id) => titlesById.get(id))
      .filter((x): x is string => Boolean(x))
      .join(', ')
    return { orderedIds, titlesById, joinedTitle }
  }

  private async buildTitlesByIdForWorkers(
    workers: Array<{ siteServiceIds: string[]; siteServiceId: string | null }>,
  ): Promise<Map<string, string>> {
    const allIds = new Set<string>()
    for (const worker of workers) {
      for (const id of worker.siteServiceIds) allIds.add(id)
      if (worker.siteServiceId) allIds.add(worker.siteServiceId)
    }
    if (allIds.size === 0) return new Map()
    const rows = await this.prisma.siteService.findMany({
      where: { id: { in: [...allIds] } },
      select: { id: true, title: true },
    })
    return new Map(rows.map((row) => [row.id, row.title]))
  }

  async findAll() {
    const list = await this.prisma.worker.findMany({
      orderBy: { workerId: 'asc' },
    })
    const titlesById = await this.buildTitlesByIdForWorkers(list)
    return list.map((worker) => workerToApi(worker, titlesById))
  }

  async findOne(id: string) {
    const w = await this.prisma.worker.findUnique({
      where: { id },
    })
    if (!w) throw new NotFoundException('Worker not found.')
    const titlesById = await this.buildTitlesByIdForWorkers([w])
    return workerToApi(w, titlesById)
  }

  async create(dto: CreateWorkerDto) {
    const taken = await this.prisma.worker.findUnique({
      where: { workerId: dto.workerId.trim() },
    })
    if (taken) throw new ConflictException('Worker ID already in use.')
    const resolved = await this.resolveSiteServiceTitles(dto.siteServiceIds)
    const w = await this.prisma.worker.create({
      data: {
        workerId: dto.workerId.trim(),
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        location: dto.location.trim(),
        service: resolved.joinedTitle,
        siteServiceIds: resolved.orderedIds,
        siteServiceId: resolved.orderedIds[0] ?? null,
        status: workerStatusFromApi(dto.status),
        internalRating: dto.internalRating,
        customerRating: dto.customerRating,
      },
    })
    return workerToApi(w, resolved.titlesById)
  }

  async update(id: string, dto: UpdateWorkerDto) {
    const existing = await this.prisma.worker.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Worker not found.')
    if (dto.workerId !== undefined && dto.workerId.trim() !== existing.workerId) {
      const taken = await this.prisma.worker.findUnique({
        where: { workerId: dto.workerId.trim() },
      })
      if (taken) throw new ConflictException('Worker ID already in use.')
    }

    let serviceFromCatalog:
      | { service: string; siteServiceId: string | null; siteServiceIds: string[] }
      | null = null
    let resolvedTitlesById = new Map<string, string>()
    if (dto.siteServiceIds !== undefined) {
      const resolved = await this.resolveSiteServiceTitles(dto.siteServiceIds)
      serviceFromCatalog = {
        service: resolved.joinedTitle,
        siteServiceIds: resolved.orderedIds,
        siteServiceId: resolved.orderedIds[0] ?? null,
      }
      resolvedTitlesById = resolved.titlesById
    }

    const w = await this.prisma.worker.update({
      where: { id },
      data: {
        ...(dto.workerId !== undefined ? { workerId: dto.workerId.trim() } : {}),
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
        ...(dto.location !== undefined ? { location: dto.location.trim() } : {}),
        ...(serviceFromCatalog ?? {}),
        ...(dto.status !== undefined ? { status: workerStatusFromApi(dto.status) } : {}),
        ...(dto.internalRating !== undefined ? { internalRating: dto.internalRating } : {}),
        ...(dto.customerRating !== undefined ? { customerRating: dto.customerRating } : {}),
      },
    })
    if (resolvedTitlesById.size === 0) {
      resolvedTitlesById = await this.buildTitlesByIdForWorkers([w])
    }
    return workerToApi(w, resolvedTitlesById)
  }

  async remove(id: string) {
    const existing = await this.prisma.worker.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Worker not found.')
    await this.prisma.worker.delete({ where: { id } })
  }

  /** Next `HM-W-####` code (for dashboard parity). */
  async nextWorkerCode(): Promise<string> {
    const workers = await this.prisma.worker.findMany({ select: { workerId: true } })
    let max = 0
    for (const w of workers) {
      const m = /^HM-W-(\d+)$/.exec(w.workerId)
      if (m) max = Math.max(max, parseInt(m[1], 10))
    }
    return `HM-W-${String(max + 1).padStart(4, '0')}`
  }
}
