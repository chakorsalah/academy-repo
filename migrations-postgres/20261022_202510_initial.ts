import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('Gastronomie', 'Histoire & authenticité', 'Anthropologie', 'Cuisine traditionnelle', 'Alimentation', 'Tourisme', 'Épices');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('Gastronomie', 'Histoire & authenticité', 'Anthropologie', 'Cuisine traditionnelle', 'Alimentation', 'Tourisme', 'Épices');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_books_language" AS ENUM('fr', 'ar', 'en');
  CREATE TYPE "public"."enum_books_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__books_v_version_language" AS ENUM('fr', 'ar', 'en');
  CREATE TYPE "public"."enum__books_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_sections_kind" AS ENUM('text', 'split', 'cards', 'gallery', 'feed', 'callout', 'partners', 'contact');
  CREATE TYPE "public"."enum_pages_sections_feed" AS ENUM('articles', 'reports', 'books');
  CREATE TYPE "public"."enum_pages_page_kind" AS ENUM('interior', 'home');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_sections_kind" AS ENUM('text', 'split', 'cards', 'gallery', 'feed', 'callout', 'partners', 'contact');
  CREATE TYPE "public"."enum__pages_v_version_sections_feed" AS ENUM('articles', 'reports', 'books');
  CREATE TYPE "public"."enum__pages_v_version_page_kind" AS ENUM('interior', 'home');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"legacy_image" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"category" "enum_articles_category" DEFAULT 'Gastronomie',
  	"author" varchar DEFAULT 'Salah Chakor',
  	"source_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_legacy_image" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_category" "enum__articles_v_version_category" DEFAULT 'Gastronomie',
  	"version_author" varchar DEFAULT 'Salah Chakor',
  	"version_source_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"legacy_image" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"document_id" integer,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reports_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_legacy_image" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_document_id" integer,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reports_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "books" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"author" varchar DEFAULT 'Salah Chakor',
  	"summary" varchar,
  	"cover_id" integer,
  	"legacy_cover" varchar,
  	"file_id" integer,
  	"external_url" varchar,
  	"language" "enum_books_language" DEFAULT 'fr',
  	"year" numeric,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_books_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_books_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_author" varchar DEFAULT 'Salah Chakor',
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_legacy_cover" varchar,
  	"version_file_id" integer,
  	"version_external_url" varchar,
  	"version_language" "enum__books_v_version_language" DEFAULT 'fr',
  	"version_year" numeric,
  	"version_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__books_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pages_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"label" varchar,
  	"image_id" integer,
  	"legacy_image" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_pages_sections_kind" DEFAULT 'text',
  	"enabled" boolean DEFAULT true,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"legacy_image" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"feed" "enum_pages_sections_feed" DEFAULT 'articles',
  	"category" varchar,
  	"limit" numeric DEFAULT 6
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"legacy_image" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"page_kind" "enum_pages_page_kind" DEFAULT 'interior',
  	"kicker" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"edition" varchar,
  	"show_in_navigation" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"original_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_version_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"label" varchar,
  	"image_id" integer,
  	"legacy_image" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__pages_v_version_sections_kind" DEFAULT 'text',
  	"enabled" boolean DEFAULT true,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"legacy_image" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"feed" "enum__pages_v_version_sections_feed" DEFAULT 'articles',
  	"category" varchar,
  	"limit" numeric DEFAULT 6,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_legacy_image" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_page_kind" "enum__pages_v_version_page_kind" DEFAULT 'interior',
  	"version_kicker" varchar,
  	"version_button_label" varchar,
  	"version_button_href" varchar,
  	"version_secondary_label" varchar,
  	"version_secondary_href" varchar,
  	"version_edition" varchar,
  	"version_show_in_navigation" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_original_path" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"articles_id" integer,
  	"reports_id" integer,
  	"books_id" integer,
  	"pages_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar,
  	"tagline" varchar,
  	"logo_id" integer,
  	"footer_text" varchar,
  	"copyright" varchar,
  	"city" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"hours" varchar,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brand_name" varchar,
  	"version_tagline" varchar,
  	"version_logo_id" integer,
  	"version_footer_text" varchar,
  	"version_copyright" varchar,
  	"version_city" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_hours" varchar,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "cms_state" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"imported" boolean DEFAULT false,
  	"site_imported" boolean DEFAULT false,
  	"library_imported" boolean DEFAULT false,
  	"extras_imported" boolean DEFAULT false,
  	"menu_organized" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_parent_id_books_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_sections_items" ADD CONSTRAINT "pages_sections_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_sections_items" ADD CONSTRAINT "pages_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_items" ADD CONSTRAINT "_pages_v_version_sections_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_items" ADD CONSTRAINT "_pages_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation_items" ADD CONSTRAINT "site_settings_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns_links" ADD CONSTRAINT "site_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns" ADD CONSTRAINT "site_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_navigation_items" ADD CONSTRAINT "_site_settings_v_version_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_navigation" ADD CONSTRAINT "_site_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_columns_links" ADD CONSTRAINT "_site_settings_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_columns" ADD CONSTRAINT "_site_settings_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_socials" ADD CONSTRAINT "_site_settings_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "reports_cover_idx" ON "reports" USING btree ("cover_id");
  CREATE UNIQUE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
  CREATE INDEX "reports_document_idx" ON "reports" USING btree ("document_id");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE INDEX "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_cover_idx" ON "_reports_v" USING btree ("version_cover_id");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  CREATE INDEX "_reports_v_version_version_document_idx" ON "_reports_v" USING btree ("version_document_id");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE INDEX "books_cover_idx" ON "books" USING btree ("cover_id");
  CREATE INDEX "books_file_idx" ON "books" USING btree ("file_id");
  CREATE INDEX "books_updated_at_idx" ON "books" USING btree ("updated_at");
  CREATE INDEX "books_created_at_idx" ON "books" USING btree ("created_at");
  CREATE INDEX "books__status_idx" ON "books" USING btree ("_status");
  CREATE INDEX "_books_v_parent_idx" ON "_books_v" USING btree ("parent_id");
  CREATE INDEX "_books_v_version_version_cover_idx" ON "_books_v" USING btree ("version_cover_id");
  CREATE INDEX "_books_v_version_version_file_idx" ON "_books_v" USING btree ("version_file_id");
  CREATE INDEX "_books_v_version_version_updated_at_idx" ON "_books_v" USING btree ("version_updated_at");
  CREATE INDEX "_books_v_version_version_created_at_idx" ON "_books_v" USING btree ("version_created_at");
  CREATE INDEX "_books_v_version_version__status_idx" ON "_books_v" USING btree ("version__status");
  CREATE INDEX "_books_v_created_at_idx" ON "_books_v" USING btree ("created_at");
  CREATE INDEX "_books_v_updated_at_idx" ON "_books_v" USING btree ("updated_at");
  CREATE INDEX "_books_v_latest_idx" ON "_books_v" USING btree ("latest");
  CREATE INDEX "pages_sections_items_order_idx" ON "pages_sections_items" USING btree ("_order");
  CREATE INDEX "pages_sections_items_parent_id_idx" ON "pages_sections_items" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_items_image_idx" ON "pages_sections_items" USING btree ("image_id");
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_image_idx" ON "pages_sections" USING btree ("image_id");
  CREATE INDEX "pages_cover_idx" ON "pages" USING btree ("cover_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_sections_items_order_idx" ON "_pages_v_version_sections_items" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_items_parent_id_idx" ON "_pages_v_version_sections_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_items_image_idx" ON "_pages_v_version_sections_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_sections_order_idx" ON "_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_parent_id_idx" ON "_pages_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_image_idx" ON "_pages_v_version_sections" USING btree ("image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_cover_idx" ON "_pages_v" USING btree ("version_cover_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_books_id_idx" ON "payload_locked_documents_rels" USING btree ("books_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_navigation_items_order_idx" ON "site_settings_navigation_items" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_items_parent_id_idx" ON "site_settings_navigation_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_columns_links_order_idx" ON "site_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_links_parent_id_idx" ON "site_settings_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_columns_order_idx" ON "site_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_parent_id_idx" ON "site_settings_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_navigation_items_order_idx" ON "_site_settings_v_version_navigation_items" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_items_parent_id_idx" ON "_site_settings_v_version_navigation_items" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_navigation_order_idx" ON "_site_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_parent_id_idx" ON "_site_settings_v_version_navigation" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_columns_links_order_idx" ON "_site_settings_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_columns_links_parent_id_idx" ON "_site_settings_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_columns_order_idx" ON "_site_settings_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_columns_parent_id_idx" ON "_site_settings_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_socials_order_idx" ON "_site_settings_v_version_socials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_socials_parent_id_idx" ON "_site_settings_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "books" CASCADE;
  DROP TABLE "_books_v" CASCADE;
  DROP TABLE "pages_sections_items" CASCADE;
  DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_version_sections_items" CASCADE;
  DROP TABLE "_pages_v_version_sections" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_navigation_items" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings_footer_columns_links" CASCADE;
  DROP TABLE "site_settings_footer_columns" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_navigation_items" CASCADE;
  DROP TABLE "_site_settings_v_version_navigation" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_columns" CASCADE;
  DROP TABLE "_site_settings_v_version_socials" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "cms_state" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum_books_language";
  DROP TYPE "public"."enum_books_status";
  DROP TYPE "public"."enum__books_v_version_language";
  DROP TYPE "public"."enum__books_v_version_status";
  DROP TYPE "public"."enum_pages_sections_kind";
  DROP TYPE "public"."enum_pages_sections_feed";
  DROP TYPE "public"."enum_pages_page_kind";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_sections_kind";
  DROP TYPE "public"."enum__pages_v_version_sections_feed";
  DROP TYPE "public"."enum__pages_v_version_page_kind";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";`)
}
