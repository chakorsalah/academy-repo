# Deploying to Vercel

Locally the site keeps using `data/academie.db` (SQLite) and the `media/` folder. On Vercel it uses Postgres (Neon) and Vercel Blob, picked automatically from the environment variables.

## 1. Accounts

- GitHub: push this `site/` folder to a **private** repository. `.env`, `data/` and `media/` are git-ignored and never leave your computer.
- Vercel: sign up with GitHub and import the repository (framework: Next.js, root directory: the repo root).
- In the Vercel project → Storage: create a **Neon Postgres** database and a **Blob** store, and connect both to the project. Vercel then adds `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` itself.

## 2. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string (host contains `-pooler`), added by the Neon integration |
| `BLOB_READ_WRITE_TOKEN` | added by the Blob integration |
| `PAYLOAD_SECRET` | a new random value: `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-domain.ma` (or the `*.vercel.app` URL until the domain is connected) |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | optional, for the editorial assistant |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | optional, for password-reset emails |

Vercel runs `npm run vercel-build`, which applies the Postgres migrations (`migrations-postgres/`) and then builds the site. The build stops with an error if `DATABASE_URL` is not Postgres.

## 3. Copy the current content (once, before the site goes public)

From this folder on your computer, with the Neon connection string and Blob token from Vercel:

```bash
DATABASE_URL="postgresql://…" npm run cms:migrate
TARGET_DATABASE_URL="postgresql://…" BLOB_READ_WRITE_TOKEN="vercel_blob_rw_…" npm run cms:copy-to-postgres
```

This copies every article, page, book, setting, version and admin account, and uploads the files in `media/`. It refuses to run on a database that already has content; add `-- --replace` to overwrite it. Then redeploy on Vercel.

## 4. Domain

Vercel → Settings → Domains: add `your-domain.ma`, then create the DNS records Vercel shows in the heberfacile DNS zone. Email hosted at heberfacile keeps working (leave the MX records as they are).

## Schema changes later

After changing collections or fields, create the migration for both databases:

```bash
npm run cms:migration:create -- name
DATABASE_URL="postgresql://…local test db…" npm run cms:migration:create -- name
```
