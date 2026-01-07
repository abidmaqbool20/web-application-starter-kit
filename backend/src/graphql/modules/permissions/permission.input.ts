import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
    @Field()
    name: string;

    @Field()
    key: string;

    @Field(() => ID, { nullable: true })
    parent_id?: string;
}

@InputType()
export class UpdatePermissionInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    key?: string;

    @Field(() => ID, { nullable: true })
    parent_id?: string;
}
