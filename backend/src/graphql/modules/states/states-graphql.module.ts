import { Module } from '@nestjs/common';
import { StatesResolver } from './states.resolver';
import { StatesModule } from '../../../modules/states/states.module';

@Module({
    imports: [StatesModule],
    providers: [StatesResolver],
})
export class StatesGraphQLModule { }
