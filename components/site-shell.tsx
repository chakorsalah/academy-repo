/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { footerColumns, images, nav, site } from "@/lib/content";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Accueil">
        <img src={images.logo} alt="Académie Gastronomie Maroc" width={62} height={62} decoding="async" />
        <span>
          <strong>Académie</strong>
          <small>Magazine Marocain de la Gastronomie</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Navigation principale">
        {nav.map((item) => (
          <div className="nav-item" key={item.label}>
            <Link href={item.href}>{item.label}</Link>
            {"items" in item && item.items ? (
              <div className="mega-menu">
                {item.items.map((child) => (
                  <Link href={child.href} key={child.href}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>

      <details className="mobile-nav">
        <summary aria-label="Ouvrir la navigation">
          <span />
          <span />
          <span />
        </summary>
        <nav className="mobile-panel" aria-label="Navigation mobile">
          {nav.map((item) => (
            <div key={item.label}>
              <Link href={item.href}>{item.label}</Link>
              {"items" in item && item.items ? (
                <div>
                  {item.items.slice(0, 8).map((child) => (
                    <Link href={child.href} key={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </details>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-identity">
          <img src={images.logo} alt="Académie Gastronomie Maroc" width={92} height={92} loading="lazy" decoding="async" />
          <p>
            Fondation Académie Marocaine de la Gastronomie et Magazine Marocain de la Gastronomie réunis
            dans une seule plateforme éditoriale.
          </p>
          <address>
            {site.contact.city}
            <br />
            {site.contact.phone}
            <br />
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </address>
        </div>

        {footerColumns.map((column) => (
          <div className="footer-column" key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 Fondation Académie Marocaine de la Gastronomie.</span>
        <span>Contenus migrés depuis les sites sources indiqués.</span>
      </div>
    </footer>
  );
}

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
