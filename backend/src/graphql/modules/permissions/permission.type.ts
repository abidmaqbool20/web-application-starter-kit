import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PermissionType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    key: string;

    @Field({ nullable: true })
    parent_id?: string;
}
