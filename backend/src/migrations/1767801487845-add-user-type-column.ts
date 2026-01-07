import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTypeColumn1767801487845 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum type for user_type
        await queryRunner.query(`
            CREATE TYPE "user_type_enum" AS ENUM ('system', 'client')
        `);

        // Add user_type column with default value 'client'
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "user_type" "user_type_enum" NOT NULL DEFAULT 'client'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove user_type column
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "user_type"
        `);

        // Drop enum type
        await queryRunner.query(`
            DROP TYPE "user_type_enum"
        `);
    }

}
