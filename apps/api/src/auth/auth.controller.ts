import { Body, Controller, Post } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { SendPhoneOTPDto } from './dto/send-phone-otp.dto'
import { VerifyPhoneOTPDto } from './dto/verify-phone-otp.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.identifier, dto.password)
  }

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 signups per minute
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Post('send-phone-otp')
  @Throttle({ default: { limit: 3, ttl: 600000 } }) // 3 OTPs per 10 minutes
  sendPhoneOTP(@Body() dto: SendPhoneOTPDto) {
    return this.auth.sendPhoneOTP(dto.userId)
  }

  @Post('verify-phone-otp')
  @Throttle({ default: { limit: 5, ttl: 600000 } }) // 5 verification attempts per 10 minutes
  verifyPhoneOTP(@Body() dto: VerifyPhoneOTPDto) {
    return this.auth.verifyPhoneOTP(dto.userId, dto.otp)
  }
}
