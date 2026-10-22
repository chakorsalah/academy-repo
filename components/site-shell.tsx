/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { publishedArticles,publishedPages,pagePath,publishedSettings,mediaURL } from '@/lib/cms';
import { images,site } from '@/lib/content';
export async function Header(){
 const [settings,articles,pages]=await Promise.all([publishedSettings(),publishedArticles(),publishedPages()]);
 const available=new Set([...pages.map(pagePath),...articles.map(a=>a.path)]);
 const visible=(href:string)=>!href.startsWith('/')||available.has(href.split(/[?#]/)[0].replace(/\/$/,'')||'/');
 const nav=(settings.navigation||[]).filter(n=>visible(n.href)).map(n=>({...n,items:n.href==='/academie'?[...(n.items||[]).filter(i=>visible(i.href)),...pages.filter(p=>p.showInNavigation&&!n.items?.some(i=>i.href===pagePath(p))).map(p=>({label:p.title,href:pagePath(p)}))]:(n.items||[]).filter(i=>visible(i.href))}));
 return <header className="site-header"><Link href="/" className="brand" aria-label="Accueil"><img src={mediaURL(settings.logo)||images.logo} alt={settings.brandName} width={62} height={62}/><span><strong>{settings.brandName}</strong><small>{settings.tagline}</small></span></Link><nav className="desktop-nav" aria-label="Navigation principale">{nav.map((item,i)=><div className="nav-item" key={item.id||i}><Link href={item.href}>{item.label}</Link>{!!item.items.length&&<div className="mega-menu">{item.items.map((child,j)=><Link href={child.href} key={j}>{child.label}</Link>)}</div>}</div>)}</nav><details className="mobile-nav"><summary aria-label="Ouvrir la navigation"><span/><span/><span/></summary><nav className="mobile-panel" aria-label="Navigation mobile">{nav.map((item,i)=><div key={item.id||i}><Link href={item.href}>{item.label}</Link>{item.items.map((child,j)=><Link href={child.href} key={j}>{child.label}</Link>)}</div>)}</nav></details></header>;
}
export async function Footer(){const [settings,pages,articles]=await Promise.all([publishedSettings(),publishedPages(),publishedArticles()]);const available=new Set([...pages.map(pagePath),...articles.map(a=>a.path)]);return <footer className="footer"><div className="footer-main"><div className="footer-identity"><img src={mediaURL(settings.logo)||images.logo} alt={settings.brandName} width={92} height={92} loading="lazy"/><p>{settings.footerText}</p><address>{settings.city}<br/>{settings.phone}<br/><a href={`mailto:${settings.email}`}>{settings.email}</a></address>{settings.socials?.map((link,i)=><p key={i}><a href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a></p>)}</div>{settings.footerColumns?.map((column,i)=><div className="footer-column" key={column.id||i}><h2>{column.title}</h2>{column.links?.filter(link=>!link.href.startsWith('/')||available.has(link.href.split(/[?#]/)[0].replace(/\/$/,'')||'/')).map((link,j)=><Link href={link.href} key={j}>{link.label}</Link>)}</div>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.copyright}</span><span><a href="/admin">Espace éditorial ↗</a></span></div></footer>;}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const list = [{ label: "Accueil", href: "/" }, ...items].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.href ? `${site.url}${item.href === "/" ? "" : item.href}/` : undefined,
  }));

  return (
    <>
      <nav className="breadcrumbs" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        {items.map((item) => (
          <span key={`${item.label}-${item.href ?? "current"}`}>
            <span aria-hidden="true">/</span>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <strong>{item.label}</strong>}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: list,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}

export function SectionIntro({
  kicker,
  title,
  text,
  align = "left",
}: {
  kicker?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-intro ${align === "center" ? "center" : ""}`}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function ImagePanel({
  src,
  alt,
  className = "",
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  return (
    <figure className={`image-panel ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {label ? <figcaption>{label}</figcaption> : null}
    </figure>
  );
}

export function SourceLine({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <p className="source-line">
      Source migrée:{" "}
      <a href={url} target="_blank" rel="noreferrer">
        {url.replace(/^https?:\/\//, "")}
      </a>
    </p>
  );
}
