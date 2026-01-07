import { Module } from '@nestjs/common';
import { PermissionsResolver } from './permissions.resolver';
import { PermissionsModule } from '../../../modules/permissions/permissions.module';

@Module({
    imports: [PermissionsModule],
    providers: [PermissionsResolver],
})
export class PermissionsGraphQLModule { }
