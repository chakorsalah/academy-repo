import type { Metadata } from "next";
import { HomePage } from "@/components/page-renderers";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accueil",
  description: site.description,
};

export default function Page() {
  return <HomePage />;
}
