/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { publishedArticles } from "@/lib/cms";
import {
  academyObjectives,
  activities,
  Article,
  bookImages,
  dishes,
  gallery,
  gastronomyIndex,
  getSource,
  images,
  news,
  PageEntry,
  partners,
  pillars,
  site,
} from "@/lib/content";
import { Breadcrumbs, ImagePanel, SectionIntro, SourceLine } from "@/components/site-shell";

function excerpt(text: string, max = 180) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}...`;
}

function assetUrl(src: string) {
  return src.startsWith("http") ? src : `${site.url}${src}`;
}

function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link href={article.path} className={`article-card ${large ? "large" : ""}`}>
      <img src={article.hero} alt={article.title} loading="lazy" decoding="async" />
      <div>
        <p className="meta">{article.magazineCategory}</p>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
      </div>
    </Link>
  );
}

function DishCard({ dish, large = false }: { dish: (typeof dishes)[number]; large?: boolean }) {
  return (
    <Link href={dish.path} className={`dish-card ${large ? "large" : ""}`}>
      <img src={dish.image} alt={dish.title} loading="lazy" decoding="async" />
      <div>
        <p className="meta">
          {dish.date} · {dish.author}
        </p>
        <h3>{dish.title}</h3>
        <p>{dish.excerpt}</p>
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <section className="home-hero">
      <div className="hero-slide">
        <img src={images.hero} alt="Table de gastronomie marocaine" fetchPriority="high" decoding="async" />
      </div>
      <div className="hero-rail" aria-hidden="true">
        Fondation · Magazine · Patrimoine
      </div>
      <div className="hero-content reveal">
        <p className="kicker">Promouvoir l'Excellence</p>
        <h1>
          <span>L'Art Culinaire</span>
          <span>Marocain</span>
        </h1>
        <p>
          Fondation, patrimoine, recettes et magazine réunis dans une seule plateforme dédiée à la
          gastronomie marocaine.
        </p>
        <div className="hero-actions">
          <Link href="/academie" className="button primary">
            Découvrir l'Académie
          </Link>
          <Link href="/gastronomie-marocaine" className="button secondary">
            Explorer la gastronomie marocaine
          </Link>
        </div>
      </div>
      <div className="hero-edition">
        <span>Depuis 2022</span>
        <strong>Préserver Notre Patrimoine</strong>
      </div>
    </section>
  );
}

export async function HomePage() {
  const articles = await publishedArticles();
  return (
    <main>
      <Hero />

      <section className="academy-bridge" aria-label="Transition vers l'Académie">
        <p>Depuis 2022</p>
        <h2>Une institution pour préserver, promouvoir et transmettre la culture gastronomique marocaine.</h2>
      </section>

      <section className="split-section">
        <div className="split-copy reveal">
          <p className="kicker">Depuis 2022</p>
          <h2>Fondation Académie Marocaine de la Gastronomie</h2>
          <p>
            Fondée en 2022, l'Académie Marocaine de Gastronomie est une association à but non
            lucratif qui a pour mission de promouvoir la gastronomie marocaine, de préserver son
            patrimoine culinaire et de contribuer à son rayonnement international.
          </p>
          <p>
            Composée de personnalités passionnées par l'art culinaire marocain, l'Académie œuvre à
            la valorisation des produits du terroir, à la transmission des savoirs et à la
            reconnaissance de l'excellence gastronomique marocaine.
          </p>
          <Link href="/academie/presentation" className="text-link">
            En savoir plus
          </Link>
        </div>
        <ImagePanel src={images.academy} alt="Académie Marocaine de Gastronomie" className="tall" />
      </section>

      <section className="pillar-band">
        {pillars.map((pillar) => (
          <article key={pillar.title}>
            <span aria-hidden="true">{pillar.title.slice(0, 1)}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="editorial-section">
        <SectionIntro
          kicker="Magazine & patrimoine"
          title="Gastronomie Marocaine"
          text="Un index éditorial des textes de fond issus du Magazine, réorganisés pour la lecture et la navigation."
        />
        <div className="feature-grid">
          {articles[0] ? <ArticleCard article={articles[0]} large /> : <p>De nouvelles histoires arrivent bientôt.</p>}
          <div>
            {articles.slice(1, 5).map((item) => (
              <Link href={item.path} className="story-row" key={item.path}>
                <img src={item.hero} alt={item.title} loading="lazy" decoding="async" />
                <span>
                  <small>Gastronomie</small>
                  <strong>{item.title}</strong>
                  <em>Lire l'article</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dishes-section">
        <SectionIntro
          kicker="Plats marocains"
          title="Découvrez Nos Plats Marocains"
          text="Les plats déjà présents dans le Magazine sont conservés avec leurs dates, auteurs, images et introductions."
        />
        <div className="dish-layout">
          <DishCard dish={dishes[0]} large />
          <div>
            <DishCard dish={dishes[1]} />
            <DishCard dish={dishes[2]} />
          </div>
        </div>
        <Link href="/plats" className="button outline">
          Découvrir tous les plats
        </Link>
      </section>

      <section className="culture-section">
        <SectionIntro
          kicker="Patrimoine & culture"
          title="Lire la cuisine comme un patrimoine vivant"
        />
        <div className="culture-list">
          {articles.slice(0, 5).map((article) => (
            <ArticleCard article={article} key={article.path} />
          ))}
        </div>
      </section>

      <section className="activities-strip">
        <SectionIntro kicker="Académie" title="Nos Activités" />
        <div className="activity-mosaic">
          {activities.slice(0, 3).map((activity) => (
            <article key={activity.title}>
              <img src={activity.image} alt={activity.title} loading="lazy" decoding="async" />
              <div>
                <h3>{activity.title}</h3>
                <p>{activity.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="news-section">
        <SectionIntro kicker="Actualités" title="Dernières nouvelles de l'Académie" />
        <div className="news-list">
          {news.map((item) => (
            <article key={item.title}>
              <time>{item.date}</time>
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
              <div>
                <p className="meta">{item.category}</p>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/actualites" className="button outline">
          Toutes les actualités
        </Link>
      </section>

      <section className="magazine-transition">
        <img src={images.magazineThree} alt="" loading="lazy" decoding="async" />
        <div>
          <p className="kicker">Le Magazine</p>
          <h2>Magazine Marocain de la Gastronomie</h2>
          <p>Explorez des recettes, des traditions culinaires et bien plus encore.</p>
        </div>
        <Link href="/magazine" className="button secondary">
          Ouvrir le magazine
        </Link>
      </section>

      <section className="gallery-preview">
        <SectionIntro kicker="Galerie" title="Images, événements et patrimoine" align="center" />
        <div className="masonry">
          {gallery.slice(0, 8).map((item) => (
            <figure key={item.title}>
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
              <figcaption>
                <span>{item.category}</span>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <PartnersBand />
      <ContactBand />
    </main>
  );
}

export function AcademyPage() {
  return (
    <main>
      <InteriorHero
        title="Fondation Académie Marocaine de la Gastronomie"
        kicker="L'Académie"
        text="Présentation, histoire, président, membres, partenaires et activités dans une même lecture institutionnelle."
        image={images.academy}
      />
      <section className="split-section">
        <ImagePanel src={images.about} alt="Académie Marocaine de Gastronomie" className="tall" />
        <div className="split-copy">
          <p className="kicker">Depuis 2022</p>
          <h2>Préserver, promouvoir, transmettre</h2>
          <p>
            La FAM est constituée conformément aux dispositions du Dahir n° 1-58-376 du 3 Joumada I
            1378 relatif au droit d'association. Elle bénéficie de la personnalité morale et de la
            pleine capacité juridique lui permettant de réaliser les objectifs pour lesquels elle a
            été créée.
          </p>
          <p>
            Elle œuvre à la reconnaissance de l'excellence gastronomique marocaine et à la
            transmission des savoirs et techniques culinaires traditionnels aux nouvelles
            générations.
          </p>
        </div>
      </section>
      <section className="objective-section">
        {academyObjectives.map((objective) => (
          <p key={objective}>{objective}</p>
        ))}
      </section>
      <section className="timeline-section">
        <SectionIntro kicker="Histoire" title="Une fondation née à Tanger" />
        <div className="timeline">
          <article>
            <time>18 mars 2022</time>
            <p>Lancement officiel de la FAMG au Palais Zahia, dans la médina de Tanger.</p>
          </article>
          <article>
            <time>2022-2023</time>
            <p>Début des travaux pour un catalogue national et un dictionnaire de la gastronomie marocaine.</p>
          </article>
          <article>
            <time>2024</time>
            <p>Lancement de projets de traduction de terminologies culinaires et de publications multilingues.</p>
          </article>
        </div>
      </section>
      <ActivitiesPage compact />
      <PartnersBand />
    </main>
  );
}

export function SourcePageView({ page }: { page: PageEntry }) {
  const source = page.sourceUrl ? getSource(page.sourceUrl) : undefined;
  const lines = source?.lines.filter((line) => line !== page.title).slice(0, 40) ?? [];
  return (
    <main>
      <InteriorHero title={page.title} kicker="L'Académie" text={page.description} image={page.image ?? images.about} />
      <section className="reading-layout">
        <Breadcrumbs items={[{ label: "L'Académie", href: "/academie" }, { label: page.title }]} />
        <div className="source-prose">
          {lines.map((line) => (isLikelyHeading(line, source?.headings.map((h) => h.text) ?? []) ? <h2 key={line}>{line}</h2> : <p key={line}>{line}</p>))}
        </div>
        <SourceLine url={page.sourceUrl} />
      </section>
    </main>
  );
}

export function PresidentPage() {
  const source = getSource("https://www.academiegastronomiemaroc.ma/mot-du-president");
  const start = source?.lines.findIndex((line) => line === "Si le peintre cherche à plaire au public par la présentation de beaux tableaux parlants et attirants, le cuisinier, par ses préparations culinaires veut satisfaire la curiosité des fins gourmets au niveau de l'olfactif, l'odorat, le gustatif et nutritionnel. Une bonne cuisine faite avec doigté et avec goût est le moyen efficace pour relater la civilisation et les techniques des gens du pays et de la région dont elle est originaire.") ?? 0;
  const lines = source?.lines.slice(Math.max(0, start), -2) ?? [];
  return (
    <main>
      <InteriorHero
        title="Mot du Président"
        kicker="Dr. Salah Chakor"
        text="Président Fondateur de la Fondation Académie Marocaine de la Gastronomie"
        image={images.banner}
      />
      <section className="president-layout">
        <aside>
          <img src={images.president} alt="Dr. Salah Chakor" loading="lazy" decoding="async" />
          <h2>Dr. Salah Chakor</h2>
          <p>Président Fondateur</p>
        </aside>
        <article className="article-body">
          <Breadcrumbs items={[{ label: "L'Académie", href: "/academie" }, { label: "Mot du Président" }]} />
          <p className="pull-quote">
            La gastronomie est un élément important pour faire la promotion du pays et créer sa marque.
          </p>
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="signature">DR. SALAH CHAKOR · Président Fondateur</p>
          <SourceLine url="https://www.academiegastronomiemaroc.ma/mot-du-president" />
        </article>
      </section>
    </main>
  );
}

export function MembersPage() {
  return (
    <main>
      <InteriorHero
        title="Membres du bureau"
        kicker="Gouvernance"
        text="Structure disponible dans les pages sources accessibles de l'Académie."
        image={images.academy}
      />
      <section className="reading-layout">
        <Breadcrumbs items={[{ label: "L'Académie", href: "/academie" }, { label: "Membres du bureau" }]} />
        <div className="source-prose">
          <h2>Notre Structure</h2>
          <p>
            L'Académie est dirigée par un conseil d'administration composé de personnalités reconnues
            dans le domaine de la gastronomie, de la culture et des arts culinaires.
          </p>
          <p>
            Les pages sources accessibles indiquent que ses membres comprennent des chefs renommés,
            des historiens de la gastronomie, des critiques culinaires, des producteurs de produits
            du terroir et des passionnés de la cuisine marocaine.
          </p>
          <p>
            La liste nominative détaillée du bureau n'était pas disponible dans les pages consultées
            automatiquement; la page conserve donc la structure prévue sans inventer de noms.
          </p>
        </div>
        <SourceLine url="https://www.academiegastronomiemaroc.ma/academie/qui-sommes-nous" />
      </section>
    </main>
  );
}

export function PartnersPage() {
  return (
    <main>
      <InteriorHero title="Partenaires" kicker="Réseau" text="Institutions et organisations associées à l'Académie." image={images.academy} />
      <section className="partners-page">
        <PartnersBand />
      </section>
    </main>
  );
}

export async function GastronomyPage() {
  const articles = await publishedArticles();
  const index = [...gastronomyIndex.filter(item => !item.path.startsWith("/gastronomie-marocaine/") || !["patrimoine-gastronomique", "cuisine-arrieres-grands-meres", "famille-marocaine-table", "anthropologie", "science-alimentation", "ras-el-hanout"].includes(item.path.split("/").pop()!)), ...articles.map(a => ({ path: a.path, title: a.title, description: a.summary, image: a.hero }))];
  return (
    <main>
      <InteriorHero
        title="Gastronomie Marocaine"
        kicker="Index éditorial"
        text="Histoire, patrimoine, cuisine familiale, anthropologie, alimentation, tourisme et épices dans une architecture unique."
        image={images.tagines}
      />
      <section className="folio-intro">
        <p>Index</p>
        <h2>Des textes de fond, des plats et des traditions organisés comme un vrai sommaire éditorial.</h2>
      </section>
      <section className="index-grid">
        {index.map((item, index) => (
          <Link href={item.path} className={index === 0 ? "index-card wide" : "index-card"} key={item.path}>
            <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            <div>
              <p className="meta">Gastronomie Marocaine</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <span>Lire l'article</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

export async function CategoryPage({ page }: { page: PageEntry }) {
  const articles = await publishedArticles();
  const related = page.categoryKey === "tourisme" ? articles.filter((article) => article.magazineCategory === "Tourisme") : articles.slice(0, 3);
  return (
    <main>
      <InteriorHero title={page.title} kicker="Rubrique" text={page.description} image={page.image ?? images.tagines} />
      <section className="breadcrumb-band">
        <Breadcrumbs items={[{ label: "Gastronomie Marocaine", href: "/gastronomie-marocaine" }, { label: page.title }]} />
      </section>
      <section className="index-grid compact">
        {related.map((article) => (
          <ArticleCard article={article} key={article.path} />
        ))}
      </section>
      <section className="reading-layout">
        <div className="source-prose">
          <h2>Structure de migration</h2>
          <p>{page.description}</p>
          <p>
            Cette rubrique reste liée à une page canonique lorsque le contenu source recoupe un
            article déjà migré, afin d'éviter les doublons.
          </p>
        </div>
        <SourceLine url={page.sourceUrl} />
      </section>
    </main>
  );
}

export async function ArticlePageView({ article }: { article: Article }) {
  const articles = await publishedArticles();
  const headings = getSource(article.sourceUrl)?.headings.map((heading) => heading.text) ?? [];
  const articleIndex = articles.findIndex((item) => item.path === article.path);
  const previous = articles[(articleIndex - 1 + articles.length) % articles.length];
  const next = articles[(articleIndex + 1) % articles.length];
  const related = articles.filter(item => item.path !== article.path).sort((a, b) => Number(b.magazineCategory === article.magazineCategory) - Number(a.magazineCategory === article.magazineCategory)).slice(0, 3);
  return (
    <main>
      <section className="article-hero">
        <Breadcrumbs
          items={[
            { label: "Gastronomie Marocaine", href: "/gastronomie-marocaine" },
            { label: article.title },
          ]}
        />
        <p className="kicker">{article.magazineCategory}</p>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <div className="article-meta">
          {article.author ? <span>{article.author}</span> : null}
          <span>Magazine Marocain de la Gastronomie</span>
        </div>
        <figure>
          <img src={article.hero} alt={article.title} fetchPriority="high" decoding="async" />
          <figcaption>{article.magazineCategory} · Magazine Marocain de la Gastronomie</figcaption>
        </figure>
      </section>
      <section className="article-body">
        {article.body ? <RichText data={article.body} /> : <ArticleLines lines={article.lines} headings={headings} title={article.title} image={article.hero} />}
        <SourceLine url={article.sourceUrl} />
      </section>
      {previous && next && articles.length > 1 ? <section className="article-nav">
        <Link href={previous.path}>
          <span>Article précédent</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link href={next.path}>
          <span>Article suivant</span>
          <strong>{next.title}</strong>
        </Link>
      </section> : null}
      <section className="related-section">
        <SectionIntro kicker="À lire aussi" title="Articles associés" />
        <div className="culture-list">
          {related.map((item) => (
            <ArticleCard article={item} key={item.path} />
          ))}
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.summary,
          mainEntityOfPage: `${site.url}${article.path}/`,
          author: article.author ? { "@type": "Person", name: article.author } : undefined,
          publisher: {
            "@type": "Organization",
            name: "Fondation Académie Marocaine de la Gastronomie",
            logo: {
              "@type": "ImageObject",
              url: `${site.url}${images.logo}`,
            },
          },
          image: assetUrl(article.hero),
          articleSection: article.magazineCategory,
        }}
      />
    </main>
  );
}

function ArticleLines({ lines, headings, title, image }: { lines: string[]; headings: string[]; title: string; image: string }) {
  const nodes = [];
  let paragraphCount = 0;
  let insertedPullQuote = false;
  let insertedImage = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line || line === title || line.toLowerCase() === title.toLowerCase()) continue;
    if (line === "•") {
      const items = [];
      while (lines[index] === "•" && lines[index + 1]) {
        items.push(lines[index + 1]);
        index += 2;
      }
      index -= 1;
      nodes.push(
        <ul key={`list-${index}`}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (isLikelyHeading(line, headings)) {
      nodes.push(<h2 key={`${line}-${index}`}>{line}</h2>);
    } else {
      paragraphCount += 1;
      if (!insertedPullQuote && paragraphCount === 3) {
        insertedPullQuote = true;
        nodes.push(
          <p className="article-pull" key={`pull-${index}`}>
            {excerpt(line, 210)}
          </p>,
        );
      }
      if (!insertedImage && paragraphCount === 6) {
        insertedImage = true;
        nodes.push(
          <figure className="article-inline-image" key={`image-${index}`}>
            <img src={image} alt="" loading="lazy" decoding="async" />
          </figure>,
        );
      }
      nodes.push(<p key={`${line}-${index}`}>{line}</p>);
    }
  }
  return nodes;
}

export function DishesPage() {
  return (
    <main>
      <InteriorHero
        title="Plats Marocains"
        kicker="Inventaire des plats"
        text="Une lecture culinaire éditoriale des plats issus du Magazine."
        image={images.dishPastilla}
      />
      <section className="dish-archive">
        <DishCard dish={dishes[0]} large />
        {dishes.slice(1).map((dish) => (
          <DishCard dish={dish} key={dish.path} />
        ))}
      </section>
    </main>
  );
}

export function DishPage({ dish }: { dish: (typeof dishes)[number] }) {
  return (
    <main>
      <section className="dish-detail">
        <Breadcrumbs items={[{ label: "Plats Marocains", href: "/plats" }, { label: dish.title }]} />
        <div>
          <p className="kicker">Plat marocain</p>
          <h1>{dish.title}</h1>
          <p className="article-meta">
            <span>{dish.date}</span>
            <span>by {dish.author}</span>
          </p>
          <p>{dish.excerpt}</p>
          <p className="source-note">
            Le site source expose ce plat sous forme d'introduction éditoriale dans l'index du
            Magazine. La structure de page est conservée pour accueillir le contenu complet sans
            inventer d'étapes ou d'ingrédients supplémentaires.
          </p>
          <SourceLine url={dish.sourceUrl} />
        </div>
        <img src={dish.image} alt={dish.title} fetchPriority="high" decoding="async" />
      </section>
    </main>
  );
}

export async function MagazinePage() {
  const articles = await publishedArticles();
  const categories = ["Tous", "Gastronomie", "Histoire & authenticité", "Anthropologie", "Cuisine traditionnelle", "Alimentation", "Tourisme", "Épices", "Plats marocains"];
  return (
    <main>
      <InteriorHero
        title="Magazine Marocain de la Gastronomie"
        kicker="Le Magazine"
        text="Explorez des recettes, des traditions culinaires et bien plus encore."
        image={images.magazineThree}
      />
      <section className="category-nav" aria-label="Catégories du magazine">
        {categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </section>
      <section className="magazine-lede">
        <p>Sommaire</p>
        <h2>Articles longs, rubriques et plats marocains réunis dans une lecture plus dynamique que l'ancien index.</h2>
      </section>
      <section className="magazine-grid">
        {articles[0] ? <ArticleCard article={articles[0]} large /> : <p>De nouvelles histoires arrivent bientôt.</p>}
        {articles.slice(1).map((article) => (
          <ArticleCard article={article} key={article.path} />
        ))}
        {dishes.map((dish) => (
          <DishCard dish={dish} key={dish.path} />
        ))}
      </section>
      <section className="book-strip">
        <SectionIntro kicker="Bibliothèque" title="Livres et couvertures migrés" text="Les visuels de la page Livres sont conservés comme archive éditoriale." />
        <div>
          {bookImages.map((image, index) => (
            <img src={image} alt={`Livre ${index + 1}`} loading="lazy" decoding="async" key={image} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function ActivitiesPage({ compact = false }: { compact?: boolean }) {
  const archive = (
    <section className="activity-archive">
      {activities.map((activity, index) => (
        <article key={activity.title} className={index % 2 ? "reverse" : ""}>
          <img src={activity.image} alt={activity.title} loading="lazy" decoding="async" />
          <div>
            <p className="meta">Académie</p>
            <h2>{activity.title}</h2>
            <p>{activity.text}</p>
          </div>
        </article>
      ))}
    </section>
  );

  if (compact) return archive;

  return (
    <main>
      <InteriorHero
        title="Activités"
        kicker="Académie"
        text="Dîners, conférences, publications, concours, partenariats et formation."
        image={images.activity}
      />
      {archive}
    </main>
  );
}

export function NewsPage() {
  return (
    <main>
      <InteriorHero title="Actualités" kicker="Newsroom" text="Actualités et événements de l'Académie Marocaine de Gastronomie." image={images.conference} />
      <section className="news-archive">
        {news.map((item) => (
          <article key={item.title}>
            <time>{item.date}</time>
            <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            <div>
              <p className="meta">{item.category}</p>
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function GalleryPage() {
  return (
    <main>
      <InteriorHero title="Galerie" kicker="Images" text="Événements, gastronomie, plats, produits et personnalités." image={images.banner} />
      <section className="category-nav" aria-label="Catégories de galerie">
        {["Événements", "Gastronomie", "Plats", "Produits", "Personnalités"].map((category) => (
          <span key={category}>{category}</span>
        ))}
      </section>
      <section className="masonry full">
        {gallery.map((item) => (
          <figure key={item.title}>
            <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            <figcaption>
              <span>{item.category}</span>
              {item.title}
            </figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}

export function ContactPage() {
  return (
    <main>
      <InteriorHero title="Contact" kicker="Tanger, Maroc" text="Pour toute information complémentaire ou demande de collaboration." image={images.aboutTwo} />
      <ContactBand detailed />
    </main>
  );
}

function PartnersBand() {
  return (
    <section className="partners-band">
      <SectionIntro kicker="Partenaires" title="Nos Partenaires" text="L'Académie collabore avec des institutions et organisations pour promouvoir la gastronomie marocaine." align="center" />
      <div>
        {partners.map((partner, index) => (
          <img src={partner} alt={`Partenaire ${index + 1}`} loading="lazy" decoding="async" key={partner} />
        ))}
      </div>
    </section>
  );
}

function ContactBand({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className={`contact-band ${detailed ? "detailed" : ""}`}>
      <div>
        <p className="kicker">Contact</p>
        <h2>Contactez-nous</h2>
        <p>Pour toute information complémentaire ou demande de collaboration, n'hésitez pas à nous contacter.</p>
        <dl>
          <dt>Adresse</dt>
          <dd>{site.contact.city}</dd>
          <dt>Téléphone</dt>
          <dd>{site.contact.phone}</dd>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </dd>
          <dt>Horaires</dt>
          <dd>{site.contact.hours.join(" · ")}</dd>
        </dl>
      </div>
      <form>
        <label>
          Nom complet
          <input name="name" autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Sujet
          <input name="subject" />
        </label>
        <label>
          Message
          <textarea name="message" rows={6} />
        </label>
        <button type="button">Envoyer le message</button>
      </form>
    </section>
  );
}

function InteriorHero({ title, kicker, text, image }: { title: string; kicker: string; text: string; image: string }) {
  return (
    <section className="interior-hero">
      <img src={image} alt="" fetchPriority="high" decoding="async" />
      <span className="interior-mark" aria-hidden="true">
        ◆
      </span>
      <div>
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function PageRenderer({ page }: { page: PageEntry }) {
  switch (page.type) {
    case "academy":
      return <AcademyPage />;
    case "source":
      return <SourcePageView page={page} />;
    case "president":
      return <PresidentPage />;
    case "members":
      return <MembersPage />;
    case "partners":
      return <PartnersPage />;
    case "gastronomy":
      return <GastronomyPage />;
    case "category":
      return <CategoryPage page={page} />;
    case "article":
      return page.article ? <ArticlePageView article={page.article} /> : null;
    case "dishes":
      return <DishesPage />;
    case "dish":
      return page.dish ? <DishPage dish={page.dish} /> : null;
    case "magazine":
      return <MagazinePage />;
    case "activities":
      return <ActivitiesPage />;
    case "news":
      return <NewsPage />;
    case "gallery":
      return <GalleryPage />;
    case "contact":
      return <ContactPage />;
    default:
      return null;
  }
}

function isLikelyHeading(line: string, headings: string[]) {
  if (headings.includes(line) && line.length < 120) return true;
  if (line.endsWith(":") && line.length < 100) return true;
  if (/^(Introduction|Conclusion|Suggestions|Quelques remarques|Composition)/i.test(line)) return true;
  return false;
}
