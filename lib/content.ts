import type { Article as CMSArticle } from "@/payload-types";
import assetMap from "@/content/asset-map.json";
import sourcePages from "@/content/source-content.json";

type SourceImage = {
  src: string;
  alt: string;
  width?: string;
  height?: string;
};

export type SourcePage = {
  url: string;
  title: string;
  description: string;
  headings: { level: "h1" | "h2" | "h3"; text: string }[];
  images: SourceImage[];
  lines: string[];
};

export type Article = {
  path: string;
  sourceUrl: string;
  title: string;
  category: string;
  magazineCategory: string;
  author?: string;
  date?: string;
  hero: string;
  summary: string;
  lines: string[];
  sourceNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: CMSArticle["content"];
};

export type Dish = {
  path: string;
  sourceUrl: string;
  title: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
};

export type PageEntry = {
  path: string;
  title: string;
  description: string;
  type:
    | "academy"
    | "source"
    | "president"
    | "members"
    | "partners"
    | "gastronomy"
    | "category"
    | "article"
    | "dishes"
    | "dish"
    | "magazine"
    | "activities"
    | "news"
    | "gallery"
    | "contact";
  sourceUrl?: string;
  article?: Article;
  dish?: Dish;
  categoryKey?: string;
  image?: string;
};

const assets = assetMap as Record<string, string>;
const sources = sourcePages as SourcePage[];

export const site = {
  name: "Académie & Magazine Marocain de la Gastronomie",
  shortName: "Gastronomie Maroc",
  description:
    "Plateforme unifiée de la Fondation Académie Marocaine de la Gastronomie et du Magazine Marocain de la Gastronomie.",
  url: process.env.NEXT_PUBLIC_SERVER_URL || "https://academie-magazine-gastronomie-maroc.saidjabouri002.chatgpt.site",
  contact: {
    city: "Tanger, Maroc",
    phone: "0661741576",
    email: "chakor52@gmail.com",
    hours: ["Lundi - Vendredi: 9h00 - 17h00", "Samedi: 9h00 - 13h00", "Dimanche: Fermé"],
  },
};

export function imageFor(remoteUrl: string, fallback = "/assets/source/Moroccan-Feast.png") {
  return assets[remoteUrl] ?? fallback;
}

export const images = {
  logo: imageFor("https://www.academiegastronomiemaroc.ma/Moroccan Culinary Academy Emblem.png"),
  hero: "/assets/optimized/Moroccan-Feast.jpg",
  heroAlt: imageFor("https://www.academiegastronomiemaroc.ma/moroccan-feast.png"),
  tagines: "/assets/optimized/tagine-trio.jpg",
  academy: imageFor("https://www.academiegastronomiemaroc.ma/Team.jpeg"),
  about: imageFor("https://www.academiegastronomiemaroc.ma/QuiSommesNous.jpg"),
  aboutTwo: "/assets/optimized/QuiSommes2.jpg",
  history: "/assets/optimized/rustic-moroccan-cooking.jpg",
  signature: imageFor("https://www.academiegastronomiemaroc.ma/signature.jpeg"),
  president: imageFor("https://i.ibb.co/qYdS63vq/Whats-App-Image-2025-04-19-at-20-54-27.jpg"),
  activity: imageFor("https://www.academiegastronomiemaroc.ma/challenge.jpg"),
  assembly: imageFor("https://www.academiegastronomiemaroc.ma/AssembleGeneral.jpg"),
  amazigh: "/assets/optimized/AmazighYear.jpg",
  dinner: imageFor("https://www.academiegastronomiemaroc.ma/Moroccan-Food.jpg"),
  conference: "/assets/optimized/Conference.jpg",
  coverage: imageFor("https://www.academiegastronomiemaroc.ma/Couverture.jpeg"),
  tajineContest: imageFor("https://www.academiegastronomiemaroc.ma/meilleurTajine.jpg"),
  banner: imageFor("https://www.academiegastronomiemaroc.ma/Banner.png"),
  dining: "/assets/optimized/DinnerMarocaine.jpg",
  publication: imageFor("https://www.academiegastronomiemaroc.ma/Publication.jpg"),
  cooking: imageFor("https://www.academiegastronomiemaroc.ma/Cooking.jpg"),
  partnership: imageFor("https://www.academiegastronomiemaroc.ma/Patronariat.jpg"),
  formation: imageFor("https://www.academiegastronomiemaroc.ma/Formation.jpg"),
  dishKefta: imageFor("https://www.magazinemarocaindegastronomie.com/qwe.jpg"),
  dishPastilla: "/assets/optimized/DSC06024.jpg",
  dishPoulet: imageFor("https://www.magazinemarocaindegastronomie.com/featured-5.jpg"),
  magazineOne: "/assets/optimized/DSC05932.jpg",
  magazineTwo: imageFor("https://www.magazinemarocaindegastronomie.com/ho.jpg"),
  magazineThree: "/assets/optimized/DSC06023.jpg",
  rasElHanout: imageFor("https://i0.wp.com/tandysinclair.com/wp-content/uploads/2011/01/Ras-El-Hanout.jpg?ssl=1"),
};

