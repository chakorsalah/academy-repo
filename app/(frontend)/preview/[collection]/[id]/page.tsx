import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { cms, articleView } from '@/lib/cms';
import { ArticlePageView } from '@/components/page-renderers';
import { ManagedPage } from '@/components/managed-page';
import { ContentView } from '@/components/cms-public';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Aperçu privé', robots: { index: false, follow: false } };
export default async function Preview({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!['articles', 'reports', 'pages'].includes(collection) || !/^\d+$/.test(id)) notFound();
  const payload = await cms();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect('/admin/login');
  const options = { id: Number(id), draft: true, overrideAccess: false, user, depth: 1, disableErrors: true };
  let view;
  if (collection === 'articles') { const doc = await payload.findByID({ ...options, collection: 'articles' }); if (!doc) notFound(); view = <ArticlePageView article={articleView(doc)} />; }
  else if (collection === 'reports') { const doc = await payload.findByID({ ...options, collection: 'reports' }); if (!doc) notFound(); view = <ContentView doc={doc} report />; }
  else { const doc = await payload.findByID({ ...options, collection: 'pages' }); if (!doc) notFound(); view = <ManagedPage doc={doc} />; }
  return <><div className="cms-preview-banner">Aperçu privé · Les modifications non publiées sont visibles uniquement par votre équipe. <a href={`/admin/collections/${collection}/${id}`}>Revenir à l’éditeur ↗</a></div>{view}</>;
}
