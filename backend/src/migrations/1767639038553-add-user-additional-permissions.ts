import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddUserAdditionalPermissions1767639038553 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user_additional_permissions junction table
        await queryRunner.createTable(
            new Table({
                name: "user_additional_permissions",
                columns: [
                    {
                        name: "user_id",
                        type: "bigint",
                        isPrimary: true,
                    },
                    {
                        name: "permission_id",
                        type: "bigint",
                        isPrimary: true,
                    },
                ],
            }),
            true
        );

        // Add foreign key to users table
        await queryRunner.createForeignKey(
            "user_additional_permissions",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            })
        );

        // Add foreign key to permissions table
        await queryRunner.createForeignKey(
            "user_additional_permissions",
            new TableForeignKey({
                columnNames: ["permission_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "permissions",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the table (foreign keys will be dropped automatically)
        await queryRunner.dropTable("user_additional_permissions");
    }

}
