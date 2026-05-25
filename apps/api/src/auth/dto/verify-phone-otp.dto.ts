import { IsString, Length } from 'class-validator'

export class VerifyPhoneOTPDto {
  @IsString()
  userId!: string

  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp!: string
}
