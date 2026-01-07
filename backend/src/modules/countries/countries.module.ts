import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesRepository } from './countries.repository';
import { Country } from './entities/country.entity';
import { AuthModule } from '../auth/auth.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), AuthModule],
  providers: [CountriesService, CountriesRepository, AppPermissionsGuard],
  exports: [CountriesService, CountriesRepository],
})
export class CountriesModule { }
