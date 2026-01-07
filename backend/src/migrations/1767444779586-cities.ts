import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Cities1767444779586 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cities',
                columns: [
                    { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'country_id', type: 'bigint' },
                    { name: 'state_id', type: 'bigint' },
                    { name: 'name', type: 'varchar' },
                    { name: 'is_active', type: 'boolean', default: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
                foreignKeys: [
                    {
                        columnNames: ['country_id'],
                        referencedTableName: 'countries',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['state_id'],
                        referencedTableName: 'states',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cities');
    }

}
