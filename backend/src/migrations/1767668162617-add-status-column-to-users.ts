import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStatusColumnToUsers1767668162617 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add status column to users table
        await queryRunner.addColumn('users', new TableColumn({
            name: 'status',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "'active'",
            comment: 'Current status of the user (active, inactive, suspended, banned)',
        }));

        // Insert initial status record for all existing users
        await queryRunner.query(`
            INSERT INTO statuses (statusable_type, statusable_id, status, note, created_at)
            SELECT 'User', id, 'active', 'Initial status', CURRENT_TIMESTAMP
            FROM users
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove status records for users
        await queryRunner.query(`DELETE FROM statuses WHERE statusable_type = 'User'`);

        // Drop the status column
        await queryRunner.dropColumn('users', 'status');
    }

}
