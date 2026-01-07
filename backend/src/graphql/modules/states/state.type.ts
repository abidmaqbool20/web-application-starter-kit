import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CountryType } from '../countries/country.type';

@ObjectType()
export class StateType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    isActive: boolean;

    @Field(() => CountryType)
    country: CountryType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
