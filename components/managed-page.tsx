/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { publishedArticles, publishedReports, publishedBooks, publishedSettings, mediaURL } from '@/lib/cms';
import type { Page } from '@/payload-types';
import { Breadcrumbs, SectionIntro } from './site-shell';
import { ReportCards, BookCards } from './cms-public';
import { ContactForm } from './contact-form';
import { images } from '@/lib/content';
type Section=NonNullable<Page['sections']>[number];
function Paragraphs({text}:{text?:string|null}) {return text?.split(/\n\s*\n/).map((line,i)=><p key={i} style={{whiteSpace:'pre-line'}}>{line}</p>);}
function Action({label,href,secondary=false}:{label?:string|null;href?:string|null;secondary?:boolean}) {return label&&href?<Link href={href} className={`button ${secondary?'secondary':'outline'}`}>{label} ↗</Link>:null;}
async function PageSection({section:s}:{section:Section}) {
 const image=mediaURL(s.image)||s.legacyImage;
 if(s.enabled===false)return null;
 if(s.kind==='split')return <section className="split-section"><div className="split-copy"><p className="kicker">{s.kicker}</p><h2>{s.title}</h2><Paragraphs text={s.text}/><Action label={s.buttonLabel} href={s.buttonHref}/></div>{image&&<img className="managed-split-image" src={image} alt={s.title||''}/>}</section>;
 if(s.kind==='text')return <section className="reading-layout"><p className="kicker">{s.kicker}</p>{s.title&&<h2 className="managed-heading">{s.title}</h2>}<div className="source-prose"><Paragraphs text={s.text}/></div><Action label={s.buttonLabel} href={s.buttonHref}/></section>;
 if(s.kind==='callout')return <section className="magazine-transition">{image&&<img src={image} alt=""/>}<div><p className="kicker">{s.kicker}</p><h2>{s.title}</h2><Paragraphs text={s.text}/></div><Action label={s.buttonLabel} href={s.buttonHref} secondary/></section>;
 if(s.kind==='feed') {
  if(s.feed==='reports')return <><div className="managed-section-title"><SectionIntro title={s.title||'Rapports'} kicker={s.kicker||undefined} text={s.text||undefined}/></div><ReportCards reports={(await publishedReports()).slice(0,s.limit||6)}/></>;
  if(s.feed==='books')return <section className="editorial-section"><SectionIntro title={s.title||'Bibliothèque'} kicker={s.kicker||undefined} text={s.text||undefined}/><BookCards books={(await publishedBooks()).slice(0,s.limit||6)}/><Action label={s.buttonLabel} href={s.buttonHref}/></section>;
  const articles=(await publishedArticles()).filter(a=>!s.category||a.magazineCategory===s.category).slice(0,s.limit||6);
  return <section className="editorial-section"><SectionIntro title={s.title||'Articles'} kicker={s.kicker||undefined} text={s.text||undefined}/><div className="managed-card-grid">{articles.map(a=><Link className="article-card" href={a.path} key={a.path}><img src={a.hero} alt={a.title} loading="lazy"/><div><p className="meta">{a.magazineCategory}</p><h3>{a.title}</h3><p>{a.summary}</p></div></Link>)}{!articles.length&&<p>Les prochaines publications seront disponibles ici.</p>}</div><Action label={s.buttonLabel} href={s.buttonHref}/></section>;
 }
 if(s.kind==='gallery')return <section className="managed-gallery-section"><SectionIntro title={s.title||'Galerie'} kicker={s.kicker||undefined} text={s.text||undefined}/><div className="masonry full">{s.items?.map((item,i)=>{const src=mediaURL(item.image)||item.legacyImage;return src?<figure key={item.id||i}><img src={src} alt={item.title||''} loading="lazy"/><figcaption><span>{item.label}</span>{item.title}</figcaption></figure>:null;})}</div></section>;
 if(s.kind==='partners')return <section className="partners-band"><SectionIntro title={s.title||'Nos partenaires'} kicker={s.kicker||undefined} text={s.text||undefined} align="center"/><div>{s.items?.map((item,i)=>{const src=mediaURL(item.image)||item.legacyImage;const img=src?<img src={src} alt={item.title||'Partenaire'} loading="lazy"/>:<span>{item.title}</span>;return item.href?<Link href={item.href} key={item.id||i}>{img}</Link>:<span key={item.id||i}>{img}</span>;})}</div></section>;
 if(s.kind==='contact') {const settings=await publishedSettings();return <section className="contact-band detailed"><div><p className="kicker">{s.kicker||'Contact'}</p><h2>{s.title||'Contactez-nous'}</h2><Paragraphs text={s.text}/><dl><dt>Adresse</dt><dd>{settings.city}</dd><dt>Téléphone</dt><dd><a href={`tel:${settings.phone}`}>{settings.phone}</a></dd><dt>Email</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd><dt>Horaires</dt><dd style={{whiteSpace:'pre-line'}}>{settings.hours}</dd></dl></div>{settings.email&&<ContactForm email={settings.email}/>}</section>;}
 return <section className="managed-cards-section"><SectionIntro title={s.title||''} kicker={s.kicker||undefined} text={s.text||undefined}/><div className="managed-card-grid">{s.items?.map((item,i)=>{const src=mediaURL(item.image)||item.legacyImage;const card=<>{src&&<img src={src} alt={item.title||''} loading="lazy"/>}<div className="managed-card-copy"><p className="meta">{item.label}</p><h3>{item.title}</h3><Paragraphs text={item.text}/>{item.href&&<span className="text-link">Découvrir ↗</span>}</div></>;return item.href?<Link className="managed-card" href={item.href} key={item.id||i}>{card}</Link>:<article className="managed-card" key={item.id||i}>{card}</article>;})}</div><Action label={s.buttonLabel} href={s.buttonHref}/></section>;
}
export async function ManagedPage({doc}:{doc:Page}) {
 const legacy=doc.legacyImage===images.president?images.hero:doc.legacyImage; // President page header uses the Magazine header photo; the portrait stays in the page body
 const image=mediaURL(doc.cover)||legacy;
 return <main>{doc.pageKind==='home'?<section className="home-hero"><div className="hero-slide">{image&&<img src={image} alt="" fetchPriority="high"/>}</div><div className="hero-rail" aria-hidden="true">Fondation · Magazine · Patrimoine</div><div className="hero-content"><p className="kicker">{doc.kicker}</p><h1>{doc.title}</h1><p>{doc.summary}</p><div className="hero-actions">{doc.buttonLabel&&doc.buttonHref&&<Link href={doc.buttonHref} className="button primary">{doc.buttonLabel}</Link>}{doc.secondaryLabel&&doc.secondaryHref&&<Link href={doc.secondaryHref} className="button secondary">{doc.secondaryLabel}</Link>}</div></div><div className="hero-edition"><strong>{doc.edition}</strong></div></section>:<section className="interior-hero">{image&&<img src={image} alt="" fetchPriority="high"/>}<span className="interior-mark" aria-hidden="true">◆</span><div><p className="kicker">{doc.kicker||'L’Académie'}</p><h1>{doc.title}</h1><p>{doc.summary}</p></div></section>}
 {doc.pageKind!=='home'&&<div className="breadcrumb-band"><Breadcrumbs items={[{label:doc.title}]}/></div>}
 {doc.content?.root.children.length?<section className="article-body"><RichText data={doc.content}/></section>:null}
 {doc.sections?.map((section,i)=><PageSection section={section} key={section.id||i}/>)}
 </main>;
}
