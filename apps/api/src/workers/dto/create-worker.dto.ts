import { IsIn, IsNumber, IsString, MinLength } from 'class-validator'

const STATUSES = ['active', 'not-active', 'on-hold', 'canceled'] as const

export class CreateWorkerDto {
  @IsString()
  @MinLength(1)
  workerId!: string

  @IsString()
  @MinLength(1)
  name!: string

  @IsString()
  @MinLength(1)
  phone!: string

  @IsString()
  @MinLength(1)
  location!: string

  @IsString()
  @MinLength(1)
  service!: string

  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number]

  @IsNumber()
  internalRating!: number

  @IsNumber()
  customerRating!: number
}
