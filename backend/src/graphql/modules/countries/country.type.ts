import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CountryType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    isoCode: string;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
