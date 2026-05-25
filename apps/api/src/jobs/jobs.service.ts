import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { RequestUser } from '../common/decorators/current-user.decorator'
import { jobStatusFromApi, jobToApi } from '../common/mappers/domain'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: RequestUser) {
    if (user.role === 'worker') {
      return []
    }
    const list = await this.prisma.job.findMany({
      where: user.role === 'customer' ? { customerUserId: user.userId } : undefined,
      orderBy: { jobId: 'asc' },
    })
    return list.map(jobToApi)
  }

  async findOne(id: string, user: RequestUser) {
    const j = await this.prisma.job.findUnique({ where: { id } })
    if (!j) throw new NotFoundException('Job not found.')
    if (user.role === 'customer' && j.customerUserId !== user.userId) {
      throw new ForbiddenException('You can only view your own jobs.')
    }
    if (user.role === 'worker') {
      throw new ForbiddenException('Workers use marketplace job discovery endpoints.')
    }
    return jobToApi(j)
  }

  async create(dto: CreateJobDto, user: RequestUser) {
    const taken = await this.prisma.job.findUnique({
      where: { jobId: dto.jobId.trim() },
    })
    if (taken) throw new ConflictException('Job ID already in use.')

    let customerUserId = dto.customerUserId
    if (user.role === 'customer') {
      if (customerUserId && customerUserId !== user.userId) {
        throw new ForbiddenException('Cannot assign jobs to another customer.')
      }
      customerUserId = user.userId
    }

    const j = await this.prisma.job.create({
      data: {
        jobId: dto.jobId.trim(),
        summary: dto.summary.trim(),
        service: dto.service.trim(),
        area: dto.area.trim(),
        status: jobStatusFromApi(dto.status),
        assignedWorker: dto.assignedWorker.trim(),
        ...(customerUserId ? { customerUserId } : {}),
        ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
        ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
        ...(dto.siteServiceId ? { siteServiceId: dto.siteServiceId } : {}),
      },
    })
    return jobToApi(j)
  }

  async update(id: string, dto: UpdateJobDto, user: RequestUser) {
    const existing = await this.prisma.job.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Job not found.')
    if (user.role === 'customer') {
      throw new ForbiddenException('Customers cannot edit jobs via this API yet.')
    }
    if (user.role === 'worker') {
      throw new ForbiddenException('Workers cannot edit jobs.')
    }
    if (dto.jobId !== undefined && dto.jobId.trim() !== existing.jobId) {
      const taken = await this.prisma.job.findUnique({
        where: { jobId: dto.jobId.trim() },
      })
      if (taken) throw new ConflictException('Job ID already in use.')
    }
    const j = await this.prisma.job.update({
      where: { id },
      data: {
        ...(dto.jobId !== undefined ? { jobId: dto.jobId.trim() } : {}),
        ...(dto.summary !== undefined ? { summary: dto.summary.trim() } : {}),
        ...(dto.service !== undefined ? { service: dto.service.trim() } : {}),
        ...(dto.area !== undefined ? { area: dto.area.trim() } : {}),
        ...(dto.status !== undefined ? { status: jobStatusFromApi(dto.status) } : {}),
        ...(dto.assignedWorker !== undefined
          ? { assignedWorker: dto.assignedWorker.trim() }
          : {}),
        ...(dto.customerUserId !== undefined
          ? { customerUserId: dto.customerUserId }
          : {}),
        ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
        ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
        ...(dto.siteServiceId !== undefined ? { siteServiceId: dto.siteServiceId } : {}),
      },
    })
    return jobToApi(j)
  }

  async remove(id: string, user: RequestUser) {
    const existing = await this.prisma.job.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Job not found.')
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete jobs.')
    }
    await this.prisma.job.delete({ where: { id } })
  }

  async nextJobCode(user: RequestUser): Promise<string> {
    if (user.role === 'worker') {
      throw new ForbiddenException('Workers cannot allocate job codes.')
    }
    const jobs = await this.prisma.job.findMany({ select: { jobId: true } })
    let max = 0
    for (const j of jobs) {
      const m = /^HM-J-(\d+)$/.exec(j.jobId)
      if (m) max = Math.max(max, parseInt(m[1], 10))
    }
    return `HM-J-${String(max + 1).padStart(4, '0')}`
  }
}
