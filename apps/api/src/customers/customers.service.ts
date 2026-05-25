import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { customerToApi } from '../common/mappers/domain'
import type { UpdateCustomerDto } from './dto/update-customer.dto'

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { user: true },
    })
    
    if (!customer) {
      throw new NotFoundException(`Customer profile not found for user ${userId}`)
    }
    
    return customerToApi(customer)
  }

  async findAll() {
    const customers = await this.prisma.customer.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
    return customers.map((c) => customerToApi(c))
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { user: true },
    })
    
    if (!customer) {
      throw new NotFoundException(`Customer not found`)
    }
    
    return customerToApi(customer)
  }

  async update(id: string, data: UpdateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { id },
    })
    
    if (!existing) {
      throw new NotFoundException(`Customer not found`)
    }
    
    const updated = await this.prisma.customer.update({
      where: { id },
      data,
      include: { user: true },
    })
    
    return customerToApi(updated)
  }

  // Analytics methods
  async incrementJobCount(userId: string) {
    await this.prisma.customer.update({
      where: { userId },
      data: { totalJobsPosted: { increment: 1 } },
    })
  }

  async addToSpent(userId: string, amount: number) {
    await this.prisma.customer.update({
      where: { userId },
      data: { totalSpent: { increment: amount } },
    })
  }

  async updateReputationScore(userId: string, score: number) {
    await this.prisma.customer.update({
      where: { userId },
      data: { reputationScore: score },
    })
  }
}