export function getSource(url: string) {
  return sources.find((page) => page.url === url);
}

function cleanedLines(url: string, title: string, options: { skipByline?: boolean } = {}) {
  const page = getSource(url);
  if (!page) return [];
  const noisy = new Set([
    "Galerie",
    "L'Académie",
    "Activités",
    "Actualités",
    "Précédent",
    "Suivant",
    "Rechercher",
    "1",
    "2",
    "3",
  ]);
  let lines = page.lines.filter((line) => !noisy.has(line));
  while (lines[0] === title || lines[0] === page.title || lines[0]?.toLowerCase() === title.toLowerCase()) {
    lines = lines.slice(1);
  }
  if (options.skipByline) {
    lines = lines.filter((line) => !line.startsWith("Par ") && !line.startsWith("Email:") && !line.startsWith("Site Web:"));
  }
  return lines;
}

export const pillars = [
  {
    title: "Préserver",
    text: "Sauvegarder le patrimoine culinaire marocain et ses traditions ancestrales.",
  },
  {
    title: "Promouvoir",
    text: "Faire rayonner la gastronomie marocaine à l'échelle nationale et internationale.",
  },
  {
    title: "Innover",
    text: "Encourager la créativité et l'innovation dans la cuisine marocaine contemporaine.",
  },
];

export const academyObjectives = [
  "Préserver et valoriser le patrimoine culinaire marocain",
  "Promouvoir la gastronomie marocaine à l'échelle nationale et internationale",
  "Encourager la recherche et la documentation sur les traditions culinaires marocaines",
  "Soutenir la formation et l'excellence dans les métiers de la gastronomie",
  "Favoriser les échanges culturels autour de la gastronomie",
  "Contribuer au développement du tourisme gastronomique au Maroc",
];

export const activities = [
  {
    title: "Compétition Culinaire",
    image: images.activity,
    text: "Organisation de compétitions culinaires palpitantes où des chefs passionnés s'affrontent pour créer des plats exceptionnels, célébrant l'art de la cuisine marocaine dans une ambiance dynamique et conviviale.",
  },
  {
    title: "L'Assemblée Générale",
    image: images.assembly,
    text: "Organisation de l'Assemblée Générale annuelle, un événement clé réunissant les membres pour faire le point sur les actions réalisées, discuter des projets à venir et prendre des décisions stratégiques pour l'avenir de l'organisation.",
  },
  {
    title: "Nouvel An Amazigh",
    image: images.amazigh,
    text: "Célébration du Nouvel An Amazigh, une occasion de rendre hommage à la riche culture berbère à travers des traditions festives, des mets typiques et des activités culturelles.",
  },
  {
    title: "Conférences & Débats",
    image: images.conference,
    text: "Des rencontres et échanges sont organisés autour de thématiques liées à la gastronomie et au patrimoine culinaire marocain.",
  },
  {
    title: "Publications",
    image: images.publication,
    text: "L'Académie édite des ouvrages et guides valorisant la cuisine marocaine et ses traditions.",
  },
  {
    title: "Formation & Transmission",
    image: images.formation,
    text: "Des ateliers et masterclasses sont proposés pour transmettre les techniques et savoirs de la cuisine marocaine traditionnelle.",
  },
];

