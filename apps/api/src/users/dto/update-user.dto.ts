import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator'

const ROLES = ['superadmin', 'admin', 'agent', 'content_editor'] as const
const STATUSES = ['active', 'invited'] as const

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  password?: string

  @IsOptional()
  @IsIn(ROLES)
  role?: (typeof ROLES)[number]

  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number]
}
