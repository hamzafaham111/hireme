import { IsIn, IsString, MinLength } from 'class-validator'

const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'] as const

export class CreateJobDto {
  @IsString()
  @MinLength(1)
  jobId!: string

  @IsString()
  @MinLength(1)
  summary!: string

  @IsString()
  @MinLength(1)
  service!: string

  @IsString()
  @MinLength(1)
  area!: string

  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number]

  @IsString()
  assignedWorker!: string
}
