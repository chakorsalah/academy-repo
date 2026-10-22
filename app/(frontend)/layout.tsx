import type { Metadata } from "next";
import { Header, Footer } from "@/components/site-shell";
import { site } from "@/lib/content";
import { publishedSettings, mediaURL } from "@/lib/cms";
import "./globals.css";

const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "fr_MA",
    images: [{ url: "/assets/optimized/Moroccan-Feast.jpg", alt: "Table de gastronomie marocaine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/assets/optimized/Moroccan-Feast.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await publishedSettings();
  return { ...baseMetadata, title: { default: settings.brandName, template: `%s · ${settings.brandName}` }, description: settings.tagline };
}
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await publishedSettings();
  const logo = mediaURL(settings.logo) || '/assets/source/Moroccan-Culinary-Academy-Emblem.png';
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName,
    url: site.url,
    logo: logo.startsWith("http") ? logo : `${site.url}${logo}`,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressCountry: "MA",
    },
  };

  return (
    <html lang="fr" className="h-full">
      <body>
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
