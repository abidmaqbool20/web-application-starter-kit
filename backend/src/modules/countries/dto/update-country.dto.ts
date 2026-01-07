import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCountryDto {
  @ApiPropertyOptional({ description: 'Country name', example: 'United States' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'ISO country code', example: 'US', maxLength: 5 })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  isoCode?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
