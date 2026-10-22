import { notFound } from 'next/navigation';
import { ManagedPage } from '@/components/managed-page';
import { publishedPageAt, mediaURL } from '@/lib/cms';
export const dynamic='force-dynamic';
export async function generateMetadata(){const page=await publishedPageAt('/');return {title:page?.seoTitle||'Accueil',description:page?.seoDescription||page?.summary,alternates:{canonical:'/'},openGraph:{title:page?.seoTitle||page?.title,description:page?.seoDescription||page?.summary,images:page?[{url:mediaURL(page.cover)||page.legacyImage||'/favicon.svg'}]:[]}};}
export default async function Page(){const doc=await publishedPageAt('/');if(!doc)notFound();return <ManagedPage doc={doc}/>;}
