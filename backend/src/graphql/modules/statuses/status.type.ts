import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StatusType {
    @Field(() => ID)
    id: string;

    @Field()
    statusable_type: string;

    @Field(() => ID)
    statusable_id: string;

    @Field()
    status: string;

    @Field({ nullable: true })
    note?: string;

    @Field(() => ID, { nullable: true })
    changed_by?: string;

    @Field({ nullable: true })
    created_at?: Date;
}
