import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesService } from './cities.service';
import { CitiesRepository } from './cities.repository';
import { City } from './entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { State } from '../states/entities/state.entity';
import { AuthModule } from '../auth/auth.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';

@Module({
    imports: [TypeOrmModule.forFeature([City, Country, State]), AuthModule],
    providers: [CitiesService, CitiesRepository, AppPermissionsGuard],
    exports: [CitiesService, CitiesRepository],
})
export class CitiesModule { } 