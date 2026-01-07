import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoleType } from '../roles/role.type';
import { PermissionType } from '../permissions/permission.type';
import { StatusType } from '../statuses/status.type';

@ObjectType()
export class UserType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field(() => [RoleType], { nullable: true })
    roles?: RoleType[];

    @Field(() => [PermissionType], { nullable: true })
    additional_permissions?: PermissionType[];

    @Field({ nullable: true })
    status?: string;

    @Field(() => [StatusType], { nullable: true })
    statuses?: StatusType[];

    @Field({ nullable: true })
    created_at?: Date;

    @Field({ nullable: true })
    updated_at?: Date;
}
