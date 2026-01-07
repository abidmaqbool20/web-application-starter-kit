import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Options1767444877160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'master_data',
                columns: [
                    { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'category', type: 'varchar' }, // education, profession, religion, etc
                    { name: 'value', type: 'varchar' },
                    { name: 'is_active', type: 'boolean', default: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
                indices: [
                    {
                        columnNames: ['category', 'value'],
                        isUnique: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('master_data');
    }

}
