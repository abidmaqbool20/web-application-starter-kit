// users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { LoggerModule } from '../global/logger/logger.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { Status } from '../statuses/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Status]),
    LoggerModule,
    forwardRef(() => AuthModule),
    RolesModule,
    PermissionsModule,
  ],
  providers: [
    UsersService,
    UsersRepository,
    AppPermissionsGuard,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }
