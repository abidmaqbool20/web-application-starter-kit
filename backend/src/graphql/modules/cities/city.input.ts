import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateCityInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    countryId: number;

    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    stateId: number;

    @Field(() => Boolean, { nullable: true, defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

@InputType()
export class UpdateCityInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    countryId?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    stateId?: number;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
