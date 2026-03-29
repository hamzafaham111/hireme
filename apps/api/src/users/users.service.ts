import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { DashboardRole, UserStatus } from '@prisma/client'
import type { DashboardUser } from '@hire-me/types'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

function toPublicUser(u: {
  id: string
  email: string
  name: string
  role: DashboardRole
  status: UserStatus
}): Omit<DashboardUser, 'password'> {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role as DashboardUser['role'],
    status: u.status as DashboardUser['status'],
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.user.findMany({ orderBy: { email: 'asc' } })
    return list.map((u) => toPublicUser(u))
  }

  async findOne(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id } })
    if (!u) throw new NotFoundException('User not found.')
    return toPublicUser(u)
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase()
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictException('Email already in use.')
    const passwordHash = await bcrypt.hash(dto.password, 10)
    const u = await this.prisma.user.create({
      data: {
        email,
        name: dto.name.trim(),
        passwordHash,
        role: dto.role as DashboardRole,
        status: dto.status as UserStatus,
      },
    })
    return toPublicUser(u)
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('User not found.')

    const email =
      dto.email !== undefined ? dto.email.trim().toLowerCase() : undefined
    if (email && email !== existing.email) {
      const taken = await this.prisma.user.findUnique({ where: { email } })
      if (taken) throw new ConflictException('Email already in use.')
    }

    const passwordHash =
      dto.password && dto.password.length > 0
        ? await bcrypt.hash(dto.password, 10)
        : undefined

    const u = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(passwordHash !== undefined ? { passwordHash } : {}),
        ...(dto.role !== undefined ? { role: dto.role as DashboardRole } : {}),
        ...(dto.status !== undefined ? { status: dto.status as UserStatus } : {}),
      },
    })
    return toPublicUser(u)
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('User not found.')
    await this.prisma.user.delete({ where: { id } })
  }
}
