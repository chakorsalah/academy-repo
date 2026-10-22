# Espace éditorial de l’Académie

## Ouvrir et configurer le compte

- Site local : http://localhost:3001
- Administration : http://localhost:3001/admin
- Au premier accès, choisissez votre nom, votre email et un mot de passe unique. Le premier compte est administrateur. Cette inscription se ferme automatiquement dès que le compte existe.
- Pour un nouveau rédacteur : Administration → Équipe → Créer. Seuls les administrateurs gèrent les comptes et suppriment les contenus.

## Publier un article

1. Ouvrez Articles → Créer. Ajoutez titre, résumé et contenu avec l’éditeur visuel.
2. Choisissez une couverture dans la Médiathèque, une rubrique et un auteur.
3. L’adresse se génère depuis le titre et reste modifiable. Après publication, évitez de la changer pour conserver les liens existants.
4. Enregistrez un brouillon, puis ouvrez Aperçu. L’aperçu exige une connexion.
5. Cliquez sur Publier : l’article apparaît dans les sections de flux du Magazine, de l’accueil et de l’index Gastronomie. Les versions permettent de retrouver une rédaction précédente.
6. Une modification enregistrée comme brouillon laisse la version publiée visible. Dépublier retire le contenu des pages publiques et du sitemap.

Les sept articles existants ont été importés automatiquement, avec leurs textes, images et adresses. Toutes les pages publiques sont également modifiables. Le marqueur d’import est conservé en base : les éléments supprimés ne sont pas recréés au redémarrage.

## Rapports, pages et fichiers

- Rapports : titre, résumé, texte et PDF facultatif, année et couverture. Les rapports publiés apparaissent sous /rapports.
- Bibliothèque : chaque livre a un titre, un auteur, une couverture, une langue, une année et un PDF téléversé (ou, à défaut, un lien externe https comme un dossier Google Drive). Un livre publié doit avoir l’un des deux. Les livres publiés apparaissent sous /bibliotheque, triés par « Ordre d’affichage ». Une section « Articles / rapports » réglée sur « Livres (bibliothèque) » affiche les livres sur n’importe quelle page.
- Pages : pages libres sous /pages/adresse, ajoutées au menu de l’Académie. Les pages importées conservent leurs adresses historiques.
- Médiathèque : JPEG, PNG, WebP et PDF, jusqu’à 100 Mo. Ajoutez une description pour l’accessibilité. Les fichiers de cette bibliothèque sont publics dès leur téléversement ; les brouillons de texte restent privés.
- Toutes les pages de la vitrine, y compris l’accueil, plats, activités, actualités, galerie, membres, partenaires et contact, se gèrent désormais dans Pages du site.
- Chaque page dispose d’une couverture, d’un surtitre, de boutons, d’un contenu et de sections ordonnables : texte, texte + image, cartes, galerie, flux d’articles/rapports, bandeau, partenaires et contact.
- Le menu, le logo, les coordonnées, les horaires, les réseaux sociaux et le footer se gèrent dans Réglages du site (administrateurs uniquement). Les réglages possèdent également des brouillons ; publiez-les pour les afficher sur le site.
- Les cartes permettent de gérer les activités, actualités, membres et recettes. Les plats existants ont leur page dédiée. Ajoutez une page puis liez sa carte pour créer un nouveau détail.
- Les sections de flux affichent uniquement les articles/rapports publiés et peuvent être filtrées par rubrique. Les sections peuvent être masquées ou réordonnées.
- Le formulaire de contact prépare un email dans l’application email du visiteur ; il n’affiche pas de faux succès d’envoi.

## Assistant éditorial IA

Accès : /admin/assistant, ou « Modifier avec l’IA » dans chaque page, article et rapport.

1. Enregistrez vos modifications manuelles avant de lancer l’assistant.
2. Dans le chat général, sélectionnez de un à trois contenus ; dans un éditeur, le contenu courant est sélectionné automatiquement.
3. Décrivez votre demande en français, arabe ou darija. Vous pouvez demander une reformulation, une traduction, du SEO ou une réorganisation des sections.
4. Vérifiez la proposition avant/après. Aucune donnée n’est modifiée à cette étape.
5. Cliquez sur Enregistrer en brouillon. L’opération vérifie que personne n’a modifié les contenus entre-temps, respecte les verrous du CMS et enregistre les changements sélectionnés dans une transaction.
6. Ouvrez l’aperçu privé, relisez dans l’éditeur puis publiez manuellement. L’éditeur courant est rechargé automatiquement après application pour afficher les valeurs du nouveau brouillon. Depuis le chat général, ouvrez les liens de l’éditeur pour reprendre la saisie.

L’assistant ne peut pas publier, supprimer, gérer les comptes, changer les adresses ni modifier les réglages globaux. Les propositions expirent après dix minutes, appartiennent à leur auteur et ne sont plus réutilisables après application. Maximum dix demandes par utilisateur sur dix minutes dans un processus serveur ; prévoir un compteur partagé si le site utilise plusieurs instances.

