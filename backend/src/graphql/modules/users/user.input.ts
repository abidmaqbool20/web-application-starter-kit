import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    password: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    roleIds?: string[];

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    additionalPermissionIds?: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status?: string;
}

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    password?: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    roleIds?: string[];

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    additionalPermissionIds?: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    status?: string;
}
