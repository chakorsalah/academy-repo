import type { Payload, User } from 'payload';
export async function Dashboard({ payload, user }: { payload: Payload; user: User }) {
  if (!user) return null;
  const [articles, reports, drafts, media, recent] = await Promise.all([
    payload.count({ collection: 'articles', overrideAccess: false, user }),
    payload.count({ collection: 'reports', overrideAccess: false, user }),
    payload.find({ collection: 'articles', limit: 1, draft: true, where: { _status: { equals: 'draft' } }, overrideAccess: false, user }),
    payload.count({ collection: 'media', overrideAccess: false, user }),
    payload.find({ collection: 'articles', limit: 4, sort: '-updatedAt', draft: true, overrideAccess: false, user }),
  ]);
  return <section className="cms-dashboard">
    <div className="cms-welcome"><div><p className="cms-eyebrow">ACADÉMIE · MAGAZINE · PATRIMOINE</p><h1>Bonjour, {user.name?.split(' ')[0] || 'et bienvenue'}.</h1><p>Une histoire à raconter, un savoir à transmettre ?<br />Votre prochaine publication commence ici.</p><div className="cms-actions"><a className="cms-primary" href="/admin/collections/articles/create">＋ Rédiger un article</a><a className="cms-secondary" href="/admin/assistant">✧ Assistant éditorial</a><a className="cms-secondary" href="/admin/collections/pages">Gérer les pages ↗</a></div></div><div className="cms-welcome-art" aria-hidden="true">✧<span>PRÉSERVER<br />PROMOUVOIR<br />TRANSMETTRE</span></div></div>
    <div className="cms-stats">{[
      ['Articles', articles.totalDocs, '/admin/collections/articles', 'Votre magazine prend vie'],
      ['Rapports', reports.totalDocs, '/admin/collections/reports', 'Bilans & comptes rendus'],
      ['Brouillons d’articles', drafts.totalDocs, '/admin/collections/articles?where[_status][equals]=draft', 'À reprendre à votre rythme'],
      ['Fichiers', media.totalDocs, '/admin/collections/media', 'Images & documents'],
    ].map(([label, value, href, caption]) => <a href={String(href)} className="cms-stat" key={label}><span>{label} ↗</span><strong>{value}</strong><small>{caption}</small></a>)}</div>
    <div className="cms-bottom"><div className="cms-recent"><div className="cms-section-label"><h2>Derniers articles</h2><a href="/admin/collections/articles">Tout voir ↗</a></div>{recent.docs.map(doc => <a className="cms-recent-row" href={`/admin/collections/articles/${doc.id}`} key={doc.id}><div><strong>{doc.title}</strong><small>{doc.category} · {new Date(doc.updatedAt).toLocaleDateString('fr-MA')}</small></div><span className={`cms-status ${doc._status === 'published' ? 'published' : ''}`}>{doc._status === 'published' ? 'Publié' : 'Brouillon'}</span></a>)}{!recent.docs.length && <p>Votre premier article trouvera sa place ici.</p>}</div><aside className="cms-guide"><span className="cms-eyebrow">LE FIL ÉDITORIAL</span><h2>Du brouillon<br />à la publication.</h2><ol><li><strong>Rédigez librement.</strong><span>Ajoutez votre texte, une couverture et une rubrique.</span></li><li><strong>Prenez le temps de relire.</strong><span>Enregistrez un brouillon et ouvrez l’aperçu.</span></li><li><strong>Partagez votre histoire.</strong><span>Cliquez sur Publier : le site est à jour.</span></li></ol></aside></div>
  </section>;
}
