import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsOptional()
  @IsInt()
  stateId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
