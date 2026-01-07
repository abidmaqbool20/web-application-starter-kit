import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesService } from '../../../modules/roles/roles.service';
import { RoleType } from './role.type';
import { CreateRoleInput, UpdateRoleInput } from './role.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => RoleType)
@UseGuards(GqlAuthGuard)
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) { }

    @Query(() => [RoleType], { name: 'roles' })
    async findAll(): Promise<any[]> {
        const roles = await this.rolesService.findAll();
        return roles.map(role => ({
            ...role,
            id: role.id.toString(),
            permissions: role.permissions?.map(p => ({
                id: p.id.toString(),
                name: p.name,
                key: p.key,
                parent_id: p.parent_id ? p.parent_id.toString() : null,
            })),
        }));
    }

    @Query(() => RoleType, { name: 'role', nullable: true })
    async findOne(@Args('id', { type: () => ID }) id: string): Promise<any> {
        const role = await this.rolesService.findOne(BigInt(id));
        if (!role) return null;
        return {
            ...role,
            id: role.id.toString(),
            permissions: role.permissions?.map(p => ({
                id: p.id.toString(),
                name: p.name,
                key: p.key,
                parent_id: p.parent_id ? p.parent_id.toString() : null,
            })),
        };
    }

    @Mutation(() => RoleType)
    async createRole(@Args('input') input: CreateRoleInput): Promise<any> {
        const role = await this.rolesService.create({
            name: input.name,
            permissions: input.permissionIds || [],
        });
        return {
            ...role,
            id: role.id.toString(),
            permissions: role.permissions?.map(p => ({
                id: p.id.toString(),
                name: p.name,
                key: p.key,
                parent_id: p.parent_id ? p.parent_id.toString() : null,
            })),
        };
    }

    @Mutation(() => RoleType)
    async updateRole(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateRoleInput,
    ): Promise<any> {
        const role = await this.rolesService.update(BigInt(id), {
            name: input.name,
            permissions: input.permissionIds,
        } as any);
        return {
            ...role,
            id: role.id.toString(),
            permissions: role.permissions?.map(p => ({
                id: p.id.toString(),
                name: p.name,
                key: p.key,
                parent_id: p.parent_id ? p.parent_id.toString() : null,
            })),
        };
    }

    @Mutation(() => Boolean)
    async deleteRole(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.rolesService.remove(BigInt(id));
    }
}
