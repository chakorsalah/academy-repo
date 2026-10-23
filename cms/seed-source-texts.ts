import type { Payload } from 'payload';
import type { Page } from '../payload-types';

// Texts from academiegastronomiemaroc.ma that the first import shortened or left out.
// Safe to run on every start: it only fills empty section intros and completes activity
// texts that still match the shortened imported version, so edits made in the admin are kept.

const activityTexts: Record<string, string> = {
  'Nouvel An Amazigh': 'Célébration du Nouvel An Amazigh, une occasion de rendre hommage à la riche culture berbère à travers des traditions festives, des mets typiques et des activités culturelles, marquant le début d’une nouvelle année selon le calendrier Amazigh.',
  'Conférences & Débats': 'Des rencontres et échanges sont organisés autour de thématiques liées à la gastronomie et au patrimoine culinaire marocain. Ces conférences permettent d’approfondir la connaissance et la réflexion sur notre culture gastronomique.',
  'Publications': 'L’Académie édite des ouvrages et guides valorisant la cuisine marocaine et ses traditions. Ces publications contribuent à la documentation et à la transmission des savoirs culinaires marocains.',
  'Formation & Transmission': 'Des ateliers et masterclasses sont proposés pour transmettre les techniques et savoirs de la cuisine marocaine traditionnelle, contribuant ainsi à la préservation de ce patrimoine immatériel.',
};

const partnersIntro = 'L’Académie Marocaine de Gastronomie collabore avec des institutions et organisations prestigieuses pour promouvoir la gastronomie marocaine.';

// path -> list of [section kind, section title or null for "any", intro text]
const intros: Record<string, [string, string | null, string][]> = {
  '/': [
    ['cards', 'Nos activités', 'Découvrez les différentes activités organisées par l’Académie Marocaine de Gastronomie pour promouvoir et valoriser notre patrimoine culinaire.'],
    ['cards', 'Dernières nouvelles de l’Académie', 'Restez informés des dernières actualités et événements de l’Académie Marocaine de Gastronomie.'],
    ['partners', null, partnersIntro],
    ['contact', null, 'Pour toute information complémentaire ou demande de collaboration, n’hésitez pas à nous contacter.'],
  ],
  '/activites': [['cards', 'Nos activités', 'Découvrez les différentes activités organisées par l’Académie Marocaine de Gastronomie.']],
  '/actualites': [['cards', null, 'Restez informés des dernières actualités et événements de l’Académie Marocaine de Gastronomie.']],
  '/galerie': [['gallery', null, 'Découvrez en images les activités et le patrimoine culinaire marocain.']],
  '/contact': [['contact', null, 'Pour toute information complémentaire, demande de collaboration ou question concernant nos activités, n’hésitez pas à nous contacter via le formulaire ci-dessous.']],
  '/academie/partenaires': [['partners', null, partnersIntro]],
};

const plain = (s: string) => s.replace(/[’']/g, "'").replace(/[.\s]+$/, '').trim();
// True when the stored text is the shortened import of the full text (a prefix of it).
const isShortened = (current: string | null | undefined, full: string) =>
  !!current && plain(current) !== plain(full) && plain(full).startsWith(plain(current));

type Sections = NonNullable<Page['sections']>;

function patch(path: string, sections: Sections): { sections: Sections; changed: boolean } {
  let changed = false;
  const next = sections.map(s => {
    let section = s;
    if (s.kind === 'cards' && s.items?.length) {
      const items = s.items.map(item => {
        const full = item.title ? activityTexts[item.title] : undefined;
        if (full && isShortened(item.text, full)) { changed = true; return { ...item, text: full }; }
        return item;
      });
      section = { ...section, items };
    }
    const intro = intros[path]?.find(([kind, title]) => kind === s.kind && (title === null || title === s.title));
    if (intro && !s.text?.trim()) { changed = true; section = { ...section, text: intro[2] }; }
    return section;
  });
  return { sections: next, changed };
}

export async function seedSourceTexts(payload: Payload) {
  const paths = [...new Set(['/', '/activites', ...Object.keys(intros)])];
  for (const path of paths) {
    const page = (await payload.find({ collection: 'pages', where: { originalPath: { equals: path } }, limit: 1, draft: false })).docs[0];
    if (!page?.sections?.length) continue;
    const { sections, changed } = patch(path, page.sections);
    if (changed) await payload.update({ collection: 'pages', id: page.id, data: { _status: 'published', sections: sections as never } });
  }
}