export const news = [
  {
    title: "Grand dîner annuel de l'Académie Marocaine de Gastronomie",
    date: "22 janvier 2023",
    category: "Événements",
    image: images.dinner,
    excerpt: "L'Académie a organisé son dîner au Palais Zahia, à l'occasion du nouvel an Amazigh.",
  },
  {
    title: "Conférence sur l'avenir de la gastronomie marocaine",
    date: "18 septembre 2023",
    category: "Événements",
    image: images.conference,
    excerpt: "Une journée d'échanges et de débats sur les enjeux et perspectives de la gastronomie marocaine contemporaine.",
  },
  {
    title: "Lancement du programme de documentation des recettes traditionnelles",
    date: "15 mars 2023",
    category: "Projets",
    image: images.coverage,
    excerpt: "L'Académie initie un vaste projet de collecte et de documentation des recettes traditionnelles en voie de disparition.",
  },
  {
    title: "À la découverte du meilleur tajine lors d'un concours organisé à Tanger",
    date: "15 mars 2023",
    category: "Actualités",
    image: images.tajineContest,
    excerpt: "Découverte de talents et enrichissement de la culture et des traditions culinaires marocaines.",
  },
];

export const dishes: Dish[] = [
  {
    path: "/plats/tajine-kefta",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/",
    title: "Tajine de boulettes de kefta (viande hachée)",
    date: "January 24, 2024",
    author: "Palais Zahia",
    image: images.dishKefta,
    excerpt:
      "Les boulettes de viande hachée sont généralement cuites dans une sauce tomate parfumée aux épices comme le cumin, le paprika, le curcuma, et le gingembre. On peut également y ajouter des herbes fraîches comme le persil et la coriandre.",
  },
  {
    path: "/plats/pastilla-fruits-de-mer",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/",
    title: "Pastilla aux fruits de mer : une élégance culinaire marocaine",
    date: "feburary 26, 2024",
    author: "Palais Zahia",
    image: images.dishPastilla,
    excerpt:
      "Pastilla aux fruits de mer est un plat emblématique de la gastronomie marocaine, souvent réservé aux grandes occasions. Composée de feuilles croustillantes farcies d'un mélange raffiné de fruits de mer et de vermicelles parfumés aux épices.",
  },
  {
    path: "/plats/tajine-poulet",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/",
    title: "Tajine de poulet",
    date: "aout 27, 2024",
    author: "Palais Zahia",
    image: images.dishPoulet,
    excerpt:
      "Ce Tajine savoureux combine du poulet tendre, mijoté dans une sauce parfumée au citron confit, aux olives vertes, et aux épices typiques comme le gingembre et le curcuma.",
  },
];

export const articles: Article[] = [
  {
    path: "/gastronomie-marocaine/patrimoine-gastronomique",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/gastronomie.html",
    title: "Le patrimoine gastronomique marocain, levier du développement du tourisme culturel",
    category: "Gastronomie Marocaine",
    magazineCategory: "Tourisme",
    author: "Salah Chakor",
    hero: images.magazineOne,
    summary:
      "Une réflexion sur la notion de patrimoine gastronomique marocain, son lien avec le tourisme culturel, la formation professionnelle et la sauvegarde des savoir-faire.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/gastronomie.html", "Le patrimoine gastronomique marocain, levier du développement du tourisme culturel", { skipByline: true }),
  },
  {
    path: "/gastronomie-marocaine/cuisine-arrieres-grands-meres",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/cuisine.html",
    title: "La cuisine de nos arrières grands-mères constitue l'art culinaire du terroir",
    category: "Gastronomie Marocaine",
    magazineCategory: "Cuisine traditionnelle",
    author: "Salah Chakor",
    hero: images.magazineTwo,
    summary:
      "Un texte consacré à la cuisine du terroir, à la mémoire des préparations familiales et à la préservation d'un patrimoine culinaire transmis par les générations.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/cuisine.html", "LA CUISINE DE NOS ARRIERES GRANDS-MERES CONSTITUE L'ART CULINAIRE DU TERROIR", { skipByline: true }),
  },
  {
    path: "/gastronomie-marocaine/famille-marocaine-table",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/familles.html",
    title: "La famille marocaine à table",
    category: "Gastronomie Marocaine",
    magazineCategory: "Cuisine traditionnelle",
    author: "Salah Chakor",
    hero: images.magazineThree,
    summary:
      "Une lecture des repas familiaux marocains, de leur rôle social, des repas quotidiens aux repas de cérémonies.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/familles.html", "La famille marocaine à table", { skipByline: true }),
  },
  {
    path: "/gastronomie-marocaine/anthropologie",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/anthropologie.html",
    title: "L'hospitalité : acte naturel, social et universel et son rapport avec la gastronomie",
    category: "Gastronomie Marocaine",
    magazineCategory: "Anthropologie",
    author: "Dr. Salah Chakor",
    hero: images.dining,
    summary:
      "Un article sur l'hospitalité, l'accueil, la convivialité et leurs rapports avec la gastronomie.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/anthropologie.html", "L'hospitalité : acte naturel, social et universel et son rapport avec la gastronomie", { skipByline: true }),
  },
  {
    path: "/gastronomie-marocaine/science-alimentation",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/alimentation.html",
    title: "Le rôle de l'alimentation dans le psychisme de l'homme",
    category: "Gastronomie Marocaine",
    magazineCategory: "Alimentation",
    author: "Salah Chakor",
    hero: images.cooking,
    summary:
      "Un texte sur le besoin alimentaire, les sensations liées à l'alimentation, la mémoire affective et l'impact psychologique de la nourriture.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/alimentation.html", "Le rôle de l'alimentation dans le psychisme de l'homme", { skipByline: true }),
  },
  {
    path: "/gastronomie-marocaine/ras-el-hanout",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/epices.html",
    title: "Ras-El-Hanout",
    category: "Gastronomie Marocaine",
    magazineCategory: "Épices",
    author: "Dr Salah Chakor",
    hero: images.rasElHanout,
    summary:
      "Épices emblématiques et magiques de la gastronomie marocaine, composition, histoire et usages du Ras-El-Hanout.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/epices.html", "Ras-El-Hanout", { skipByline: true }),
  },
  {
    path: "/gastronomie-marocaine/arts-cultures-tourisme",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/Art.html",
    title: "Arts et cultures au service d'un tourisme local durable",
    category: "Gastronomie Marocaine",
    magazineCategory: "Tourisme",
    author: "Salah Chakor",
    hero: images.partnership,
    summary:
      "Une réflexion sur les traditions, les arts populaires, le tourisme durable, le tourisme de niche et la formation.",
    lines: cleanedLines("https://www.magazinemarocaindegastronomie.com/Art.html", "Arts et cultures au service d'un tourisme local durable", { skipByline: true }),
  },
];

