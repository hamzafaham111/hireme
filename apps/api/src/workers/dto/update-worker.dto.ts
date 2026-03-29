import { IsIn, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

const STATUSES = ['active', 'not-active', 'on-hold', 'canceled'] as const

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  workerId?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  phone?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  location?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  service?: string

  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number]

  @IsOptional()
  @IsNumber()
  internalRating?: number

  @IsOptional()
  @IsNumber()
  customerRating?: number
}
