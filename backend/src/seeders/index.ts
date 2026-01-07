import { seed as RoleSeeder } from './role.seeder'
import { seed as PermissionSeeder } from './permission.seeder'
import { seed as UserSeeder } from './user.seeder'
import { seed as MasterDataSeeder } from './master-data.seeder'

async function runSeeder() {
    //execute the seeders in hierarchy
    await PermissionSeeder();
    await RoleSeeder();
    await UserSeeder();
    await MasterDataSeeder();
}

runSeeder().catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
});