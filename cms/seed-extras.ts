import type { Payload } from 'payload';
import { images } from '../lib/content';
import { textDocument } from './seed';
import type { Page } from '../payload-types';

// Content from academiegastronomiemaroc.ma that the first import skipped: the events page, three activities and more gallery photos.
const src = (file: string) => `/assets/source/${file}`;
const upcoming = [
  { title: 'Conférence sur les Épices Marocaines', label: '15 juin 2024 · Palais des Congrès, Marrakech', legacyImage: images.rasElHanout, text: 'Une journée dédiée à la découverte des épices marocaines, leur histoire, leurs utilisations traditionnelles et leurs bienfaits pour la santé.' },
  { title: 'Symposium sur la Cuisine Berbère', label: '22-23 juillet 2024 · Centre Culturel, Agadir', legacyImage: images.amazigh, text: 'Deux jours d’échanges et de démonstrations autour des traditions culinaires berbères, avec la participation de chefs et d’historiens spécialisés.' },
  { title: 'Forum International de la Gastronomie Marocaine', label: '10-12 septembre 2024 · Megarama, Casablanca', legacyImage: images.dining, text: 'Le rendez-vous annuel des professionnels et passionnés de la gastronomie marocaine, avec conférences, ateliers et dégustations.' },
  { title: 'Débat : Tradition et Innovation en Cuisine Marocaine', label: '5 octobre 2024 · Institut Français, Rabat', legacyImage: images.conference, text: 'Une table ronde réunissant chefs traditionnels et innovants pour discuter de l’évolution de la cuisine marocaine contemporaine.' },
  { title: 'Journée d’Étude sur les Pâtisseries Marocaines', label: '18 novembre 2024 · École Hôtelière, Fès', legacyImage: src('WhatsApp-Image-2025-04-27-at-12.34.20.jpeg'), text: 'Une journée consacrée aux pâtisseries traditionnelles marocaines, leur histoire, leurs techniques et leurs variations régionales.' },
  { title: 'Conférence : Les Routes des Épices et la Cuisine Marocaine', label: '8 décembre 2024 · Musée Mohammed VI, Rabat', legacyImage: images.tagines, text: 'Une exploration historique de l’influence des routes commerciales sur le développement de la cuisine marocaine à travers les siècles.' },
];
const past = [
  { title: 'Conférence sur l’Avenir de la Gastronomie Marocaine', label: '18 septembre 2023 · Institut Français, Rabat', text: 'Une journée d’échanges et de débats sur les enjeux et perspectives de la gastronomie marocaine contemporaine.' },
  { title: 'Symposium sur les Traditions Culinaires du Ramadan', label: '15 mars 2023 · Palais des Congrès, Marrakech', text: 'Un événement dédié aux traditions culinaires spécifiques au mois sacré du Ramadan dans les différentes régions du Maroc.' },
  { title: 'Conférence : L’Huile d’Argan dans la Cuisine Marocaine', label: '22 novembre 2022 · Université Mohammed V, Rabat', text: 'Une exploration des utilisations traditionnelles et modernes de l’huile d’argan dans la gastronomie marocaine.' },
  { title: 'Forum sur le Patrimoine Culinaire Marocain', label: '5-7 octobre 2022 · Megarama, Casablanca', text: 'Trois jours de conférences et d’ateliers sur la préservation et la valorisation du patrimoine culinaire marocain.' },
];
const activities = [
  { title: 'Dîners Gastronomiques', legacyImage: src('DinnerMarocaine.png'), text: 'L’Académie organise régulièrement des dîners d’exception mettant en valeur la richesse de la gastronomie marocaine. Ces événements réunissent membres, invités et personnalités autour de menus élaborés par des chefs renommés.' },
  { title: 'Concours Culinaires', legacyImage: images.cooking, text: 'Pour encourager l’excellence et la créativité, l’Académie organise des concours culinaires destinés aux professionnels et aux jeunes talents. Ces compétitions mettent en valeur le savoir-faire et l’innovation dans la cuisine marocaine.' },
  { title: 'Partenariats Internationaux', legacyImage: images.partnership, text: 'L’Académie développe des collaborations avec des institutions internationales pour promouvoir la gastronomie marocaine à l’étranger et favoriser les échanges culturels culinaires.' },
];
// Captions describe each photo; the source site's labels did not match its images.
const gallery = [
  { title: 'Atelier de cuisine aux tajines', label: 'Événements', legacyImage: images.cooking },
  { title: 'Signature d’un partenariat', label: 'Événements', legacyImage: src('C5.jpeg') },
  { title: 'Salades marocaines et mini tajines', label: 'Plats', legacyImage: src('moroccan-feast-2.png') },
  { title: 'Couscous aux sept légumes', label: 'Plats', legacyImage: src('WhatsApp-Image-2025-04-27-at-12.34.21.jpeg') },
  { title: 'Msemen au miel', label: 'Plats', legacyImage: src('WhatsApp-Image-2025-04-27-at-12.34.20.jpeg') },
  { title: 'Tajine aux fruits secs', label: 'Plats', legacyImage: src('WhatsApp-Image-2025-04-27-at-12.34.22.jpeg') },
  { title: 'Céramique marocaine', label: 'Produits', legacyImage: src('WhatsApp-Image-2025-04-27-at-12.34.22-1-.jpeg') },
  { title: 'Table marocaine', label: 'Plats', legacyImage: src('DinnerMarocaine.png') },
  { title: 'Hommage et remise de bouquet', label: 'Personnalités', legacyImage: images.partnership },
];
const eventsPath = '/activites/evenements';
type Item = { title?: string | null };
const missing = <T extends { title: string }>(items: T[], existing: Item[] = []) => items.filter(i => !existing.some(e => e.title === i.title));

