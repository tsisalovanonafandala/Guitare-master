# GLITA — Déploiement sur Vercel avec base de données Postgres (Neon)

Firebase n'est plus utilisé. Les chansons ajoutées via le panel admin et les emails
des visiteurs sont maintenant stockés dans une vraie base de données Postgres,
fournie par Vercel via son partenaire Neon.

## Étapes de déploiement

### 1. Mettre le projet sur GitHub
Crée un dépôt GitHub et pousse ces fichiers dedans :
- `index.html`
- `api/songs.js`
- `api/visitors.js`
- `package.json`

### 2. Importer le projet sur Vercel
1. Va sur https://vercel.com et connecte-toi (ou crée un compte).
2. Clique sur **Add New → Project**.
3. Sélectionne ton dépôt GitHub GLITA.
4. Laisse les réglages par défaut et clique sur **Deploy**.

### 3. Ajouter la base de données Postgres (Neon)
1. Dans ton projet Vercel, va dans l'onglet **Storage**.
2. Clique sur **Create Database** (ou "Marketplace Database Providers").
3. Choisis **Neon** (Postgres).
4. Suis les étapes, puis clique **Connect Project** pour le relier à ton projet GLITA.
5. Vercel ajoute automatiquement la variable d'environnement `DATABASE_URL`.

### 4. Redéployer
Après avoir connecté la base de données, retourne dans l'onglet **Deployments**
et clique sur **Redeploy** pour que les nouvelles variables d'environnement
soient prises en compte.

### 5. C'est prêt !
- Les chansons ajoutées via le panel admin sont sauvegardées dans Postgres.
- La liste des visiteurs (emails) est aussi dans Postgres.
- Les tables `songs` et `visitors` sont créées automatiquement au premier appel —
  aucune configuration manuelle de base de données n'est nécessaire.

## Voir les données directement
Dans Vercel → Storage → ta base Neon → **Open in Neon Console**, tu peux
utiliser l'éditeur SQL pour voir/modifier les tables directement :

```sql
SELECT * FROM songs ORDER BY id DESC;
SELECT * FROM visitors ORDER BY date DESC;
```
