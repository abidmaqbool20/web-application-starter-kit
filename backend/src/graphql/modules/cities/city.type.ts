import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CountryType } from '../countries/country.type';
import { StateType } from '../states/state.type';

@ObjectType()
export class CityType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    isActive: boolean;

    @Field(() => CountryType)
    country: CountryType;

    @Field(() => StateType)
    state: StateType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
