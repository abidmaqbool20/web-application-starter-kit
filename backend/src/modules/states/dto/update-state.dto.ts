import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateStateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  countryId?: number;
}
