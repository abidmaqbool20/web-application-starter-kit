import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
    @Field()
    name: string;

    @Field(() => [String], { nullable: true })
    permissionIds?: string[];
}

@InputType()
export class UpdateRoleInput {
    @Field({ nullable: true })
    name?: string;

    @Field(() => [String], { nullable: true })
    permissionIds?: string[];
}
