import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateMasterDataDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
