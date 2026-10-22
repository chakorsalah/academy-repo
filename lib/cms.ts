import 'server-only';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Article as CMSArticle, Report, Book, Page, Media } from '@/payload-types';
import { images, type Article } from './content';

export const cms = cache(async () => getPayload({ config }));
export function mediaURL(media: number | Media | null | undefined) {
  return media && typeof media === 'object' ? media.url || undefined : undefined;
}
export function articleView(doc: CMSArticle): Article {
  return { path: `/gastronomie-marocaine/${doc.slug}`, sourceUrl: doc.sourceUrl || '', title: doc.title,
    category: 'Gastronomie Marocaine', magazineCategory: doc.category, author: doc.author || undefined,
    date: doc.publishedAt || undefined, hero: mediaURL(doc.cover) || doc.legacyImage || images.hero,
    summary: doc.summary, seoTitle: doc.seoTitle||undefined, seoDescription: doc.seoDescription||undefined, lines: [], body: doc.content };
}
export function pagePath(doc: Page) { return doc.originalPath || `/pages/${doc.slug}`; }
export const publishedArticles = cache(async () => {
  const payload = await cms();
  const result = await payload.find({ collection: 'articles', overrideAccess: false, draft: false, where: { _status: { equals: 'published' } }, depth: 1, limit: 1000, sort: '-publishedAt' });
  return result.docs.map(articleView);
});
export const publishedReports = cache(async (): Promise<Report[]> => {
  const payload = await cms();
  return (await payload.find({ collection: 'reports', overrideAccess: false, draft: false, where: { _status: { equals: 'published' } }, depth: 1, limit: 1000, sort: '-publishedAt' })).docs;
});
export const publishedBooks = cache(async (): Promise<Book[]> => {
  const payload = await cms();
  return (await payload.find({ collection: 'books', overrideAccess: false, draft: false, where: { _status: { equals: 'published' } }, depth: 1, limit: 1000, sort: 'order' })).docs;
});
export const publishedPages = cache(async (): Promise<Page[]> => {
  const payload = await cms();
  return (await payload.find({ collection: 'pages', overrideAccess: false, draft: false, where: { _status: { equals: 'published' } }, depth: 1, limit: 1000 })).docs;
});

export const publishedSettings = cache(async () => (await cms()).findGlobal({ slug: 'site-settings', depth: 1, draft: false, overrideAccess: false }));
export const publishedPageAt = cache(async (path: string) => (await publishedPages()).find(doc => pagePath(doc) === path));
