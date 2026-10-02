import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section>
        <p className="kicker">Page introuvable</p>
        <h1>Cette page n&apos;existe plus ou a changé d&apos;adresse.</h1>
        <p>
          Retrouvez les contenus de l&apos;Académie, les articles du Magazine et les plats marocains
          depuis les rubriques principales.
        </p>
        <div>
          <Link href="/" className="button primary">
            Accueil
          </Link>
          <Link href="/gastronomie-marocaine" className="button outline">
            Gastronomie Marocaine
          </Link>
          <Link href="/academie" className="button outline">
            L&apos;Académie
          </Link>
        </div>
      </section>
    </main>
  );
}
