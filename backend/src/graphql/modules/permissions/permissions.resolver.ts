import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PermissionsService } from '../../../modules/permissions/permissions.service';
import { PermissionType } from './permission.type';
import { CreatePermissionInput, UpdatePermissionInput } from './permission.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => PermissionType)
@UseGuards(GqlAuthGuard)
export class PermissionsResolver {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Query(() => [PermissionType], { name: 'permissions' })
    async findAll(): Promise<PermissionType[]> {
        const permissions = await this.permissionsService.findAll();
        return permissions.map(permission => ({
            id: permission.id.toString(),
            name: permission.name,
            key: permission.key,
            parent_id: permission.parent_id ? permission.parent_id.toString() : null,
        }));
    }

    @Query(() => PermissionType, { name: 'permission', nullable: true })
    async findOne(@Args('id', { type: () => ID }) id: string): Promise<PermissionType | null> {
        const permission = await this.permissionsService.findOne(BigInt(id));
        if (!permission) return null;
        return {
            id: permission.id.toString(),
            name: permission.name,
            key: permission.key,
            parent_id: permission.parent_id ? permission.parent_id.toString() : null,
        };
    }

    @Mutation(() => PermissionType)
    async createPermission(@Args('input') input: CreatePermissionInput): Promise<PermissionType> {
        const permission = await this.permissionsService.create({
            name: input.name,
            key: input.key,
            parent_id: input.parent_id ? BigInt(input.parent_id) : null,
        });
        return {
            id: permission.id.toString(),
            name: permission.name,
            key: permission.key,
            parent_id: permission.parent_id ? permission.parent_id.toString() : null,
        };
    }

    @Mutation(() => PermissionType)
    async updatePermission(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdatePermissionInput,
    ): Promise<PermissionType> {
        const permission = await this.permissionsService.update(BigInt(id), {
            name: input.name,
            key: input.key,
            parent_id: input.parent_id ? BigInt(input.parent_id) : null,
        });
        return {
            id: permission.id.toString(),
            name: permission.name,
            key: permission.key,
            parent_id: permission.parent_id ? permission.parent_id.toString() : null,
        };
    }

    @Mutation(() => Boolean)
    async deletePermission(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.permissionsService.remove(BigInt(id));
    }
}
