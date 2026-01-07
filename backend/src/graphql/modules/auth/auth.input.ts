import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { UserType } from '../../../modules/users/enums/user-type.enum';

@InputType()
export class LoginInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    username: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    password: string;

    @Field(() => String)
    @IsEnum(UserType)
    @IsNotEmpty()
    user_type: UserType;
}

@InputType()
export class RegisterInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String)
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    password: string;
}
