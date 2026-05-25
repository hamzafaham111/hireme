import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../common/prisma/prisma.service'
import type { JwtPayload } from './jwt-payload.interface'
import type { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const normalized = identifier.trim()
    
    // Detect if identifier is email or phone
    const isEmail = normalized.includes('@')
    
    // Query by email or phone accordingly
    const user = isEmail
      ? await this.prisma.user.findUnique({ where: { email: normalized.toLowerCase() } })
      : await this.prisma.user.findUnique({ where: { phone: normalized } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    // Check if worker is approved (Worker table is the source of truth)
    let workerApproved = true // Default for non-workers
    if (user.role === 'worker') {
      const workerProfile = await this.prisma.worker.findUnique({
        where: { userId: user.id },
      })
      console.log({workerProfile})
      if (!workerProfile || workerProfile.approvalStatus !== 'approved') {
        throw new UnauthorizedException('Your worker account is pending admin approval.')
      }
      // Worker is approved if we get here
      workerApproved = true
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }
    const access_token = await this.jwt.signAsync(payload)
    return {
      access_token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        phoneVerified: user.phoneVerified,
        workerApproved, // Now derived from Worker.approvalStatus, not User.workerApproved
      },
    }
  }

  async register(dto: RegisterDto) {
    const normalizedPhone = dto.phone.trim()
    const normalizedEmail = dto.email.trim().toLowerCase()

    // Check phone uniqueness
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    })
    if (existingPhone) {
      throw new ConflictException('Phone number already in use.')
    }

    // Check email uniqueness
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    })
    if (existingEmail) {
      throw new ConflictException('Email already in use.')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    // Customer: active by default, Worker: pending approval
    const status = 'active'
    const workerApproved = dto.role === 'customer'

    const user = await this.prisma.user.create({
      data: {
        phone: normalizedPhone,
        email: normalizedEmail,
        passwordHash,
        name: dto.name.trim(),
        role: dto.role,
        status,
        workerApproved,
      },
    })

    // Create role-specific profile
    if (dto.role === 'customer') {
      await this.prisma.customer.create({
        data: {
          userId: user.id,
          customerType: 'individual',
        },
      })
    } else if (dto.role === 'worker') {
      // Create Worker profile with pending status
      await this.prisma.worker.create({
        data: {
          userId: user.id,
          workerId: `W-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: user.name,
          phone: user.phone as string,
          location: '',
          service: '',
          status: 'not_active',
          internalRating: 0,
          customerRating: 0,
          approvalStatus: 'pending',
        },
      })
    }

    // Generate SMS OTP (placeholder - will implement SMS service later)
    await this.sendPhoneOTP(user.id)

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }
    const access_token = await this.jwt.signAsync(payload)

    return {
      access_token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        phoneVerified: user.phoneVerified,
        // Workers are pending until approved in dashboard; customers are approved immediately
        workerApproved: dto.role === 'customer',
      },
    }
  }

  async sendPhoneOTP(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await this.prisma.user.update({
      where: { id: userId },
      data: { phoneOTP: otp, phoneOTPExpiry: expiry },
    })

    // TODO: Send SMS via Twilio/AWS SNS
    // For now, just log it (development mode)
    console.log(`[DEV] SMS OTP for ${user.phone}: ${otp}`)

    return { success: true }
  }

  async verifyPhoneOTP(userId: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    if (!user.phoneOTP || !user.phoneOTPExpiry) {
      throw new BadRequestException('No verification code found. Request a new one.')
    }

    if (new Date() > user.phoneOTPExpiry) {
      throw new BadRequestException('Verification code expired. Request a new one.')
    }

    if (user.phoneOTP !== otp) {
      throw new BadRequestException('Invalid verification code.')
    }

    // Mark phone as verified
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneVerified: true,
        phoneOTP: null,
        phoneOTPExpiry: null,
      },
    })

    return { success: true, phoneVerified: true }
  }
}