### Activation ultérieure

L’intégration est préparée sans clé active, comme demandé. Ajoutez côté serveur (jamais dans une variable NEXT_PUBLIC) :

```dotenv
OPENAI_API_KEY=<votre clé API OpenAI>
OPENAI_MODEL=gpt-4.1-mini
```

Puis redémarrez le serveur. Les appels API nécessitent un projet OpenAI configuré pour l’usage souhaité. Sans clé, le CMS manuel fonctionne et l’assistant affiche son état de configuration ; aucune réponse IA n’est fabriquée.

Le serveur utilise Responses API avec un outil de proposition strict et `store: false`. Seuls les contenus sélectionnés et les descriptions de trente médias récents sont transmis, sans comptes, mots de passe ou clé API dans le navigateur. Les valeurs renvoyées sont validées avant toute proposition. `contentText` conserve les paragraphes, titres et listes ; une réécriture peut simplifier les autres styles enrichis. Les textes rédigés par l’IA doivent être relus avant publication.

### Tests IA sans facturation

`npm run ai:test` vérifie les règles de validation, les signatures, l’expiration et la conversion de texte.

Pour tester tout le protocole, utilisez exclusivement une base et un dossier média jetables, un faux jeton et le fournisseur HTTP local :

```sh
node tests/mock-openai.mjs
# Autre terminal :
AI_TEST_MODE=true AI_TEST_ENDPOINT=http://127.0.0.1:4319/responses OPENAI_API_KEY=qa-not-a-real-key DATABASE_URL=file:/tmp/academie-ai-qa.db MEDIA_DIR=/tmp/academie-ai-qa-media NEXT_PUBLIC_SERVER_URL=http://localhost:3002 npm run dev -- --port 3002
# Autre terminal :
npm run cms:test
```

Ce fournisseur est simulé, ne génère aucun vrai contenu IA et n’appelle pas OpenAI. Son endpoint alternatif est accepté uniquement hors production et sur localhost. Ne configurez jamais AI_TEST_MODE dans l’environnement client réel. Les tests HTTP couvrent propositions, validation, brouillons, conflits, signatures, permissions, transactions par lot et publication manuelle. Les réponses réelles du modèle restent à vérifier après activation de la clé.

## Développement

Node.js 20.18.1+ ; configuration dans .env, exemple dans .env.example.

```sh
npm install
npm run dev -- --port 3001
npm run cms:types
npm run cms:importmap
npm run build
npm start -- --port 3001
```

La base locale est data/academie.db. Les uploads sont dans media/ (ou MEDIA_DIR). Ces données et .env sont exclus de Git. Conservez PAYLOAD_SECRET ; son remplacement invalide les sessions. NEXT_PUBLIC_SERVER_URL doit être l’URL réelle du serveur, port compris.

## Mise en production

Cette intégration exige un serveur Next.js avec stockage persistant : un simple export HTML ne suffit plus. Le site distant existant n’a pas été déployé ou modifié.

1. Configurer PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL en HTTPS et DATABASE_URL. Créer le dossier data ou utiliser un chemin absolu SQLite. Prévoir un disque persistant pour la base et MEDIA_DIR, avec sauvegardes régulières des deux.
2. Depuis un nouveau stockage vide, exécuter `npm run cms:migrate` avec NODE_ENV=production avant de démarrer le serveur. Les migrations versionnées créent le schéma initial ; l’import des contenus s’exécute au premier démarrage.
3. Exécuter `npm run build`, puis `npm start`. Créer le premier administrateur pendant le déploiement privé, avant de rendre le site accessible au public.
4. Configurer SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS et SMTP_FROM pour envoyer les emails de réinitialisation du mot de passe. Sans SMTP, aucun email réel n’est envoyé.
5. Pour une évolution du schéma, générer et vérifier une migration avec `npm run cms:migration:create`, puis l’appliquer en production avant de redémarrer. Ne pas appliquer la migration initiale à une base déjà créée par le mode développement ; utiliser une nouvelle base de production ou établir explicitement son état de migration.

## Vérification d’intégration isolée

Le script crée des comptes et contenus de test : utiliser uniquement une base et un dossier média jetables.

```sh
DATABASE_URL=file:/tmp/academie-cms-qa.db MEDIA_DIR=/tmp/academie-cms-qa-media NEXT_PUBLIC_SERVER_URL=http://localhost:3002 npm run dev -- --port 3002
# Dans un autre terminal :
npm run cms:test
```

Les tests couvrent connexion, fermeture de l’inscription initiale, permissions des rédacteurs, brouillons privés, aperçu authentifié, publication, modification, dépublication, pages libres, upload d’images/PDF et sitemap. Un nouveau lancement complet exige une nouvelle base QA vierge.