export const sourceOnlyEntries = [
  {
    path: "/gastronomie-marocaine/histoire-authenticite",
    title: "Histoire & authenticité",
    categoryKey: "histoire",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/",
    image: images.tagines,
    description:
      "Rubrique détectée dans l'index du Magazine sous le titre « L'histoire et l'authenticité ». Aucun corps d'article distinct n'était accessible automatiquement dans les pages sources explorées.",
  },
  {
    path: "/gastronomie-marocaine/tourisme",
    title: "Tourisme et gastronomie",
    categoryKey: "tourisme",
    sourceUrl: "https://www.magazinemarocaindegastronomie.com/Tourisme.html",
    image: images.magazineOne,
    description:
      "Rubrique tourisme du Magazine. Elle renvoie vers le contenu long sur le patrimoine gastronomique marocain comme levier du développement du tourisme culturel.",
  },
];

export const gastronomyIndex = [
  ...sourceOnlyEntries,
  {
    path: "/gastronomie-marocaine/patrimoine-gastronomique",
    title: "Patrimoine gastronomique",
    description: articles[0].summary,
    image: articles[0].hero,
    categoryKey: "patrimoine",
  },
  {
    path: "/gastronomie-marocaine/cuisine-arrieres-grands-meres",
    title: "Cuisine de nos arrières grands-mères",
    description: articles[1].summary,
    image: articles[1].hero,
    categoryKey: "cuisine",
  },
  {
    path: "/gastronomie-marocaine/famille-marocaine-table",
    title: "La famille marocaine à table",
    description: articles[2].summary,
    image: articles[2].hero,
    categoryKey: "famille",
  },
  {
    path: "/gastronomie-marocaine/anthropologie",
    title: "Anthropologie de la gastronomie",
    description: articles[3].summary,
    image: articles[3].hero,
    categoryKey: "anthropologie",
  },
  {
    path: "/gastronomie-marocaine/science-alimentation",
    title: "Science de l'alimentation",
    description: articles[4].summary,
    image: articles[4].hero,
    categoryKey: "alimentation",
  },
  {
    path: "/gastronomie-marocaine/ras-el-hanout",
    title: "Épices / Ras-El-Hanout",
    description: articles[5].summary,
    image: articles[5].hero,
    categoryKey: "epices",
  },
];

