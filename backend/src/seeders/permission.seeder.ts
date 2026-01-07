import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { buildDbConfig } from '../config/db.config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const dataSource = new DataSource(buildDbConfig(process.env) as DataSourceOptions);

export async function seed() {
   await dataSource.initialize();
   const repository = dataSource.getRepository(Permission);

   // Define module-level permissions
   const modules = [
      { name: 'Role', key: 'role' },
      { name: 'User', key: 'user' },
      { name: 'Permission', key: 'permission' },
      { name: 'Country', key: 'country' },
      { name: 'State', key: 'state' },
      { name: 'City', key: 'city' },
      { name: 'Master Data', key: 'master_data' },
      { name: 'Settings', key: 'settings' },
      // Add more modules as needed
   ];

   // Upsert module permissions first
   const moduleEntities = modules.map(mod => {
      const obj = new Permission();
      obj.name = mod.name;
      obj.key = mod.key;
      obj.parent_id = null;
      return obj;
   });
   const insertedModules = await repository.upsert(moduleEntities, ['key']);

   // Helper to get parent_id by key
   const getParentId = (key: string) => {
      // Always query the DB for the module permission to get the correct id
      return repository.findOneBy({ key }).then(mod => mod ? mod.id : null);
   };

   // Define granular permissions for each module
   const granularPermissions = [
      // Role permissions
      { name: 'Role Create', key: 'role-create', parent: 'role' },
      { name: 'Role Update', key: 'role-update', parent: 'role' },
      { name: 'Role Delete', key: 'role-delete', parent: 'role' },
      { name: 'Role View', key: 'role-view', parent: 'role' },
      // User permissions
      { name: 'User Create', key: 'user-create', parent: 'user' },
      { name: 'User Update', key: 'user-update', parent: 'user' },
      { name: 'User Delete', key: 'user-delete', parent: 'user' },
      { name: 'User View', key: 'user-view', parent: 'user' },
      // Permission permissions
      { name: 'Permission Create', key: 'permission-create', parent: 'permission' },
      { name: 'Permission Update', key: 'permission-update', parent: 'permission' },
      { name: 'Permission Delete', key: 'permission-delete', parent: 'permission' },
      { name: 'Permission View', key: 'permission-view', parent: 'permission' },
      // Country permissions
      { name: 'Country Create', key: 'country-create', parent: 'country' },
      { name: 'Country Update', key: 'country-update', parent: 'country' },
      { name: 'Country Delete', key: 'country-delete', parent: 'country' },
      { name: 'Country View', key: 'country-view', parent: 'country' },
      // State permissions
      { name: 'State Create', key: 'state-create', parent: 'state' },
      { name: 'State Update', key: 'state-update', parent: 'state' },
      { name: 'State Delete', key: 'state-delete', parent: 'state' },
      { name: 'State View', key: 'state-view', parent: 'state' },
      // City permissions
      { name: 'City Create', key: 'city-create', parent: 'city' },
      { name: 'City Update', key: 'city-update', parent: 'city' },
      { name: 'City Delete', key: 'city-delete', parent: 'city' },
      { name: 'City View', key: 'city-view', parent: 'city' },
      // Master Data permissions
      { name: 'Master Data Create', key: 'master_data-create', parent: 'master_data' },
      { name: 'Master Data Update', key: 'master_data-update', parent: 'master_data' },
      { name: 'Master Data Delete', key: 'master_data-delete', parent: 'master_data' },
      { name: 'Master Data View', key: 'master_data-view', parent: 'master_data' },
      // Settings permissions
      { name: 'Settings View', key: 'settings-view', parent: 'settings' },
      { name: 'Settings Security', key: 'settings-security', parent: 'settings' },
      { name: 'Settings Change Password', key: 'settings-change-password', parent: 'settings' },
      // Add more granular permissions as needed
   ];

   // Resolve parent_ids for granular permissions
   const granularEntities = [];
   for (const perm of granularPermissions) {
      const obj = new Permission();
      obj.name = perm.name;
      obj.key = perm.key;
      // Await parent_id resolution
      // eslint-disable-next-line no-await-in-loop
      obj.parent_id = await getParentId(perm.parent);
      granularEntities.push(obj);
   }

   // Upsert granular permissions
   await repository.upsert(granularEntities, ['key']);

   console.log('✅ Permissions seeded with module and granular structure!');
   await dataSource.destroy();
}
