import { Module } from '@nestjs/common';
import { RolesResolver } from './roles.resolver';
import { RolesModule } from '../../../modules/roles/roles.module';

@Module({
    imports: [RolesModule],
    providers: [RolesResolver],
})
export class RolesGraphQLModule { }
