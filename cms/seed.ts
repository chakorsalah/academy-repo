import type { Payload } from 'payload';
import { seedSite } from './seed-site';
import { seedLibrary } from './seed-library';
import { seedExtras } from './seed-extras';
import { seedMenu } from './seed-menu';
import { articles, pages, getSource } from '../lib/content';

export function importedPageLines(page: { sourceUrl?: string; type: string }) {
  const source = page.sourceUrl ? getSource(page.sourceUrl) : null;
  const lines = source?.lines || [];
  if (page.type === 'president') {
    const start = lines.findIndex(line => line.startsWith('Si le peintre'));
    return lines.slice(Math.max(0, start), -2);
  }
  if (page.sourceUrl?.endsWith('qui-sommes-nous')) return lines.slice(10);
  return lines.slice(2);
}
export function textDocument(lines: string[]) {
  return { root: { type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
    children: lines.filter(Boolean).map(text => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr',
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] })) } };
}
export async function seedContent(payload: Payload) {
  // A durable marker prevents deleted/unpublished content from being restored on restart.
  const marker = await payload.findGlobal({ slug: 'cms-state' });
  if (marker.imported) { await seedSite(payload); await seedLibrary(payload); await seedExtras(payload); await seedMenu(payload); return; }
  for (const article of articles) {
    const slug = article.path.split('/').pop()!;
    const exists = await payload.find({ collection: 'articles', where: { slug: { equals: slug } }, limit: 1 });
    if (exists.totalDocs) continue;
    await payload.create({ collection: 'articles', data: {
      title: article.title, slug, summary: article.summary, content: textDocument(article.lines),
      category: article.magazineCategory as 'Tourisme', author: article.author, legacyImage: article.hero,
      sourceUrl: article.sourceUrl, _status: 'published',
    } });
  }
  for (const page of pages.filter(p => p.type === 'source' || p.type === 'president' && p.path === '/academie/president')) {
    const slug = page.path.split('/').pop()!;
    const exists = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 });
    if (exists.totalDocs) continue;
    await payload.create({ collection: 'pages', data: {
      title: page.title, slug, summary: page.description, content: textDocument(importedPageLines(page)),
      originalPath: page.path, legacyImage: page.image, _status: 'published',
    } });
  }
  await payload.updateGlobal({ slug: 'cms-state', data: { imported: true } });
  await seedSite(payload);
  await seedLibrary(payload);
  await seedExtras(payload);
  await seedMenu(payload);
}
