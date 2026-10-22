import type { Field, GlobalConfig } from 'payload';
import { adminOnly, publishedOrAuthenticated } from './access';
export const safeLink = (value: unknown) => !value || typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value) || /^(mailto:|tel:)[^\s]+$/.test(value)) || 'Utilisez un chemin /page, une adresse https, mailto ou tel.';
export const aiField: Field = { name: 'assistant', type: 'ui', admin: { components: { Field: '/components/cms/AIEditor#AIEditor' } } };
const imageFields: Field[] = [
  { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image/' } } },
  { name: 'legacyImage', type: 'text', admin: { hidden: true } },
];
const linkFields: Field[] = [
  { name: 'buttonLabel', label: 'Texte du bouton', type: 'text' },
  { name: 'buttonHref', label: 'Destination du bouton', type: 'text', validate: safeLink },
];
export const pageFields: Field[] = [
  { name: 'pageKind', label: 'Présentation', type: 'select', options: [{label:'Page intérieure',value:'interior'},{label:'Page d’accueil',value:'home'}], defaultValue:'interior', admin:{position:'sidebar'} },
  { name: 'kicker', label: 'Surtitre', type: 'text' },
  ...linkFields,
  { name: 'secondaryLabel', label: 'Second bouton', type: 'text' },
  { name: 'secondaryHref', label: 'Destination du second bouton', type: 'text', validate: safeLink },
  { name: 'edition', label: 'Mention de couverture', type: 'text', admin: { condition: (_,data) => data?.pageKind === 'home' } },
  { name: 'showInNavigation', label: 'Ajouter cette page au menu de l’Académie', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  { name: 'sections', label: 'Sections de la page', type: 'array', maxRows: 30, labels: { singular: 'Section', plural: 'Sections' },
    admin: { description: 'Ajoutez des sections et faites-les glisser pour changer leur ordre. Les flux affichent automatiquement les contenus publiés.' },
    fields: [
      { name: 'kind', label: 'Type de section', type: 'select', required: true, defaultValue:'text', options: [
        {label:'Texte',value:'text'},{label:'Texte + image',value:'split'},{label:'Cartes / liste',value:'cards'},
        {label:'Galerie',value:'gallery'},{label:'Articles / rapports',value:'feed'},{label:'Bandeau avec bouton',value:'callout'},
        {label:'Partenaires',value:'partners'},{label:'Contact',value:'contact'}] },
      { name: 'enabled', label: 'Afficher cette section', type: 'checkbox', defaultValue:true },
      { name: 'kicker', label: 'Surtitre', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'text', label: 'Texte', type: 'textarea' },
      ...imageFields,...linkFields,
      { name: 'feed', label: 'Contenus à afficher', type: 'select', defaultValue:'articles', options:[{label:'Articles',value:'articles'},{label:'Rapports',value:'reports'},{label:'Livres (bibliothèque)',value:'books'}], admin:{condition:(_,data)=>data?.kind==='feed'} },
      { name: 'category', label: 'Filtrer par rubrique (facultatif)', type:'text', admin:{condition:(_,data)=>data?.kind==='feed' && data?.feed === 'articles'} },
      { name: 'limit', label:'Nombre de contenus', type:'number', min:1, max:100, defaultValue:6, admin:{condition:(_,data)=>data?.kind==='feed'} },
      { name: 'items', label:'Éléments', type:'array', maxRows:50, admin:{condition:(_,data)=>['cards','gallery','partners'].includes(data?.kind)}, fields:[
        {name:'title',label:'Titre / légende',type:'text'}, {name:'text',label:'Texte',type:'textarea'},
        {name:'label',label:'Rubrique / date / fonction',type:'text'},...imageFields,
        {name:'href',label:'Lien (facultatif)',type:'text',validate:safeLink},
      ] },
    ],
  },
];
export const seoFields: Field[] = [
  { name:'seoTitle',label:'Titre pour les moteurs de recherche',type:'text',maxLength:100,admin:{position:'sidebar'} },
  { name:'seoDescription',label:'Description pour les moteurs de recherche',type:'textarea',maxLength:300,admin:{position:'sidebar'} },
];
const navigation: Field[] = [
  {name:'label',label:'Libellé',type:'text',required:true},
  {name:'href',label:'Destination',type:'text',required:true,validate:safeLink},
  {name:'items',label:'Sous-menu',type:'array',maxRows:30,fields:[{name:'label',label:'Libellé',type:'text',required:true},{name:'href',label:'Destination',type:'text',required:true,validate:safeLink}]},
];
export const SiteSettings: GlobalConfig = {
  slug:'site-settings', label:'Réglages du site', access:{read:publishedOrAuthenticated,update:adminOnly}, versions:{drafts:true,max:30},
  admin:{group:'Site'},
  fields:[
    {name:'brandName',label:'Nom affiché',type:'text',required:true},
    {name:'tagline',label:'Signature',type:'text',required:true},
    {name:'logo',label:'Logo',type:'upload',relationTo:'media',filterOptions:{mimeType:{contains:'image/'}}},
    {name:'footerText',label:'Présentation dans le pied de page',type:'textarea'},
    {name:'copyright',label:'Mention légale du pied de page',type:'text'},
    {name:'city',label:'Adresse / ville',type:'text'},
    {name:'phone',label:'Téléphone',type:'text'},
    {name:'email',label:'Email de contact',type:'email'},
    {name:'hours',label:'Horaires',type:'textarea'},
    {name:'navigation',label:'Menu principal',type:'array',maxRows:20,fields:navigation},
    {name:'footerColumns',label:'Colonnes du pied de page',type:'array',maxRows:5,fields:[{name:'title',label:'Titre',type:'text'},{name:'links',label:'Liens',type:'array',maxRows:20,fields:navigation.slice(0,2)}]},
    {name:'socials',label:'Réseaux sociaux',type:'array',maxRows:10,fields:navigation.slice(0,2)},
  ],
};
