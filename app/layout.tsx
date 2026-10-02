import type { Metadata } from "next";
import { Header, Footer } from "@/components/site-shell";
import { site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fondation Académie Marocaine de la Gastronomie",
    url: site.url,
    logo: `${site.url}/assets/source/Moroccan-Culinary-Academy-Emblem.png`,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tanger",
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
