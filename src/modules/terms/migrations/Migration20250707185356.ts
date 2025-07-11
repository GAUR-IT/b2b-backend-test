import { Migration } from '@mikro-orm/migrations';

export class Migration20250707185356 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "payment_term" ("id" text not null, "term" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "payment_term_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_payment_term_deleted_at" ON "payment_term" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "payment_term" cascade;`);
  }

}
