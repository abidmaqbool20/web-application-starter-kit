import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/global/cache/redis.module';
import { RedisService } from './modules/global/cache/redis.service';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LoggerModule } from './modules/global/logger/logger.module';
import { rateLimiterConfig } from './config/rate-limiter.config';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { GqlRateLimiterGuard } from './config/gql-rate-limiter.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { ResponseService } from './modules/global/response/response.service';
import { HelpersModule } from './modules/global/helper/helpers.module';
import { JobModule } from './modules/global/jobs/job.module';
import { ResponseModule } from './modules/global/response/response.module';
import { MailModule } from './modules/global/mailer/mail.module';
import { NotificationsModule } from './modules/global/notifications/notifications.module';
import { EmailModule } from './modules/global/emails/email.module';
import { BullModule } from '@nestjs/bull';
import { CliModule } from './cli/cli.module';
import { DBModule } from './db/db.module';
import { CountriesModule } from './modules/countries/countries.module';
import { StatesModule } from './modules/states/states.module';
import { CitiesModule } from './modules/cities/cities.module';
import { MasterDataModule } from './modules/master_data/master_data.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UserProfilePreferencesModule } from './modules/user_profile_preferences/user_profile_preferences.module';
import { UserSubscriptionsModule } from './modules/user_subscriptions/user_subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PromoCodesModule } from './modules/promo_codes/promo_codes.module';
import { UserVouchersModule } from './modules/user_vouchers/user_vouchers.module';
import { SupportTicketsModule } from './modules/support_tickets/support_tickets.module';
import { SupportMessagesModule } from './modules/support_messages/support_messages.module';
import { ProfileReportsModule } from './modules/profile_reports/profile_reports.module';
import { AppGraphQLModule } from './graphql/graphql.module';

@Module({
  imports: [
    CliModule,
    DBModule,
    RedisModule,
    RateLimiterModule.register(rateLimiterConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    HelpersModule,
    ResponseModule,
    LoggerModule,
    MailModule,
    NotificationsModule,
    EmailModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    MasterDataModule,
    ProfilesModule,
    UserProfilePreferencesModule,
    UserSubscriptionsModule,
    PaymentsModule,
    PromoCodesModule,
    UserVouchersModule,
    SupportTicketsModule,
    SupportMessagesModule,
    ProfileReportsModule,

    // GraphQL Module
    AppGraphQLModule,

    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: async (redisService: RedisService) => ({
        redis: redisService.redisConnectionOptions,
      }),
    }),

    JobModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlRateLimiterGuard,
    },
    ResponseService,
  ],
})
export class AppModule { }
