import path from 'node:path';
import type { CollectionConfig, Field } from 'payload';
import { authenticated, adminOnly, publishedOrAuthenticated } from './access';
import { aiField, pageFields, seoFields } from './page-builder';

const slug: Field = {
  name: 'slug', label: 'Adresse de la page', type: 'text', required: true, unique: true,
  admin: { position: 'sidebar', description: 'Exemple : patrimoine-marocain. Utilisez des lettres minuscules, chiffres et tirets.' },
  validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Utilisez uniquement des lettres minuscules, chiffres et tirets.',
  hooks: { beforeValidate: [({ value, siblingData }) => value || siblingData?.title?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')] },
};
const editorialAccess = { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: adminOnly };
const commonFields: Field[] = [
  { name: 'title', label: 'Titre', type: 'text', required: true },
  { name: 'summary', label: 'Résumé', type: 'textarea', required: true, maxLength: 500, admin: { description: 'Une introduction courte, affichée dans les listes et les moteurs de recherche.' } },
  { name: 'cover', label: 'Image de couverture', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image/' } } },
  { name: 'legacyImage', type: 'text', admin: { hidden: true } },
  { name: 'content', label: 'Contenu', type: 'richText', required: true },
  slug,
  { name: 'publishedAt', label: 'Date de publication', type: 'date', defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
];
export const Users: CollectionConfig = {
  slug: 'users', labels: { singular: 'Membre', plural: 'Équipe' },
  admin: { useAsTitle: 'name', group: 'Administration', defaultColumns: ['name', 'email', 'role'] },
  auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000, tokenExpiration: 7200, cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' } },
  access: {
    admin: ({ req }) => Boolean(req.user), create: adminOnly, delete: adminOnly,
    read: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
  },
  hooks: { beforeChange: [async ({ data, operation, req }) => {
    if (operation === 'create' && (await req.payload.count({ collection: 'users', req })).totalDocs === 0) data.role = 'admin';
    return data;
  }] },
  fields: [
    { name: 'name', label: 'Nom complet', type: 'text', required: true },
    { name: 'role', label: 'Rôle', type: 'select', required: true, defaultValue: 'editor', saveToJWT: true,
      options: [{ label: 'Administrateur', value: 'admin' }, { label: 'Rédacteur', value: 'editor' }],
      access: { create: ({ req }) => req.user?.role === 'admin', update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
};
export const Media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Fichier', plural: 'Médiathèque' },
  admin: { group: 'Contenu', useAsTitle: 'alt', description: 'Images et documents publics du site. Ajoutez un texte alternatif pour les images.' },
  access: { read: () => true, create: authenticated, update: authenticated, delete: adminOnly },
  upload: { staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'), mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] },
  fields: [{ name: 'alt', label: 'Description / texte alternatif', type: 'text', required: true }],
};
export const Articles: CollectionConfig = {
  slug: 'articles', labels: { singular: 'Article', plural: 'Articles' },
  admin: { useAsTitle: 'title', group: 'Contenu', defaultColumns: ['title', 'category', '_status', 'updatedAt'],
    preview: (doc) => `/preview/articles/${doc.id}`,
    description: 'Rédigez, enregistrez un brouillon, puis publiez votre article dans le Magazine.',
  },
  access: editorialAccess, versions: { drafts: true, maxPerDoc: 30 },
  fields: [aiField, ...commonFields, ...seoFields,
    { name: 'category', label: 'Rubrique', type: 'select', required: true, defaultValue: 'Gastronomie', admin: { position: 'sidebar' },
      options: ['Gastronomie', 'Histoire & authenticité', 'Anthropologie', 'Cuisine traditionnelle', 'Alimentation', 'Tourisme', 'Épices'] },
    { name: 'author', label: 'Auteur', type: 'text', defaultValue: 'Salah Chakor', admin: { position: 'sidebar' } },
    { name: 'sourceUrl', label: 'Source originale (facultatif)', type: 'text', admin: { position: 'sidebar' }, validate: (value: unknown) => !value || typeof value === 'string' && /^https?:\/\//.test(value) || 'Indiquez une adresse http ou https.' },
  ],
};
export const Reports: CollectionConfig = {
  slug: 'reports', labels: { singular: 'Rapport', plural: 'Rapports' },
  admin: { useAsTitle: 'title', group: 'Contenu', defaultColumns: ['title', 'year', '_status', 'updatedAt'], preview: (doc) => `/preview/reports/${doc.id}`,
    description: 'Publiez un compte rendu, un bilan ou un rapport accompagné de son PDF.' },
  access: editorialAccess, versions: { drafts: true, maxPerDoc: 30 },
  fields: [aiField, ...commonFields, ...seoFields,
    { name: 'document', label: 'Document PDF (facultatif)', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { equals: 'application/pdf' } } },
    { name: 'year', label: 'Année', type: 'number', min: 1900, max: 2200, defaultValue: () => new Date().getFullYear(), admin: { position: 'sidebar' } },
  ],
};
export const Books: CollectionConfig = {
  slug: 'books', labels: { singular: 'Livre', plural: 'Bibliothèque' },
  admin: { useAsTitle: 'title', group: 'Contenu', defaultColumns: ['title', 'author', 'year', '_status', 'updatedAt'],
    description: 'Ajoutez un livre ou un document PDF à télécharger. Les livres publiés apparaissent sous /bibliotheque.' },
  access: editorialAccess, versions: { drafts: true, maxPerDoc: 30 }, defaultSort: 'order',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'author', label: 'Auteur', type: 'text', defaultValue: 'Salah Chakor' },
    { name: 'summary', label: 'Présentation courte', type: 'textarea', maxLength: 500 },
    { name: 'cover', label: 'Couverture', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image/' } } },
    { name: 'legacyCover', type: 'text', admin: { hidden: true } },
    { name: 'file', label: 'Fichier PDF', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { equals: 'application/pdf' } },
      admin: { description: 'Téléversez le PDF dans la Médiathèque, ou indiquez un lien externe ci-dessous.' } },
    { name: 'externalUrl', label: 'Lien de téléchargement externe (facultatif)', type: 'text',
      admin: { description: 'Par exemple un dossier Google Drive. Utilisé seulement si aucun PDF n’est téléversé.' },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (value && !(typeof value === 'string' && /^https:\/\//.test(value))) return 'Indiquez une adresse https.';
        return Boolean(value || siblingData?.file || siblingData?._status !== 'published') || 'Ajoutez un PDF ou un lien de téléchargement avant de publier.';
      } },
    { name: 'language', label: 'Langue', type: 'select', defaultValue: 'fr', admin: { position: 'sidebar' },
      options: [{ label: 'Français', value: 'fr' }, { label: 'Arabe', value: 'ar' }, { label: 'Anglais', value: 'en' }] },
    { name: 'year', label: 'Année', type: 'number', min: 1900, max: 2200, admin: { position: 'sidebar' } },
    { name: 'order', label: 'Ordre d’affichage', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Les plus petits nombres apparaissent en premier.' } },
  ],
};
export const ContentPages: CollectionConfig = {
  slug: 'pages', labels: { singular: 'Page', plural: 'Pages du site' },
  admin: { useAsTitle: 'title', group: 'Contenu', defaultColumns: ['title', '_status', 'updatedAt'], preview: (doc) => `/preview/pages/${doc.id}`,
    description: 'Gérez toutes les pages : couverture, contenu, sections et référencement. Les adresses historiques sont conservées.' },
  access: editorialAccess, versions: { drafts: true, maxPerDoc: 30 },
  fields: [aiField, ...commonFields.map((field): Field => { if (field.type === 'richText' && field.name === 'content') return { ...field, required: false }; if (field.type === 'text' && field.name === 'slug') return { ...field, admin: { ...field.admin, condition: (_: unknown, data: Record<string, unknown>) => !data.originalPath } }; return field; }), ...pageFields, ...seoFields,
    { name: 'originalPath', label: 'Adresse publique conservée', type: 'text', admin: { readOnly: true, position: 'sidebar', condition: (_, data) => Boolean(data?.originalPath) }, access: { create: () => false, update: () => false } },
  ],
};
