import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions, In } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { buildDbConfig } from '../config/db.config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const dataSource = new DataSource(
  buildDbConfig(process.env) as DataSourceOptions,
);

export async function seed() {
  await dataSource.initialize();

  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  /* =====================================================
     PERMISSION KEYS (MATCHES permission seeder EXACTLY)
  ====================================================== */

  const staffPermissionKeys = [
    // Users (read-only)
    'user-view',

    // Roles & permissions (read-only)
    'role-view',
    'permission-view',

    // Master data (read-only)
    'country-view',
    'state-view',
    'city-view',
    'master_data-view',

    // Settings (read-only + change password)
    'settings-view',
    'settings-security',
    'settings-change-password',
  ];

  /* =====================================================
     FETCH PERMISSIONS FROM DATABASE
  ====================================================== */

  const allPermissions = await permissionRepository.find();
  const staffPermissions = await permissionRepository.find({
    where: { key: In(staffPermissionKeys) },
  });

  /* =====================================================
     ADMIN ROLE – FULL ACCESS
  ====================================================== */

  let adminRole = await roleRepository.findOne({
    where: { name: 'admin' },
    relations: ['permissions'],
  });

  if (!adminRole) {
    adminRole = roleRepository.create({ name: 'admin' });
  }

  adminRole.permissions = allPermissions;
  await roleRepository.save(adminRole);

  /* =====================================================
     STAFF ROLE – LIMITED ACCESS
  ====================================================== */

  let staffRole = await roleRepository.findOne({
    where: { name: 'staff' },
    relations: ['permissions'],
  });

  if (!staffRole) {
    staffRole = roleRepository.create({ name: 'staff' });
  }

  staffRole.permissions = staffPermissions;
  await roleRepository.save(staffRole);

  console.log('✅ Roles seeded successfully: admin (full), staff (limited)');

  await dataSource.destroy();
}
