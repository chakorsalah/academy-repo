import path from 'node:path';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { fr } from '@payloadcms/translations/languages/fr';
import sharp from 'sharp';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { Users, Media, Articles, Reports, Books, ContentPages } from './cms/collections';
import { seedContent } from './cms/seed';
import { SiteSettings } from './cms/page-builder';

if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET must be configured in .env');
// Local: SQLite file + media/ folder. Vercel: Postgres (DATABASE_URL=postgres://…) + Vercel Blob (BLOB_READ_WRITE_TOKEN).
const databaseURL = process.env.DATABASE_URL || 'file:./data/academie.db';
const usePostgres = /^postgres(ql)?:\/\//.test(databaseURL);
// Vercel's disk is wiped between requests: a SQLite file there would silently lose every edit.
if (process.env.VERCEL && !usePostgres) throw new Error('On Vercel, DATABASE_URL must be a Postgres connection string');
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: 'users', theme: 'light', meta: { titleSuffix: '· Académie — Espace éditorial' },
    importMap: { baseDir: path.resolve(process.cwd()) },
    components: {
      graphics: { Logo: '/components/cms/Brand#Brand', Icon: '/components/cms/Brand#BrandIcon' },
      beforeDashboard: ['/components/cms/Dashboard#Dashboard'],
      beforeLogin: ['/components/cms/Brand#LoginIntro'],
      afterNavLinks: ['/components/cms/Brand#SiteLink'],
      views: { assistant: { Component: '/components/cms/AssistantView#AssistantView', path: '/assistant' } },
    },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Users, Articles, Reports, Books, ContentPages, Media],
  globals: [SiteSettings, { slug: 'cms-state', admin: { hidden: true }, access: { read: () => false, update: () => false },
    fields: [{ name: 'imported', type: 'checkbox', defaultValue: false }, {name:'siteImported',type:'checkbox',defaultValue:false}, {name:'libraryImported',type:'checkbox',defaultValue:false}, {name:'extrasImported',type:'checkbox',defaultValue:false}, {name:'menuOrganized',type:'checkbox',defaultValue:false}] }],
  editor: lexicalEditor(), sharp,
  email: process.env.SMTP_HOST ? nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || 'noreply@example.com', defaultFromName: 'Académie Gastronomie Maroc',
    transportOptions: { host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === '465',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined },
  }) : undefined,
  db: usePostgres
    ? postgresAdapter({ pool: { connectionString: databaseURL }, migrationDir: path.resolve(process.cwd(), 'migrations-postgres') })
    : sqliteAdapter({ transactionOptions: { behavior: 'immediate' }, client: { url: databaseURL } }),
  // alwaysInsertFields keeps the plugin's `prefix` column in the schema locally too, so migrations match Vercel.
  plugins: [vercelBlobStorage({ enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN), token: process.env.BLOB_READ_WRITE_TOKEN, alwaysInsertFields: true,
    collections: { media: true }, clientUploads: true })],
  typescript: { outputFile: path.resolve(process.cwd(), 'payload-types.ts') },
  upload: { limits: { fileSize: 100 * 1024 * 1024 } },
  onInit: seedContent,
});
