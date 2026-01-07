import { IsString, IsEmail, ValidateIf, IsEnum, IsNotEmpty } from 'class-validator';
import { UserType } from '../../users/enums/user-type.enum';

export class LoginDto {
  @ValidateIf(o => o.email === undefined)
  @IsEmail()
  username: string;

  @ValidateIf(o => o.username === undefined)
  @IsEmail()
  email?: string;

  @IsString()
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  user_type: UserType;
}
