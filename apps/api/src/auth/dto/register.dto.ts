import { IsEmail, IsIn, IsString, MinLength, Matches } from 'class-validator'

const SIGNUP_ROLES = ['customer', 'worker'] as const

export class RegisterDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format (use +923001234567)' })
  phone!: string // PRIMARY identifier

  @IsEmail()
  email!: string // Required for recovery

  @IsString()
  @MinLength(1)
  name!: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password!: string

  @IsIn(SIGNUP_ROLES)
  role!: (typeof SIGNUP_ROLES)[number]
}
