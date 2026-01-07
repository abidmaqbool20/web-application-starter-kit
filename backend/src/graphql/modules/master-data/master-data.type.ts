import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class MasterDataType {
    @Field(() => ID)
    id: string;

    @Field()
    category: string;

    @Field({ nullable: true })
    key?: string;

    @Field()
    value: string;

    @Field({ nullable: true })
    label?: string;

    @Field(() => ID, { nullable: true })
    parentId?: string;

    @Field(() => Int)
    sortOrder: number;

    @Field(() => GraphQLJSON, { nullable: true })
    metadata?: Record<string, any>;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => MasterDataType, { nullable: true })
    parent?: MasterDataType;
}
