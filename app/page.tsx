import type { Metadata } from "next";
import { HomePage } from "@/components/page-renderers";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accueil",
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} · Accueil`,
    description: site.description,
    url: "/",
    type: "website",
    images: [{ url: "/assets/optimized/Moroccan-Feast.jpg", alt: "Table de gastronomie marocaine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Accueil`,
    description: site.description,
    images: ["/assets/optimized/Moroccan-Feast.jpg"],
  },
};

export default function Page() {
  return <HomePage />;
}
