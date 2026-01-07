import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { RolesRepository } from './roles.repository';
import { LoggerModule } from '../global/logger/logger.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    LoggerModule,
    PermissionsModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    RolesService,
    RolesRepository,
    AppPermissionsGuard,
  ],
  exports: [RolesService, RolesRepository],
})
export class RolesModule { }
