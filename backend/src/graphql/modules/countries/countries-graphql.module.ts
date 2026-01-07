import { Module } from '@nestjs/common';
import { CountriesResolver } from './countries.resolver';
import { CountriesModule } from '../../../modules/countries/countries.module';

@Module({
    imports: [CountriesModule],
    providers: [CountriesResolver],
})
export class CountriesGraphQLModule { }
