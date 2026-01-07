import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {

  @ApiProperty({ description: 'The name of the Permission' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The key of the Permission' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'The parent permission id', required: false })
  @IsOptional()
  parent_id?: bigint;
}
