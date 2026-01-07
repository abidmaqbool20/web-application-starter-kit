import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPermissionKeyParent1767538735060 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add 'key' as nullable
        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'key',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: false,
        }));
        // 2. Backfill 'key' with 'name' values
        await queryRunner.query('UPDATE permissions SET key = name');
        // 3. Alter 'key' to NOT NULL and UNIQUE
        await queryRunner.changeColumn('permissions', 'key', new TableColumn({
            name: 'key',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
        }));
        // 4. Add 'parent_id' (nullable)
        await queryRunner.addColumn('permissions', new TableColumn({
            name: 'parent_id',
            type: 'bigint',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('permissions', 'key');
        await queryRunner.dropColumn('permissions', 'parent_id');
    }
}