export const partners = [
  imageFor("https://www.academiegastronomiemaroc.ma/Part!.jpeg"),
  imageFor("https://www.academiegastronomiemaroc.ma/Part2.jpeg"),
  imageFor("https://www.academiegastronomiemaroc.ma/part3.jpeg"),
  imageFor("https://www.academiegastronomiemaroc.ma/Part3.png"),
  imageFor("https://www.academiegastronomiemaroc.ma/Part5.jpeg"),
  imageFor("https://www.academiegastronomiemaroc.ma/Part6.jpeg"),
];

export const gallery = [
  { title: "Dîner de Gala 2023", category: "Événements", image: images.dinner },
  { title: "Tagine Traditionnel", category: "Plats", image: images.tagines },
  { title: "Épices Marocaines", category: "Produits", image: images.rasElHanout },
  { title: "Conférence Culinaire", category: "Événements", image: images.conference },
  { title: "Démonstration Culinaire", category: "Événements", image: imageFor("https://www.academiegastronomiemaroc.ma/CookingClass.jpg") },
  { title: "Membres de l'Académie", category: "Personnalités", image: images.academy },
  { title: "Pains Marocains", category: "Plats", image: imageFor("https://www.academiegastronomiemaroc.ma/CookingClass2.jpg") },
  { title: "Cours de Cuisine", category: "Événements", image: imageFor("https://www.academiegastronomiemaroc.ma/CookingClass3.jpg") },
  { title: "Produits et publications", category: "Produits", image: images.publication },
  { title: "Palais Zahia", category: "Événements", image: imageFor("https://www.academiegastronomiemaroc.ma/Restaurant palais zahia_96-1.JPG") },
  { title: "Portrait du Président", category: "Personnalités", image: images.president },
  { title: "Magazine", category: "Gastronomie", image: images.magazineThree },
];

export const bookImages = [
  imageFor("https://www.magazinemarocaindegastronomie.com/livres/IMG-20250313-WA0002.jpg"),
  imageFor("https://www.magazinemarocaindegastronomie.com/livres/IMG-20250313-WA0003.jpg"),
  imageFor("https://www.magazinemarocaindegastronomie.com/livres/IMG-20250313-WA0004.jpg"),
  imageFor("https://www.magazinemarocaindegastronomie.com/livres/IMG-20250313-WA0005.jpg"),
  imageFor("https://www.magazinemarocaindegastronomie.com/livres/IMG-20250313-WA0006.jpg"),
];

export const pages: PageEntry[] = [
  {
    path: "/academie",
    title: "L'Académie",
    description: "Fondation Académie Marocaine de la Gastronomie, mission, histoire, président, partenaires et activités.",
    type: "academy",
  },
  {
    path: "/academie/presentation",
    title: "Présentation",
    description: "Présentation et mission de l'Académie Marocaine de Gastronomie.",
    type: "source",
    sourceUrl: "https://www.academiegastronomiemaroc.ma/academie/qui-sommes-nous",
    image: images.about,
  },
  {
    path: "/academie/notre-histoire",
    title: "Notre histoire",
    description: "L'évolution de l'Académie Marocaine de Gastronomie depuis sa création.",
    type: "source",
    sourceUrl: "https://www.academiegastronomiemaroc.ma/academie/notre-histoire",
    image: images.history,
  },
  {
    path: "/academie/president",
    title: "Mot du Président",
    description: "Message de Dr. Salah Chakor, Président Fondateur.",
    type: "president",
    sourceUrl: "https://www.academiegastronomiemaroc.ma/mot-du-president",
    image: images.president,
  },
  {
    path: "/academie/membres-du-bureau",
    title: "Membres du bureau",
    description: "Structure de gouvernance de l'Académie, à partir des éléments accessibles sur le site source.",
    type: "members",
    sourceUrl: "https://www.academiegastronomiemaroc.ma/academie/qui-sommes-nous",
    image: images.academy,
  },
  {
    path: "/academie/partenaires",
    title: "Partenaires",
    description: "Partenaires de l'Académie Marocaine de Gastronomie.",
    type: "partners",
    image: images.academy,
  },
  {
    path: "/gastronomie-marocaine",
    title: "Gastronomie Marocaine",
    description: "Index éditorial de la gastronomie marocaine, de son patrimoine, de ses épices, de sa cuisine familiale et de son lien au tourisme.",
    type: "gastronomy",
  },
  ...sourceOnlyEntries.map((entry) => ({
    path: entry.path,
    title: entry.title,
    description: entry.description,
    type: "category" as const,
    sourceUrl: entry.sourceUrl,
    image: entry.image,
    categoryKey: entry.categoryKey,
  })),
  ...articles.map((article) => ({
    path: article.path,
    title: article.title,
    description: article.summary,
    type: "article" as const,
    article,
  })),
  {
    path: "/plats",
    title: "Plats Marocains",
    description: "Inventaire éditorial des plats marocains migrés depuis le Magazine.",
    type: "dishes",
  },
  ...dishes.map((dish) => ({
    path: dish.path,
    title: dish.title,
    description: dish.excerpt,
    type: "dish" as const,
    dish,
  })),
  {
    path: "/magazine",
    title: "Magazine Marocain de la Gastronomie",
    description: "Explorez des recettes, des traditions culinaires et bien plus encore.",
    type: "magazine",
  },
  {
    path: "/activites",
    title: "Activités",
    description: "Activités organisées par l'Académie Marocaine de Gastronomie.",
    type: "activities",
  },
  {
    path: "/actualites",
    title: "Actualités",
    description: "Actualités et événements de l'Académie Marocaine de Gastronomie.",
    type: "news",
  },
  {
    path: "/galerie",
    title: "Galerie",
    description: "Galerie d'images des activités et du patrimoine culinaire marocain.",
    type: "gallery",
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Coordonnées et formulaire de contact de l'Académie.",
    type: "contact",
  },
  {
    path: "/mot-du-president",
    title: "Mot du Président",
    description: "Ancienne adresse conservée pour le message de Dr. Salah Chakor.",
    type: "president",
    sourceUrl: "https://www.academiegastronomiemaroc.ma/mot-du-president",
    image: images.president,
  },
];