export async function seedExtras(payload: Payload) {
  const state = await payload.findGlobal({ slug: 'cms-state' });
  if (state.extrasImported) return;
  if (!(await payload.count({ collection: 'pages', where: { originalPath: { equals: eventsPath } } })).totalDocs)
    await payload.create({ collection: 'pages', data: { title: 'Événements', slug: 'activites-evenements', originalPath: eventsPath, pageKind: 'interior',
      kicker: 'Activités', summary: 'Conférences, débats et rencontres organisés par l’Académie Marocaine de Gastronomie.', legacyImage: images.conference,
      showInNavigation: false, content: textDocument([]), _status: 'published', sections: [
        { kind: 'text', enabled: true, title: 'Nos événements', text: 'L’Académie Marocaine de Gastronomie organise régulièrement des conférences, débats et rencontres autour de la gastronomie marocaine et de son patrimoine culinaire.\n\nCes événements réunissent experts, professionnels et passionnés pour échanger, apprendre et célébrer la richesse de notre culture gastronomique.' },
        { kind: 'cards', enabled: true, kicker: 'Programme', title: 'Rencontres 2024', items: upcoming },
        { kind: 'cards', enabled: true, kicker: 'Archives', title: 'Événements 2022 – 2023', items: past },
        { kind: 'callout', enabled: true, kicker: 'Contact', title: 'Participer à nos événements', text: 'Pour toute information sur nos prochaines rencontres, contactez l’Académie.', legacyImage: images.dining, buttonLabel: 'Nous contacter', buttonHref: '/contact' },
      ] as never } });
  const update = async (path: string, change: (sections: NonNullable<Page['sections']>) => unknown[]) => {
    const page = (await payload.find({ collection: 'pages', where: { originalPath: { equals: path } }, limit: 1 })).docs[0];
    if (page) await payload.update({ collection: 'pages', id: page.id, data: { _status: 'published', sections: change(page.sections || []) as never } });
  };
  await update('/activites', sections => [
    ...sections.map(s => s.kind === 'cards' && s.title === 'Nos activités' ? { ...s, items: [...(s.items || []), ...missing(activities, s.items || [])] } : s),
    ...(sections.some(s => s.buttonHref === eventsPath) ? [] : [{ kind: 'callout', enabled: true, kicker: 'Agenda', title: 'Nos événements',
      text: 'Conférences, débats et rencontres organisés par l’Académie.', legacyImage: images.conference, buttonLabel: 'Voir les événements', buttonHref: eventsPath }]),
  ]);
  await update('/galerie', sections => sections.map(s => s.kind === 'gallery' ? { ...s, items: [...(s.items || []), ...missing(gallery, s.items || [])] } : s));
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  if (settings.brandName && settings.navigation?.some(n => n.href === '/activites' && !n.items?.some(i => i.href === eventsPath)))
    await payload.updateGlobal({ slug: 'site-settings', data: { _status: 'published', navigation: settings.navigation.map(n => n.href === '/activites'
      ? { ...n, items: [...(n.items || []), { label: 'Événements', href: eventsPath }] } : n) } });
  await payload.updateGlobal({ slug: 'cms-state', data: { extrasImported: true } });
}
