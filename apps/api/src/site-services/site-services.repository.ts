import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, type SiteService as SiteServiceRow } from '@prisma/client'
import type { SiteService } from '@hire-me/types'
import { randomUUID } from 'crypto'
import { PrismaService } from '../common/prisma/prisma.service'
import { slugify } from '../common/utils/slugify'
import { CreateSiteServiceDto } from './dto/create-site-service.dto'
import { UpdateSiteServiceDto } from './dto/update-site-service.dto'
import { formatServiceKey, parseMaxServiceKeyIndex } from './site-service-key.util'

function toApi(row: SiteServiceRow): SiteService {
  return {
    id: row.id,
    serviceKey: row.serviceKey,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    iconKey: row.iconKey,
    iconImageUrl: row.iconImageUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

@Injectable()
export class SiteServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(): Promise<SiteService[]> {
    const rows = await this.prisma.siteService.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    })
    return rows.map(toApi)
  }

  async listAdmin(): Promise<SiteService[]> {
    const rows = await this.prisma.siteService.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    })
    return rows.map(toApi)
  }

  async findOneAdmin(id: string): Promise<SiteService> {
    const row = await this.prisma.siteService.findUnique({ where: { id } })
    if (!row) throw new NotFoundException('Site service not found.')
    return toApi(row)
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let slug = base || `service-${randomUUID().slice(0, 8)}`
    const existing = await this.prisma.siteService.findUnique({ where: { slug } })
    if (!existing) return slug
    return `${slug}-${randomUUID().slice(0, 8)}`
  }

  /** Next SS-xx code from existing rows (immutable after create). */
  private async allocateNextServiceKey(): Promise<string> {
    const rows = await this.prisma.siteService.findMany({
      select: { serviceKey: true },
    })
    const next = parseMaxServiceKeyIndex(rows.map((r) => r.serviceKey)) + 1
    return formatServiceKey(next)
  }

  async create(dto: CreateSiteServiceDto): Promise<SiteService> {
    const title = dto.title.trim()
    const rawSlug = dto.slug?.trim() ? slugify(dto.slug) : slugify(title)
    const slug = await this.ensureUniqueSlug(rawSlug)
    const maxOrder = await this.prisma.siteService.aggregate({
      _max: { sortOrder: true },
    })
    const sortOrder =
      dto.sortOrder !== undefined
        ? dto.sortOrder
        : (maxOrder._max.sortOrder ?? -1) + 1

    const createData = {
      slug,
      title,
      shortDescription: dto.shortDescription.trim(),
      iconKey: dto.iconKey,
      iconImageUrl:
        dto.iconImageUrl !== undefined && dto.iconImageUrl !== null
          ? dto.iconImageUrl.trim() || null
          : null,
      sortOrder,
      isActive: dto.isActive ?? true,
    }

    let row: SiteServiceRow | null = null
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const serviceKey = await this.allocateNextServiceKey()
      try {
        row = await this.prisma.siteService.create({
          data: {
            ...createData,
            serviceKey,
          },
        })
        break
      } catch (error: unknown) {
        const prismaError =
          error instanceof Prisma.PrismaClientKnownRequestError ? error : null
        const rawTarget = prismaError?.meta?.target
        const duplicateTargets = Array.isArray(rawTarget)
          ? rawTarget.map((x) => String(x))
          : typeof rawTarget === 'string'
            ? [rawTarget]
            : []
        const isDuplicateServiceKey =
          prismaError?.code === 'P2002' &&
          duplicateTargets.some((target) =>
            ['service_key', 'serviceKey'].includes(target),
          )
        if (!isDuplicateServiceKey || attempt === 1) throw error
      }
    }
    if (!row) throw new ConflictException('Could not allocate service key.')
    return toApi(row)
  }

  async update(id: string, dto: UpdateSiteServiceDto): Promise<SiteService> {
    const existing = await this.prisma.siteService.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Site service not found.')

    let slug = existing.slug
    if (dto.slug !== undefined) {
      const raw = dto.slug.trim()
      if (raw) {
        const nextSlug = slugify(raw)
        if (nextSlug && nextSlug !== existing.slug) {
          const taken = await this.prisma.siteService.findUnique({
            where: { slug: nextSlug },
          })
          if (taken && taken.id !== id) {
            throw new ConflictException('Slug already in use.')
          }
          slug = nextSlug
        }
      }
    }

    const row = await this.prisma.siteService.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.shortDescription !== undefined
          ? { shortDescription: dto.shortDescription.trim() }
          : {}),
        ...(dto.iconKey !== undefined ? { iconKey: dto.iconKey } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.iconImageUrl !== undefined
          ? {
              iconImageUrl:
                dto.iconImageUrl === null || dto.iconImageUrl.trim() === ''
                  ? null
                  : dto.iconImageUrl.trim(),
            }
          : {}),
        slug,
      },
    })
    return toApi(row)
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.siteService.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Site service not found.')
    await this.prisma.siteService.delete({ where: { id } })
  }
}
