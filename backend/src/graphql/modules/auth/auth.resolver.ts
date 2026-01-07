import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';
import { AuthResponseType, MeResponseType } from './auth.type';
import { LoginInput, RegisterInput } from './auth.input';
import { GqlAuthGuard } from '../common/gql-auth.guard';
import { UsersService } from '../../../modules/users/users.service';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Mutation(() => AuthResponseType)
    async login(
        @Args('input') input: LoginInput,
        @Context() context: any,
    ): Promise<AuthResponseType> {
        const result = await this.authService.login({
            username: input.username,
            password: input.password,
            user_type: input.user_type,
        });

        // Set HTTP-only cookie for authentication
        if (context.res) {
            const isProduction = process.env.NODE_ENV === 'production';
            context.res.cookie('access_token', result.access_token, {
                httpOnly: true,
                secure: isProduction, // true in production with HTTPS
                sameSite: isProduction ? 'none' : 'lax', // 'lax' for same-origin in dev
                maxAge: 1000 * 60 * 60 * 24, // 1 day
                path: '/',
            });
        }

        return {
            success: true,
            message: 'Login successful',
        };
    }

    @Mutation(() => AuthResponseType)
    async register(@Args('input') input: RegisterInput): Promise<AuthResponseType> {
        const result = await this.authService.register({
            name: input.name,
            email: input.email,
            password: input.password,
            created_at: new Date(),
            updated_at: new Date(),
        } as any);

        return {
            success: true,
            message: 'Registration successful',
            access_token: (result as any).access_token,
        };
    }

    @Query(() => MeResponseType)
    @UseGuards(GqlAuthGuard)
    async me(@Context() context: any): Promise<MeResponseType> {
        const jwtUser = context.req.user;

        // Fetch the full user data from the database
        const user = await this.usersService.findOne(BigInt(jwtUser.sub));

        if (!user) {
            throw new Error('User not found');
        }

        return {
            success: true,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                status: user.status,
                roles: user.roles?.map(role => ({
                    id: role.id.toString(),
                    name: role.name,
                    permissions: role.permissions?.map(perm => ({
                        id: perm.id.toString(),
                        name: perm.name,
                        key: perm.key,
                        parent_id: perm.parent_id ? perm.parent_id.toString() : null,
                    })),
                })),
                additional_permissions: user.additional_permissions?.map(perm => ({
                    id: perm.id.toString(),
                    name: perm.name,
                    key: perm.key,
                    parent_id: perm.parent_id ? perm.parent_id.toString() : null,
                })),
            },
        };
    }

    @Mutation(() => AuthResponseType)
    @UseGuards(GqlAuthGuard)
    async logout(@Context() context: any): Promise<AuthResponseType> {
        const token = context.req.cookies?.access_token ||
            context.req.headers?.authorization?.split(' ')[1];

        if (token) {
            await this.authService.logout(token, {});
        }

        if (context.res) {
            context.res.clearCookie('access_token', {
                path: '/',
            });
        }

        return {
            success: true,
            message: 'Logout successful',
        };
    }
}
