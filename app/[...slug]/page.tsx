import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/page-renderers";
import { pageByPath, pages, site } from "@/lib/content";

type DynamicParams = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return pages.map((page) => ({
    slug: page.path.replace(/^\//, "").split("/"),
  }));
}

export async function generateMetadata({ params }: DynamicParams): Promise<Metadata> {
  const { slug } = await params;
  const page = pageByPath(slug.join("/"));
  if (!page) {
    return {
      title: site.name,
      description: site.description,
    };
  }
  const image = page.image ?? page.article?.hero ?? page.dish?.image;
  const canonical = `${page.path}/`;
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${page.title} · ${site.shortName}`,
      description: page.description,
      url: canonical,
      type: page.type === "article" ? "article" : "website",
      images: image ? [{ url: image, alt: page.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${page.title} · ${site.shortName}`,
      description: page.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: DynamicParams) {
  const { slug } = await params;
  const page = pageByPath(slug.join("/"));
  if (!page) notFound();
  return <PageRenderer page={page} />;
}
