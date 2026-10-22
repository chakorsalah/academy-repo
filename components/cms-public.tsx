/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { Breadcrumbs } from './site-shell';
import { mediaURL } from '@/lib/cms';
import type { Report, Book, Page } from '@/payload-types';
export function ContentView({ doc, report = false }: { doc: Report | Page; report?: boolean }) {
  const cover = mediaURL(doc.cover) || doc.legacyImage;
  const document = 'document' in doc ? mediaURL(doc.document) : undefined;
  return <main><section className="article-hero"><Breadcrumbs items={[{ label: report ? 'Rapports' : 'L’Académie', href: report ? '/rapports' : '/academie' }, { label: doc.title }]} /><p className="kicker">{report ? 'Publications & rapports' : 'L’Académie'}</p><h1>{doc.title}</h1><p>{doc.summary}</p>{cover && <figure><img src={cover} alt={typeof doc.cover === 'object' && doc.cover ? doc.cover.alt : doc.title} /></figure>}</section><section className="article-body">{doc.content && <RichText data={doc.content} />}{document && <a className="button primary" href={document} target="_blank" rel="noreferrer">Télécharger le rapport PDF ↗</a>}</section></main>;
}
export function ReportCards({ reports }: { reports: Report[] }) {
  return <section className="cms-report-grid">{reports.map(doc => <Link href={`/rapports/${doc.slug}`} key={doc.id}><span className="kicker">RAPPORT · {doc.year}</span><h2>{doc.title}</h2><p>{doc.summary}</p><span className="text-link">Consulter le rapport ↗</span></Link>)}{!reports.length && <div className="cms-public-empty"><h2>Les publications de l’Académie</h2><p>Les prochains bilans, comptes rendus et rapports seront disponibles ici.</p></div>}</section>;
}
const languages = { fr: 'Français', ar: 'العربية', en: 'English' } as const;
export function BookCards({ books }: { books: Book[] }) {
  return <section className="book-grid">{books.map(book => {
    const file = typeof book.file === 'object' && book.file ? book.file : undefined;
    const href = file?.url || book.externalUrl;
    const cover = mediaURL(book.cover) || book.legacyCover;
    const size = file?.filesize ? ` · ${(file.filesize / 1024 / 1024).toFixed(1).replace('.', ',')} Mo` : '';
    return <article className="book-card" key={book.id} lang={book.language || undefined} dir={book.language === 'ar' ? 'rtl' : undefined}>
      <div className="book-cover">{cover ? <img src={cover} alt={`Couverture : ${book.title}`} loading="lazy" /> : <span aria-hidden="true">PDF</span>}</div>
      <div className="book-copy"><p className="meta">{[book.language && languages[book.language], book.year].filter(Boolean).join(' · ')}</p><h3>{book.title}</h3>{book.author && <p className="book-author">{book.author}</p>}{book.summary && <p>{book.summary}</p>}
        {href && <a className="button primary" href={href} {...(file ? { download: file.filename || true } : { target: '_blank', rel: 'noreferrer' })}>{file ? `Télécharger le PDF${size}` : 'Télécharger ↗'}</a>}</div>
    </article>;
  })}{!books.length && <div className="cms-public-empty"><h2>La bibliothèque de l’Académie</h2><p>Les prochains livres et documents seront disponibles ici.</p></div>}</section>;
}
