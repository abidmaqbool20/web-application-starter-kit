import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name: string;

  @IsInt()
  countryId: number;

  @IsInt()
  stateId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
