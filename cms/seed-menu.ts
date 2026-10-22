import type { Payload } from 'payload';

// One-time reorganization of the header and footer into four themed groups plus Contact.
const academie = [
  { label: 'Présentation', href: '/academie/presentation' },
  { label: 'Notre histoire', href: '/academie/notre-histoire' },
  { label: 'Mot du Président', href: '/academie/president' },
  { label: 'Membres du bureau', href: '/academie/membres-du-bureau' },
  { label: 'Partenaires', href: '/academie/partenaires' },
];
const magazine = [
  { label: 'Le Magazine', href: '/magazine' },
  { label: 'Articles de gastronomie', href: '/gastronomie-marocaine' },
  { label: 'Plats marocains', href: '/plats' },
];
const vie = [
  { label: 'Nos activités', href: '/activites' },
  { label: 'Événements', href: '/activites/evenements' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Galerie', href: '/galerie' },
];
const publications = [
  { label: 'Bibliothèque', href: '/bibliotheque' },
  { label: 'Rapports', href: '/rapports' },
];
export const navigation = [
  { label: 'Accueil', href: '/', items: [] },
  { label: 'L’Académie', href: '/academie', items: academie },
  { label: 'Magazine', href: '/magazine', items: magazine },
  { label: 'Activités', href: '/activites', items: vie },
  { label: 'Publications', href: '/bibliotheque', items: publications },
  { label: 'Contact', href: '/contact', items: [] },
];
export const footerColumns = [
  { title: 'L’Académie', links: academie },
  { title: 'Magazine', links: magazine },
  { title: 'Activités', links: vie },
  { title: 'Publications', links: [...publications, { label: 'Contact', href: '/contact' }] },
];

export async function seedMenu(payload: Payload) {
  const state = await payload.findGlobal({ slug: 'cms-state' });
  if (state.menuOrganized) return;
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  if (settings.brandName) await payload.updateGlobal({ slug: 'site-settings', data: { navigation, footerColumns, _status: 'published' } });
  await payload.updateGlobal({ slug: 'cms-state', data: { menuOrganized: true } });
}
