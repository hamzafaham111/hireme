import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { jobStatusFromApi, jobToApi } from '../common/mappers/domain'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.job.findMany({ orderBy: { jobId: 'asc' } })
    return list.map(jobToApi)
  }

  async findOne(id: string) {
    const j = await this.prisma.job.findUnique({ where: { id } })
    if (!j) throw new NotFoundException('Job not found.')
    return jobToApi(j)
  }

  async create(dto: CreateJobDto) {
    const taken = await this.prisma.job.findUnique({
      where: { jobId: dto.jobId.trim() },
    })
    if (taken) throw new ConflictException('Job ID already in use.')
    const j = await this.prisma.job.create({
      data: {
        jobId: dto.jobId.trim(),
        summary: dto.summary.trim(),
        service: dto.service.trim(),
        area: dto.area.trim(),
        status: jobStatusFromApi(dto.status),
        assignedWorker: dto.assignedWorker.trim(),
      },
    })
    return jobToApi(j)
  }

  async update(id: string, dto: UpdateJobDto) {
    const existing = await this.prisma.job.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Job not found.')
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
      },
    })
    return jobToApi(j)
  }

  async remove(id: string) {
    const existing = await this.prisma.job.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Job not found.')
    await this.prisma.job.delete({ where: { id } })
  }

  async nextJobCode(): Promise<string> {
    const jobs = await this.prisma.job.findMany({ select: { jobId: true } })
    let max = 0
    for (const j of jobs) {
      const m = /^HM-J-(\d+)$/.exec(j.jobId)
      if (m) max = Math.max(max, parseInt(m[1], 10))
    }
    return `HM-J-${String(max + 1).padStart(4, '0')}`
  }
}
