import path from 'node:path';
import type { Payload } from 'payload';
import { images } from '../lib/content';
import { textDocument } from './seed';

// Books listed on magazinemarocaindegastronomie.com/livres.html; every source card pointed to the same Drive folder.
const driveFolder = 'https://drive.google.com/drive/folders/1Ev5VNzvQHqXJFRbBu50krjsOR65wdxV0';
const legacyBooks: { title: string; author: string; cover: string; language: 'fr' | 'ar' | 'en'; year?: number }[] = [
  { title: 'Science appliquée à l’alimentation et à l’hygiène', author: 'Salah Chakor', cover: 'IMG-20250313-WA0002.jpg', language: 'fr', year: 1999 },
  { title: 'Cursus de formation hôtelière et touristique — Guide de présentation', author: 'Salah Chakor', cover: 'IMG-20250313-WA0003.jpg', language: 'fr' },
  { title: 'Guide de déontologie professionnelle hôtelière', author: 'Salah Chakor', cover: 'IMG-20250313-WA0004.jpg', language: 'fr' },
  { title: 'Cours de cuisine pratique — Étude des recettes, bons d’économat', author: 'Salah Chakor', cover: 'IMG-20250313-WA0005.jpg', language: 'fr' },
  { title: 'علم التغذية الصحية والنظافة', author: 'صالح شكور', cover: 'IMG-20250313-WA0006.jpg', language: 'ar', year: 2001 },
  { title: 'A Study on Moroccan Gastronomy', author: 'Dr. Salah Chakor', cover: 'Capture-1.jpg', language: 'en' },
  { title: 'جوانب من عوائد المغاربة وتقاليدهم من خلال المدخل لابن الحاج', author: 'عبد الهادي البياض', cover: 'Capture-2.jpg', language: 'ar', year: 2016 },
  { title: 'أثر العرب في الحضارة الأوروبية', author: 'عباس محمود العقاد', cover: 'Capture-3.jpg', language: 'ar' },
  { title: 'التوابل: التاريخ الكوني', author: 'فريد تشارا', cover: 'Capture-4.jpg', language: 'ar' },
  { title: 'الشفاء في الغذاء في طب النبي والأئمة', author: 'حسين نجيب محمد', cover: 'Capture-6.jpg', language: 'ar' },
];
const booksFeed = { kind: 'feed', feed: 'books', enabled: true, limit: 100 };

export async function seedLibrary(payload: Payload) {
  const state = await payload.findGlobal({ slug: 'cms-state' });
  if (state.libraryImported) return;
  if (!(await payload.count({ collection: 'books' })).totalDocs) {
    const charter = await payload.create({ collection: 'media', data: { alt: 'Charte de la revue scientifique — Magazine Marocain de la Gastronomie' },
      filePath: path.resolve(process.cwd(), 'content/library/charte-revue-mmg.pdf') });
    await payload.create({ collection: 'books', data: { title: 'Charte de la revue scientifique — Magazine Marocain de la Gastronomie',
      author: 'Fondation Académie Marocaine de la Gastronomie', summary: 'Mission, objectifs et domaines de publication de la revue scientifique MMG.',
      file: charter.id, language: 'fr', order: 0, _status: 'published' } });
    for (const [i, book] of legacyBooks.entries()) await payload.create({ collection: 'books', data: {
      title: book.title, author: book.author, legacyCover: `/assets/source/${book.cover}`, externalUrl: driveFolder,
      language: book.language, year: book.year, order: (i + 1) * 10, _status: 'published' } });
  }
  if (!(await payload.count({ collection: 'pages', where: { originalPath: { equals: '/bibliotheque' } } })).totalDocs)
    await payload.create({ collection: 'pages', data: { title: 'Bibliothèque', slug: 'bibliotheque', originalPath: '/bibliotheque', pageKind: 'interior',
      kicker: 'Livres & publications', summary: 'Ouvrages, guides et documents de l’Académie et du Magazine, à consulter et télécharger en PDF.',
      legacyImage: images.publication, showInNavigation: false, content: textDocument([]),
      sections: [{ ...booksFeed, title: 'Livres à télécharger' }] as never, _status: 'published' } });
  // The magazine page showed the book covers as a plain gallery; point it at the library instead.
  const magazine = (await payload.find({ collection: 'pages', where: { originalPath: { equals: '/magazine' } }, limit: 1 })).docs[0];
  const sections = magazine?.sections || [];
  if (magazine && sections.some(s => s.kind === 'gallery' && s.title === 'Livres et publications'))
    await payload.update({ collection: 'pages', id: magazine.id, data: { _status: 'published', sections: sections.map(s => s.kind === 'gallery' && s.title === 'Livres et publications'
      ? { ...booksFeed, kicker: 'Bibliothèque', title: 'Livres et publications', limit: 4, buttonLabel: 'Toute la bibliothèque', buttonHref: '/bibliotheque' } : s) as never } });
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  const link = { label: 'Bibliothèque', href: '/bibliotheque' };
  if (settings.brandName && !settings.navigation?.some(n => n.href === link.href)) {
    const navigation = [...(settings.navigation || [])];
    const at = navigation.findIndex(n => n.href === '/rapports');
    navigation.splice(at < 0 ? navigation.length : at + 1, 0, link);
    const footerColumns = settings.footerColumns?.map(c => c.title === 'Explorer' && !c.links?.some(l => l.href === link.href) ? { ...c, links: [...(c.links || []), link] } : c);
    await payload.updateGlobal({ slug: 'site-settings', data: { navigation, footerColumns, _status: 'published' } });
  }
  await payload.updateGlobal({ slug: 'cms-state', data: { libraryImported: true } });
}
