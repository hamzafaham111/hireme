import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'

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

  /** Catalog rows; `service` label is derived server-side from these titles. */
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  siteServiceIds!: string[]

  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number]

  @IsNumber()
  internalRating!: number

  @IsNumber()
  customerRating!: number
}
