import { notFound } from 'next/navigation';
import { publishedPageAt } from '@/lib/cms';
import { ManagedPage } from '@/components/managed-page';
export const dynamic='force-dynamic';
export async function generateMetadata(){const doc=await publishedPageAt('/rapports');return {title:doc?.seoTitle||doc?.title,description:doc?.seoDescription||doc?.summary};}
export default async function Page(){const doc=await publishedPageAt('/rapports');if(!doc)notFound();return <ManagedPage doc={doc}/>;}
