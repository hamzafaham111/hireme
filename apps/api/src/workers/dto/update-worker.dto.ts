import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'

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

  /** When set, replaces catalog links and syncs denormalized `service` from selected titles. */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  siteServiceIds?: string[]

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
