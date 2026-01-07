import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePolymorphicStatusesTable1767668138508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create polymorphic statuses table
        await queryRunner.createTable(
            new Table({
                name: 'statuses',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'statusable_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'The model type (e.g., User, Order, etc.)',
                    },
                    {
                        name: 'statusable_id',
                        type: 'bigint',
                        isNullable: false,
                        comment: 'The ID of the related model',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'The status value',
                    },
                    {
                        name: 'note',
                        type: 'text',
                        isNullable: true,
                        comment: 'Optional note about the status change',
                    },
                    {
                        name: 'changed_by',
                        type: 'bigint',
                        isNullable: true,
                        comment: 'ID of user who changed the status',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
                indices: [
                    {
                        name: 'IDX_STATUSABLE',
                        columnNames: ['statusable_type', 'statusable_id'],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('statuses');
    }

}
