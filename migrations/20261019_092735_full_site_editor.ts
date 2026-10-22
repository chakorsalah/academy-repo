import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`label\` text,
  	\`image_id\` integer,
  	\`legacy_image\` text,
  	\`href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_items_order_idx\` ON \`pages_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_items_parent_id_idx\` ON \`pages_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_items_image_idx\` ON \`pages_sections_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text DEFAULT 'text',
  	\`enabled\` integer DEFAULT true,
  	\`kicker\` text,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`legacy_image\` text,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`feed\` text DEFAULT 'articles',
  	\`category\` text,
  	\`limit\` numeric DEFAULT 6,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_order_idx\` ON \`pages_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_parent_id_idx\` ON \`pages_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_image_idx\` ON \`pages_sections\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`label\` text,
  	\`image_id\` integer,
  	\`legacy_image\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_items_order_idx\` ON \`_pages_v_version_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_items_parent_id_idx\` ON \`_pages_v_version_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_items_image_idx\` ON \`_pages_v_version_sections_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text DEFAULT 'text',
  	\`enabled\` integer DEFAULT true,
  	\`kicker\` text,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`legacy_image\` text,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`feed\` text DEFAULT 'articles',
  	\`category\` text,
  	\`limit\` numeric DEFAULT 6,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_order_idx\` ON \`_pages_v_version_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_parent_id_idx\` ON \`_pages_v_version_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_image_idx\` ON \`_pages_v_version_sections\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_navigation_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_items_order_idx\` ON \`site_settings_navigation_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_items_parent_id_idx\` ON \`site_settings_navigation_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_order_idx\` ON \`site_settings_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_parent_id_idx\` ON \`site_settings_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_links_order_idx\` ON \`site_settings_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_links_parent_id_idx\` ON \`site_settings_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_order_idx\` ON \`site_settings_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_footer_columns_parent_id_idx\` ON \`site_settings_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_socials_order_idx\` ON \`site_settings_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_socials_parent_id_idx\` ON \`site_settings_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand_name\` text,
  	\`tagline\` text,
  	\`logo_id\` integer,
  	\`footer_text\` text,
  	\`copyright\` text,
  	\`city\` text,
  	\`phone\` text,
  	\`email\` text,
  	\`hours\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_navigation_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v_version_navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_navigation_items_order_idx\` ON \`_site_settings_v_version_navigation_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_navigation_items_parent_id_idx\` ON \`_site_settings_v_version_navigation_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_navigation_order_idx\` ON \`_site_settings_v_version_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_navigation_parent_id_idx\` ON \`_site_settings_v_version_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_links_order_idx\` ON \`_site_settings_v_version_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_links_parent_id_idx\` ON \`_site_settings_v_version_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_order_idx\` ON \`_site_settings_v_version_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_footer_columns_parent_id_idx\` ON \`_site_settings_v_version_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_socials_order_idx\` ON \`_site_settings_v_version_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_socials_parent_id_idx\` ON \`_site_settings_v_version_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_brand_name\` text,
  	\`version_tagline\` text,
  	\`version_logo_id\` integer,
  	\`version_footer_text\` text,
  	\`version_copyright\` text,
  	\`version_city\` text,
  	\`version_phone\` text,
  	\`version_email\` text,
  	\`version_hours\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version_logo_idx\` ON \`_site_settings_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version_seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version_seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`reports\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`reports\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`_reports_v\` ADD \`version_seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`_reports_v\` ADD \`version_seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`page_kind\` text DEFAULT 'interior';`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`kicker\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`button_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`button_href\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`secondary_label\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`secondary_href\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`edition\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`show_in_navigation\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_page_kind\` text DEFAULT 'interior';`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_kicker\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_button_label\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_button_href\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_secondary_label\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_secondary_href\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_edition\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_show_in_navigation\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`cms_state\` ADD \`site_imported\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_sections_items\`;`)
  await db.run(sql`DROP TABLE \`pages_sections\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections\`;`)
  await db.run(sql`DROP TABLE \`site_settings_navigation_items\`;`)
  await db.run(sql`DROP TABLE \`site_settings_navigation\`;`)
  await db.run(sql`DROP TABLE \`site_settings_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`site_settings_socials\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_navigation_items\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_navigation\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_socials\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`ALTER TABLE \`articles\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`articles\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` DROP COLUMN \`version_seo_title\`;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` DROP COLUMN \`version_seo_description\`;`)
  await db.run(sql`ALTER TABLE \`reports\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`reports\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`_reports_v\` DROP COLUMN \`version_seo_title\`;`)
  await db.run(sql`ALTER TABLE \`_reports_v\` DROP COLUMN \`version_seo_description\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`page_kind\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`kicker\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`button_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`button_href\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`secondary_label\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`secondary_href\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`edition\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`show_in_navigation\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_page_kind\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_kicker\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_button_label\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_button_href\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_secondary_label\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_secondary_href\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_edition\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_show_in_navigation\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_seo_title\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_seo_description\`;`)
  await db.run(sql`ALTER TABLE \`cms_state\` DROP COLUMN \`site_imported\`;`)
}
