import type { Metadata } from "next";
import { Header, Footer } from "@/components/site-shell";
import { site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.academiegastronomiemaroc.ma"),
  title: {
    default: site.name,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "fr_MA",
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