export function pageByPath(path: string) {
  const normalized = path === "" ? "/" : `/${path.replace(/^\/|\/$/g, "")}`;
  return pages.find((page) => page.path === normalized);
}

export function articleByPath(path: string) {
  return articles.find((article) => article.path === path);
}

export function relatedArticles(article: Article) {
  return articles.filter((item) => item.path !== article.path).slice(0, 3);
}

export const nav = [
  { label: "Accueil", href: "/" },
  {
    label: "L'Académie",
    href: "/academie",
    items: [
      { label: "Présentation", href: "/academie/presentation" },
      { label: "Notre histoire", href: "/academie/notre-histoire" },
      { label: "Mot du Président", href: "/academie/president" },
      { label: "Membres du bureau", href: "/academie/membres-du-bureau" },
      { label: "Partenaires", href: "/academie/partenaires" },
    ],
  },
  {
    label: "Gastronomie Marocaine",
    href: "/gastronomie-marocaine",
    items: gastronomyIndex.map((item) => ({ label: item.title, href: item.path })),
  },
  {
    label: "Plats Marocains",
    href: "/plats",
    items: dishes.map((dish) => ({ label: dish.title.replace(" (viande hachée)", ""), href: dish.path })),
  },
  { label: "Magazine", href: "/magazine" },
  { label: "Rapports", href: "/rapports" },
  { label: "Activités", href: "/activites" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns = [
  {
    title: "L'Académie",
    links: [
      { label: "Présentation", href: "/academie/presentation" },
      { label: "Notre histoire", href: "/academie/notre-histoire" },
      { label: "Président", href: "/academie/president" },
      { label: "Membres", href: "/academie/membres-du-bureau" },
      { label: "Partenaires", href: "/academie/partenaires" },
    ],
  },
  {
    title: "Gastronomie",
    links: [
      { label: "Patrimoine", href: "/gastronomie-marocaine/patrimoine-gastronomique" },
      { label: "Cuisine", href: "/gastronomie-marocaine/cuisine-arrieres-grands-meres" },
      { label: "Anthropologie", href: "/gastronomie-marocaine/anthropologie" },
      { label: "Tourisme", href: "/gastronomie-marocaine/tourisme" },
      { label: "Épices", href: "/gastronomie-marocaine/ras-el-hanout" },
    ],
  },
  {
    title: "Explorer",
    links: [
      { label: "Magazine", href: "/magazine" },
      { label: "Activités", href: "/activites" },
      { label: "Actualités", href: "/actualites" },
      { label: "Galerie", href: "/galerie" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
