import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  identifier!: string // Can be phone OR email

  @IsString()
  @MinLength(1)
  password!: string
}
