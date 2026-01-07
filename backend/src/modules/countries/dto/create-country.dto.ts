import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ description: 'Country name', example: 'United States' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ISO country code', example: 'US', maxLength: 5 })
  @IsString()
  @MaxLength(5)
  isoCode: string;

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
