import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateCountryInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    isoCode: string;

    @Field(() => Boolean, { nullable: true, defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

@InputType()
export class UpdateCountryInput {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    isoCode?: string;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
