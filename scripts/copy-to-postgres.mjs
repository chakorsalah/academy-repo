// Copies the local SQLite content (data/academie.db) and media/ files to the hosted stack.
// Usage: TARGET_DATABASE_URL=postgres://… [BLOB_READ_WRITE_TOKEN=…] node scripts/copy-to-postgres.mjs [--replace]
// Run `DATABASE_URL=$TARGET_DATABASE_URL npm run cms:migrate` first so the Postgres schema exists.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@libsql/client';
import pg from 'pg';

const target = process.env.TARGET_DATABASE_URL;
if (!target?.startsWith('postgres')) throw new Error('Set TARGET_DATABASE_URL to the Postgres connection string');
const replace = process.argv.includes('--replace');
const sqlite = createClient({ url: process.env.SOURCE_DATABASE_URL || 'file:./data/academie.db' });
const db = new pg.Client({ connectionString: target });
await db.connect();

const q = (name) => `"${name}"`;
const tables = (await sqlite.execute("select name from sqlite_master where type='table' and name not like 'sqlite_%' and name not like '__drizzle%' and name <> 'payload_migrations'"))
  .rows.map(r => String(r.name));

// Parents before children, so foreign keys are satisfied while inserting.
const fks = (await db.query(`select tc.table_name child, ccu.table_name parent from information_schema.table_constraints tc
  join information_schema.constraint_column_usage ccu on ccu.constraint_name = tc.constraint_name
  where tc.constraint_type = 'FOREIGN KEY' and tc.table_schema = 'public'`)).rows;
const order = [], seen = new Set();
const visit = (t, stack = new Set()) => {
  if (seen.has(t) || stack.has(t)) return;
  stack.add(t);
  for (const { parent } of fks.filter(f => f.child === t && f.parent !== t)) visit(parent, stack);
  seen.add(t); order.push(t);
};
tables.forEach(t => visit(t));

let existing = 0;
for (const t of order) existing += (await db.query(`select count(*)::int n from ${q(t)}`)).rows[0].n;
if (existing && !replace) throw new Error(`Target already has ${existing} rows. Re-run with --replace to overwrite it.`);

await db.query('begin');
try {
  if (replace) await db.query(`truncate ${order.map(q).join(', ')} restart identity cascade`);
  for (const table of order) {
    const types = Object.fromEntries((await db.query('select column_name, data_type from information_schema.columns where table_schema = $1 and table_name = $2', ['public', table]))
      .rows.map(r => [r.column_name, r.data_type]));
    const { rows, columns } = await sqlite.execute(`select * from ${q(table)}`);
    for (const row of rows) {
      const values = columns.map(c => {
        const v = row[c];
        if (v === null || v === undefined) return null;
        if (types[c] === 'boolean') return Boolean(Number(v));
        if (typeof v === 'bigint') return Number(v);
        return v;
      });
      await db.query(`insert into ${q(table)} (${columns.map(q).join(', ')}) values (${columns.map((_, i) => `$${i + 1}`).join(', ')})`, values);
    }
    // Keep serial ids in step so new documents don't collide with copied ones.
    if (types.id === 'integer' && rows.length) await db.query(`select setval(pg_get_serial_sequence($1, 'id'), (select max(id) from ${q(table)}))`, [table]);
    console.log(`${table}: ${rows.length}`);
  }
  await db.query('commit');
} catch (error) {
  await db.query('rollback');
  throw error;
} finally {
  await db.end();
}

if (process.env.BLOB_READ_WRITE_TOKEN) {
  const { put } = await import('@vercel/blob');
  const dir = process.env.MEDIA_DIR || 'media';
  for (const file of await readdir(dir)) {
    await put(file, await readFile(path.join(dir, file)), { access: 'public', addRandomSuffix: false, allowOverwrite: true, token: process.env.BLOB_READ_WRITE_TOKEN });
    console.log(`media uploaded: ${file}`);
  }
} else console.log('BLOB_READ_WRITE_TOKEN not set: media files were not uploaded.');
