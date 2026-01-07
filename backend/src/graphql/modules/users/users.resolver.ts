import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../../../modules/users/users.service';
import { UserType } from './user.type';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';

@Resolver(() => UserType)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    private mapUser(user: any): any {
        return {
            ...user,
            id: user.id.toString(),
            created_at: user.created_at ? new Date(user.created_at) : null,
            updated_at: user.updated_at ? new Date(user.updated_at) : null,
            roles: user.roles?.map((role: any) => ({
                ...role,
                id: role.id.toString(),
                permissions: role.permissions?.map((perm: any) => ({
                    id: perm.id.toString(),
                    name: perm.name,
                    key: perm.key,
                    parent_id: perm.parent_id ? perm.parent_id.toString() : null,
                })),
            })),
            additional_permissions: user.additional_permissions?.map((perm: any) => ({
                id: perm.id.toString(),
                name: perm.name,
                key: perm.key,
                parent_id: perm.parent_id ? perm.parent_id.toString() : null,
            })),
            statuses: user.statuses?.map((status: any) => ({
                id: status.id.toString(),
                statusable_type: status.statusable_type,
                statusable_id: status.statusable_id.toString(),
                status: status.status,
                note: status.note,
                changed_by: status.changed_by ? status.changed_by.toString() : null,
                created_at: status.created_at ? new Date(status.created_at) : null,
            })),
        };
    }

    @Query(() => [UserType], { name: 'users' })
    async findAll(): Promise<any[]> {
        const users = await this.usersService.findAll();
        return users.map(user => this.mapUser(user));
    }

    @Query(() => UserType, { name: 'user', nullable: true })
    async findOne(@Args('id', { type: () => ID }) id: string): Promise<any> {
        const user = await this.usersService.findOne(BigInt(id));
        if (!user) return null;
        return this.mapUser(user);
    }

    @Query(() => UserType, { name: 'userWithStatusHistory', nullable: true })
    async findOneWithStatusHistory(@Args('id', { type: () => ID }) id: string): Promise<any> {
        const user = await this.usersService.findOneWithStatusHistory(BigInt(id));
        if (!user) return null;
        return this.mapUser(user);
    }

    @Mutation(() => UserType)
    async createUser(@Args('input') input: CreateUserInput): Promise<any> {
        const user = await this.usersService.create({
            name: input.name,
            email: input.email,
            password: input.password,
            roleIds: input.roleIds?.map(id => Number(id)),
            additionalPermissionIds: input.additionalPermissionIds,
            status: input.status,
        } as any);
        return this.mapUser(user);
    }

    @Mutation(() => UserType)
    async updateUser(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateUserInput,
    ): Promise<any> {
        const user = await this.usersService.update(BigInt(id), {
            name: input.name,
            email: input.email,
            password: input.password,
            roleIds: input.roleIds?.map(id => Number(id)),
            additionalPermissionIds: input.additionalPermissionIds,
            status: input.status,
        } as any);
        return this.mapUser(user);
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        await this.usersService.remove(BigInt(id));
        return true;
    }
}
