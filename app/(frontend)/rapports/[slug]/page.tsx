import { notFound } from 'next/navigation';
import { publishedReports } from '@/lib/cms';
import { ContentView } from '@/components/cms-public';
export const dynamic = 'force-dynamic';
type Args = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Args) {
  const { slug } = await params;
  const doc = (await publishedReports()).find(r => r.slug === slug);
  return { title: doc?.seoTitle || doc?.title || 'Rapport introuvable', description: doc?.seoDescription || doc?.summary, alternates: { canonical: `/rapports/${slug}/` } };
}
export default async function Page({ params }: Args) {
  const { slug } = await params;
  const doc = (await publishedReports()).find(r => r.slug === slug);
  if (!doc) notFound();
  return <ContentView doc={doc} report />;
}
