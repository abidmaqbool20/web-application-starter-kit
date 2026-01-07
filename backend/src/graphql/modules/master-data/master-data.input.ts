import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt, IsObject } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateMasterDataInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    category: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    key?: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    value: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    label?: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    parentId?: string;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    @IsInt()
    @IsOptional()
    sortOrder?: number;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;

    @Field(() => Boolean, { nullable: true, defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

@InputType()
export class UpdateMasterDataInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    category?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    key?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    value?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    label?: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    parentId?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    sortOrder?: number;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
