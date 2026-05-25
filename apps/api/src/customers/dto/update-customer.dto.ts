import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator'

export enum CustomerType {
  individual = 'individual',
  residential = 'residential',
  commercial = 'commercial',
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  preferredLocation?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredServices?: string[]

  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType

  @IsOptional()
  @IsString()
  billingAddress?: string

  @IsOptional()
  @IsString()
  communicationPref?: string
}
