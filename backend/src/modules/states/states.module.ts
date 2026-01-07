import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatesService } from './states.service';
import { StatesRepository } from './states.repository';
import { State } from './entities/state.entity';
import { Country } from '../countries/entities/country.entity';
import { AuthModule } from '../auth/auth.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([State, Country]), AuthModule],
  providers: [StatesService, StatesRepository, AppPermissionsGuard],
  exports: [StatesService, StatesRepository],
})
export class StatesModule { }
