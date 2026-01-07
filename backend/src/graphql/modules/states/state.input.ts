import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateStateInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    countryId: number;

    @Field(() => Boolean, { nullable: true, defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

@InputType()
export class UpdateStateInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    countryId?: number;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
