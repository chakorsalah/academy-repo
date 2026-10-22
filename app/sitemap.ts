import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
import { publishedArticles,publishedReports,publishedPages,pagePath } from '@/lib/cms';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const [articles,reports,pages]=await Promise.all([publishedArticles(),publishedReports(),publishedPages()]);const paths=new Set([...pages.map(pagePath),...articles.map(a=>a.path),...reports.map(r=>`/rapports/${r.slug}`)]);return [...paths].map(path=>({url:`${site.url}${path==='/'?'':path}/`,changeFrequency:'weekly',priority:path==='/'?1:0.7}));}
