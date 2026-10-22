import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`books\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`author\` text DEFAULT 'Salah Chakor',
  	\`summary\` text,
  	\`cover_id\` integer,
  	\`legacy_cover\` text,
  	\`file_id\` integer,
  	\`external_url\` text,
  	\`language\` text DEFAULT 'fr',
  	\`year\` numeric,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`books_cover_idx\` ON \`books\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`books_file_idx\` ON \`books\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`books_updated_at_idx\` ON \`books\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`books_created_at_idx\` ON \`books\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`books__status_idx\` ON \`books\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_books_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_author\` text DEFAULT 'Salah Chakor',
  	\`version_summary\` text,
  	\`version_cover_id\` integer,
  	\`version_legacy_cover\` text,
  	\`version_file_id\` integer,
  	\`version_external_url\` text,
  	\`version_language\` text DEFAULT 'fr',
  	\`version_year\` numeric,
  	\`version_order\` numeric DEFAULT 100,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`books\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_books_v_parent_idx\` ON \`_books_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_version_version_cover_idx\` ON \`_books_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_version_version_file_idx\` ON \`_books_v\` (\`version_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_version_version_updated_at_idx\` ON \`_books_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_version_version_created_at_idx\` ON \`_books_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_version_version__status_idx\` ON \`_books_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_created_at_idx\` ON \`_books_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_updated_at_idx\` ON \`_books_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_books_v_latest_idx\` ON \`_books_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`books_id\` integer REFERENCES books(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_books_id_idx\` ON \`payload_locked_documents_rels\` (\`books_id\`);`)
  await db.run(sql`ALTER TABLE \`cms_state\` ADD \`library_imported\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`books\`;`)
  await db.run(sql`DROP TABLE \`_books_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`articles_id\` integer,
  	\`reports_id\` integer,
  	\`pages_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reports_id\`) REFERENCES \`reports\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "articles_id", "reports_id", "pages_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "articles_id", "reports_id", "pages_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reports_id_idx\` ON \`payload_locked_documents_rels\` (\`reports_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`cms_state\` DROP COLUMN \`library_imported\`;`)
}
