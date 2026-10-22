import type { Payload } from 'payload';
import { activities, news, dishes, gallery, partners, bookImages, pillars, academyObjectives, images, pages, nav, footerColumns, site, getSource } from '../lib/content';
import { textDocument } from './seed';
const section = (kind: string, title: string, extra: Record<string,unknown> = {}) => ({kind,title,enabled:true,...extra});
const activityItems = () => activities.map(a=>({title:a.title,text:a.text,legacyImage:a.image}));
const newsItems = () => news.map(n=>({title:n.title,text:n.excerpt,label:`${n.date} · ${n.category}`,legacyImage:n.image}));
const galleryItems = () => gallery.map(g=>({title:g.title,label:g.category,legacyImage:g.image}));
const dishItems = () => dishes.map(d=>({title:d.title,text:d.excerpt,label:d.author,legacyImage:d.image,href:d.path}));
const partnerSection = () => section('partners','Nos partenaires',{items:partners.map((image,i)=>({title:`Partenaire ${i+1}`,legacyImage:image}))});
export async function seedSite(payload: Payload) {
 const state=await payload.findGlobal({slug:'cms-state'});if(state.siteImported)return;
 const homeSections = [
  section('text','Une institution pour préserver, promouvoir et transmettre la culture gastronomique marocaine.',{kicker:'Depuis 2022'}),
  section('split','Fondation Académie Marocaine de la Gastronomie',{kicker:'Depuis 2022',text:"Fondée en 2022, l’Académie Marocaine de Gastronomie est une association à but non lucratif qui a pour mission de promouvoir la gastronomie marocaine, de préserver son patrimoine culinaire et de contribuer à son rayonnement international.\n\nComposée de personnalités passionnées par l’art culinaire marocain, l’Académie œuvre à la valorisation des produits du terroir, à la transmission des savoirs et à la reconnaissance de l’excellence gastronomique marocaine.",legacyImage:images.academy,buttonLabel:'En savoir plus',buttonHref:'/academie/presentation'}),
  section('cards','Nos engagements',{items:pillars.map(p=>({title:p.title,text:p.text}))}),
  section('feed','Gastronomie Marocaine',{kicker:'Magazine & patrimoine',feed:'articles',limit:6}),
  section('cards','Découvrez nos plats marocains',{kicker:'Plats marocains',items:dishItems(),buttonLabel:'Découvrir tous les plats',buttonHref:'/plats'}),
  section('cards','Nos activités',{kicker:'Académie',items:activityItems().slice(0,3)}),
  section('cards','Dernières nouvelles de l’Académie',{kicker:'Actualités',items:newsItems(),buttonLabel:'Toutes les actualités',buttonHref:'/actualites'}),
  section('callout','Magazine Marocain de la Gastronomie',{kicker:'Le Magazine',text:'Explorez des recettes, des traditions culinaires et bien plus encore.',legacyImage:images.magazineThree,buttonLabel:'Ouvrir le magazine',buttonHref:'/magazine'}),
  section('gallery','Images, événements et patrimoine',{kicker:'Galerie',items:galleryItems()}), partnerSection(),section('contact','Contactez-nous'),
 ];
 const candidates: {path:string;title:string;summary:string;image?:string;sections:unknown[];pageKind?:'home'|'interior';kicker?:string}[] = [
  {path:'/',title:'L’Art Culinaire Marocain',summary:'Fondation, patrimoine, recettes et magazine réunis dans une seule plateforme dédiée à la gastronomie marocaine.',image:images.hero,pageKind:'home',kicker:'Promouvoir l’Excellence',sections:homeSections},
  ...pages.filter(p=>!['article','dish','source','president'].includes(p.type)).map(p=>{
   let sections: unknown[]=[];
   switch(p.type){
    case 'academy': sections=[section('split','Préserver, promouvoir, transmettre',{legacyImage:images.about,text:"La FAM est constituée conformément aux dispositions du Dahir n° 1-58-376 du 3 Joumada I 1378 relatif au droit d’association. Elle bénéficie de la personnalité morale et de la pleine capacité juridique lui permettant de réaliser les objectifs pour lesquels elle a été créée.\n\nElle œuvre à la reconnaissance de l’excellence gastronomique marocaine et à la transmission des savoirs et techniques culinaires traditionnels aux nouvelles générations."}),section('cards','Nos objectifs',{items:academyObjectives.map(title=>({title}))}),section('cards','Une fondation née à Tanger',{items:[{title:'18 mars 2022',text:'Lancement officiel de la FAMG au Palais Zahia, dans la médina de Tanger.'},{title:'2022–2023',text:'Début des travaux pour un catalogue national et un dictionnaire de la gastronomie marocaine.'},{title:'2024',text:'Lancement de projets de traduction de terminologies culinaires et de publications multilingues.'}]}),section('cards','Nos activités',{items:activityItems()}),partnerSection()];break;
    case 'gastronomy':case 'category': sections=[section('feed',p.title,{feed:'articles',limit:100,...(p.categoryKey==='tourisme'?{category:'Tourisme'}:{})})];break;
    case 'magazine':sections=[section('feed','Le magazine',{feed:'articles',limit:100}),section('cards','Plats marocains',{items:dishItems()}),section('gallery','Livres et publications',{kicker:'Bibliothèque',items:bookImages.map((image,i)=>({title:`Livre ${i+1}`,legacyImage:image}))})];break;
    case 'dishes':sections=[section('cards','Plats marocains',{items:dishItems()})];break;
    case 'activities':sections=[section('cards','Nos activités',{items:activityItems()})];break;
    case 'news':sections=[section('cards','Les nouvelles de l’Académie',{items:newsItems()})];break;
    case 'gallery':sections=[section('gallery','Galerie',{items:galleryItems()})];break;
    case 'partners':sections=[partnerSection()];break;
    case 'members':sections=[section('text','Notre structure',{text:"L’Académie est dirigée par un conseil d’administration composé de personnalités reconnues dans le domaine de la gastronomie, de la culture et des arts culinaires. Ses membres comprennent des chefs renommés, des historiens de la gastronomie, des critiques culinaires, des producteurs de produits du terroir et des passionnés de la cuisine marocaine."})];break;
    case 'contact':sections=[section('contact','Contactez-nous')];break;
   }
   return {path:p.path,title:p.title,summary:p.description,image:p.image||images.hero,sections};
  }),
  ...dishes.map(d=>({path:d.path,title:d.title,summary:d.excerpt,image:d.image,sections:[section('text',d.title,{kicker:d.author,text:d.excerpt})]})),
  {path:'/rapports',title:'Rapports & publications',summary:'Nos actions, nos réflexions et nos engagements pour le patrimoine gastronomique marocain.',image:images.publication,sections:[section('feed','Publications de l’Académie',{feed:'reports',limit:100})]},
 ];
 for(const p of candidates){
  const exists=await payload.find({collection:'pages',where:{originalPath:{equals:p.path}},limit:1});if(exists.totalDocs)continue;
  const baseSlug=p.path==='/'?'accueil':p.path.slice(1).replaceAll('/','-');let slug=baseSlug;let suffix=0;
  while((await payload.count({collection:'pages',where:{slug:{equals:slug}}})).totalDocs)slug=`${baseSlug}-site-${++suffix}`;
  await payload.create({collection:'pages',data:{title:p.title,summary:p.summary,slug,originalPath:p.path,pageKind:p.pageKind||'interior',kicker:p.kicker||'L’Académie',legacyImage:p.image,showInNavigation:false,sections:p.sections as never,content:textDocument([]),edition:p.path==='/'?'Depuis 2022 · Préserver notre patrimoine':undefined,...(p.path==='/'?{buttonLabel:'Découvrir l’Académie',buttonHref:'/academie',secondaryLabel:'Explorer la gastronomie marocaine',secondaryHref:'/gastronomie-marocaine'}:{}),_status:'published'}});
 }
 const settings=await payload.findGlobal({slug:'site-settings'});
 if(!settings.brandName)await payload.updateGlobal({slug:'site-settings',data:{brandName:'Académie',tagline:'Magazine Marocain de la Gastronomie',footerText:'Fondation Académie Marocaine de la Gastronomie et Magazine Marocain de la Gastronomie réunis dans une seule plateforme éditoriale.',copyright:'Fondation Académie Marocaine de la Gastronomie',city:site.contact.city,phone:site.contact.phone,email:site.contact.email,hours:site.contact.hours.join('\n'),navigation:nav,footerColumns, _status:'published'}});
 await payload.updateGlobal({slug:'cms-state',data:{siteImported:true}});
}
