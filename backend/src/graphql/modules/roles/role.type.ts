import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PermissionType } from '../permissions/permission.type';

@ObjectType()
export class RoleType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => [PermissionType], { nullable: true })
    permissions?: PermissionType[];
}
