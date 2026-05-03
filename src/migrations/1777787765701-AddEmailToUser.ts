import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToUser1777787765701 implements MigrationInterface {
  name = 'AddEmailToUser1777787765701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
    await queryRunner.query(
      `CREATE INDEX "idx_todo_category_hight" ON "todo" ("categoryId") WHERE "priority" = 'HIGH'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_todo_category_hight"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
  }
}
