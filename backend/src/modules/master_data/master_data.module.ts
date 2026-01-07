import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataService } from './master_data.service';
import { MasterDataRepository } from './master_data.repository';
import { MasterData } from './entities/master_data.entity';
import { AuthModule } from '../auth/auth.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MasterData]), AuthModule],
  providers: [MasterDataService, MasterDataRepository, AppPermissionsGuard],
  exports: [MasterDataService, MasterDataRepository],
})
export class MasterDataModule { }
