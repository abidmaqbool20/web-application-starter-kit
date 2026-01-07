import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AuthPermissionType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    key: string;

    @Field(() => ID, { nullable: true })
    parent_id?: string;
}

@ObjectType()
export class AuthRoleType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => [AuthPermissionType], { nullable: true })
    permissions?: AuthPermissionType[];
}

@ObjectType()
export class AuthUserType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    status?: string;

    @Field(() => [AuthRoleType], { nullable: true })
    roles?: AuthRoleType[];

    @Field(() => [AuthPermissionType], { nullable: true })
    additional_permissions?: AuthPermissionType[];
}

@ObjectType()
export class AuthResponseType {
    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    access_token?: string;

    @Field(() => AuthUserType, { nullable: true })
    user?: AuthUserType;
}

@ObjectType()
export class MeResponseType {
    @Field()
    success: boolean;

    @Field(() => AuthUserType)
    user: AuthUserType;
}
