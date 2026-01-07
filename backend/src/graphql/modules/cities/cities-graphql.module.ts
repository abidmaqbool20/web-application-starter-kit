import { Module } from '@nestjs/common';
import { CitiesResolver } from './cities.resolver';
import { CitiesModule } from '../../../modules/cities/cities.module';

@Module({
    imports: [CitiesModule],
    providers: [CitiesResolver],
})
export class CitiesGraphQLModule { }
