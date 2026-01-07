import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLErrorLogger } from './common/graphql-error-logger.service';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from './common/graphql-exception.filter';

// Import all GraphQL modules
import { UsersGraphQLModule } from './modules/users/users-graphql.module';
import { RolesGraphQLModule } from './modules/roles/roles-graphql.module';
import { PermissionsGraphQLModule } from './modules/permissions/permissions-graphql.module';
import { CountriesGraphQLModule } from './modules/countries/countries-graphql.module';
import { StatesGraphQLModule } from './modules/states/states-graphql.module';
import { CitiesGraphQLModule } from './modules/cities/cities-graphql.module';
import { MasterDataGraphQLModule } from './modules/master-data/master-data-graphql.module';
import { ProfilesGraphQLModule } from './modules/profiles/profiles-graphql.module';
import { SubscriptionPlansGraphQLModule } from './modules/subscription-plans/subscription-plans-graphql.module';
import { UserSubscriptionsGraphQLModule } from './modules/user-subscriptions/user-subscriptions-graphql.module';
import { PaymentsGraphQLModule } from './modules/payments/payments-graphql.module';
import { PromoCodesGraphQLModule } from './modules/promo-codes/promo-codes-graphql.module';
import { UserVouchersGraphQLModule } from './modules/user-vouchers/user-vouchers-graphql.module';
import { SupportTicketsGraphQLModule } from './modules/support-tickets/support-tickets-graphql.module';
import { SupportMessagesGraphQLModule } from './modules/support-messages/support-messages-graphql.module';
import { ProfileReportsGraphQLModule } from './modules/profile-reports/profile-reports-graphql.module';
import { UserProfilePreferencesGraphQLModule } from './modules/user-profile-preferences/user-profile-preferences-graphql.module';
import { AuthGraphQLModule } from './modules/auth/auth-graphql.module';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/graphql/schemas/schema.gql'),
            sortSchema: true,
            playground: process.env.NODE_ENV !== 'production',
            introspection: process.env.NODE_ENV !== 'production',
            path: '/graphql',
            context: ({ req, res }) => ({ req, res }),
            buildSchemaOptions: {
                dateScalarMode: 'isoDate',
            },
            formatError: (error) => {
                // Custom error formatting
                return {
                    message: error.message,
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                    statusCode: error.extensions?.statusCode || 500,
                    timestamp: error.extensions?.timestamp || new Date().toISOString(),
                    path: error.path,
                    ...(process.env.NODE_ENV === 'development' && {
                        stack: error.extensions?.stack,
                        locations: error.locations,
                    }),
                };
            },
            include: [],
        }),
        // Auth module
        AuthGraphQLModule,
        // Core modules
        UsersGraphQLModule,
        RolesGraphQLModule,
        PermissionsGraphQLModule,
        // Location modules
        CountriesGraphQLModule,
        StatesGraphQLModule,
        CitiesGraphQLModule,
        // Data modules
        MasterDataGraphQLModule,
        ProfilesGraphQLModule,
        UserProfilePreferencesGraphQLModule,
        // Subscription & Payment modules
        SubscriptionPlansGraphQLModule,
        UserSubscriptionsGraphQLModule,
        PaymentsGraphQLModule,
        PromoCodesGraphQLModule,
        UserVouchersGraphQLModule,
        // Support modules
        SupportTicketsGraphQLModule,
        SupportMessagesGraphQLModule,
        ProfileReportsGraphQLModule,
    ],
    providers: [
        GraphQLErrorLogger,
        {
            provide: APP_FILTER,
            useClass: GraphQLExceptionFilter,
        },
    ],
})
export class AppGraphQLModule { }
