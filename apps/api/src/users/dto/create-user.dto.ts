import { IsEmail, IsIn, IsString, MinLength } from 'class-validator'

const ROLES = ['superadmin', 'admin', 'agent', 'content_editor'] as const
const STATUSES = ['active', 'invited'] as const

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(1)
  password!: string

  @IsIn(ROLES)
  role!: (typeof ROLES)[number]

  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number]
}
