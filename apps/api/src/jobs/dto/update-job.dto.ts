import { IsIn, IsOptional, IsString, MinLength } from 'class-validator'

const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'] as const

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  jobId?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  summary?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  service?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  area?: string

  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number]

  @IsOptional()
  @IsString()
  assignedWorker?: string
}
