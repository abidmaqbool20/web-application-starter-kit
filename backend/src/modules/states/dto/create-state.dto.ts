import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateStateDto {
  @IsString()
  name: string;

  @IsInt()
  countryId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
