import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...pages.map((page) => ({
      url: `${site.url}${page.path}/`,
      lastModified: new Date(),
      changeFrequency: page.type === "article" ? ("monthly" as const) : ("weekly" as const),
      priority: page.type === "article" ? 0.7 : 0.8,
    })),
  ];

  return routes;
}
