import { Module } from '@nestjs/common';
import { MasterDataResolver } from './master-data.resolver';
import { MasterDataModule } from '../../../modules/master_data/master_data.module';

@Module({
    imports: [MasterDataModule],
    providers: [MasterDataResolver],
})
export class MasterDataGraphQLModule { }
