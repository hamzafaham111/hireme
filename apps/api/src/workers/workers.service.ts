import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { workerStatusFromApi, workerToApi } from '../common/mappers/domain'
import { CreateWorkerDto } from './dto/create-worker.dto'
import { UpdateWorkerDto } from './dto/update-worker.dto'

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.worker.findMany({ orderBy: { workerId: 'asc' } })
    return list.map(workerToApi)
  }

  async findOne(id: string) {
    const w = await this.prisma.worker.findUnique({ where: { id } })
    if (!w) throw new NotFoundException('Worker not found.')
    return workerToApi(w)
  }

  async create(dto: CreateWorkerDto) {
    const taken = await this.prisma.worker.findUnique({
      where: { workerId: dto.workerId.trim() },
    })
    if (taken) throw new ConflictException('Worker ID already in use.')
    const w = await this.prisma.worker.create({
      data: {
        workerId: dto.workerId.trim(),
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        location: dto.location.trim(),
        service: dto.service.trim(),
        status: workerStatusFromApi(dto.status),
        internalRating: dto.internalRating,
        customerRating: dto.customerRating,
      },
    })
    return workerToApi(w)
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
    const w = await this.prisma.worker.update({
      where: { id },
      data: {
        ...(dto.workerId !== undefined ? { workerId: dto.workerId.trim() } : {}),
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
        ...(dto.location !== undefined ? { location: dto.location.trim() } : {}),
        ...(dto.service !== undefined ? { service: dto.service.trim() } : {}),
        ...(dto.status !== undefined ? { status: workerStatusFromApi(dto.status) } : {}),
        ...(dto.internalRating !== undefined ? { internalRating: dto.internalRating } : {}),
        ...(dto.customerRating !== undefined ? { customerRating: dto.customerRating } : {}),
      },
    })
    return workerToApi(w)
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
