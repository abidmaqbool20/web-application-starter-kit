import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Files1767445322927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'files',
                columns: [
                    { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },

                    { name: 'owner_type', type: 'varchar' }, // user_profile, support_ticket, report
                    { name: 'owner_id', type: 'bigint' },

                    { name: 'file_category', type: 'varchar' }, // profile_image, report_attachment, support_attachment
                    { name: 'file_path', type: 'varchar' },
                    { name: 'mime_type', type: 'varchar' },
                    { name: 'file_size', type: 'bigint' },

                    { name: 'is_primary', type: 'boolean', default: false },
                    { name: 'is_approved', type: 'boolean', default: true },

                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
                indices: [
                    { columnNames: ['owner_type', 'owner_id'] },
                    { columnNames: ['file_category'] },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('files');
    }

}
