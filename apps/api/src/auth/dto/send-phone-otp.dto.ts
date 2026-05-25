import { IsString } from 'class-validator'

export class SendPhoneOTPDto {
  @IsString()
  userId!: string // Send OTP to user's registered phone
}
