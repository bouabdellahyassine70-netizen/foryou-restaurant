# Guide: Créer une Base de Données Neon PostgreSQL

## Étape 1: Créer un Compte Neon

1. **Allez sur Neon**
   - Ouvrez https://neon.tech dans votre navigateur
   - Cliquez sur **"Sign Up"** ou **"Get Started"**

2. **Inscrivez-vous**
   - Vous pouvez vous inscrire avec:
     - GitHub (recommandé - plus rapide)
     - Email
     - Google
   - Suivez les instructions pour créer votre compte

---

## Étape 2: Créer un Nouveau Projet

1. **Après connexion**
   - Vous serez sur le Dashboard Neon
   - Cliquez sur **"Create Project"** ou **"New Project"**

2. **Configurer le Projet**
   - **Project Name:** `foryou-restaurant` (ou un nom de votre choix)
   - **Region:** Choisissez la région la plus proche de vous
     - Exemples: `US East (Ohio)`, `EU (Frankfurt)`, `US West (Oregon)`
   - **PostgreSQL Version:** Laissez la version par défaut (généralement 15 ou 16)
   - Cliquez sur **"Create Project"**

---

## Étape 3: Obtenir l'URL de Connexion (DATABASE_URL)

1. **Après création du projet**
   - Vous serez redirigé vers le Dashboard du projet
   - Vous verrez une section **"Connection Details"** ou **"Connection String"**

2. **Copier l'URL de Connexion**
   - Cherchez le champ **"Connection String"** ou **"DATABASE_URL"**
   - Il ressemble à:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
     ```
   - Cliquez sur le bouton **"Copy"** à côté de l'URL
   - **SAUVEGARDEZ CETTE URL** - vous en aurez besoin pour Railway

---

## Étape 4: Vérifier la Connexion (Optionnel)

Vous pouvez tester la connexion depuis votre terminal:

```bash
# Installer le client PostgreSQL (si pas déjà installé)
# Sur macOS:
brew install postgresql

# Tester la connexion (remplacez par votre URL)
psql "postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

Si la connexion fonctionne, vous verrez un prompt PostgreSQL. Tapez `\q` pour quitter.

---

## Étape 5: Exécuter les Migrations Prisma

Une fois que vous avez votre DATABASE_URL, vous devez créer les tables dans la base de données:

### Option A: Depuis votre Machine Locale (Recommandé)

1. **Créez un fichier `.env` dans le dossier `backend/`**
   ```bash
   cd backend
   echo "DATABASE_URL=votre-url-neon-ici" > .env
   ```

2. **Exécutez les migrations**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

   Ou si vous voulez créer une nouvelle migration:
   ```bash
   npx prisma migrate dev --name init
   ```

### Option B: Depuis Railway (Après Déploiement)

1. **Ajoutez DATABASE_URL dans Railway Variables**
2. **Railway exécutera automatiquement les migrations** si configuré
   - Ou vous pouvez exécuter manuellement via Railway CLI:
     ```bash
     railway run npx prisma migrate deploy
     ```

---

## Étape 6: Ajouter DATABASE_URL dans Railway

1. **Ouvrez Railway Dashboard**
   - https://railway.app
   - Sélectionnez votre projet "perpetual-tranquility"
   - Cliquez sur le service "foryou-restaurant"
   - Cliquez sur l'onglet **"Variables"**

2. **Ajoutez DATABASE_URL**
   - Cliquez sur **"+ New Variable"**
   - **Nom:** `DATABASE_URL`
   - **Valeur:** Collez l'URL Neon que vous avez copiée à l'Étape 3
   - Cliquez sur **"Add"**

---

## Résumé des Étapes

1. ✅ Créer un compte Neon (https://neon.tech)
2. ✅ Créer un nouveau projet dans Neon
3. ✅ Copier l'URL de connexion (DATABASE_URL)
4. ✅ Exécuter les migrations Prisma (localement ou via Railway)
5. ✅ Ajouter DATABASE_URL dans Railway Variables

---

## Aide Supplémentaire

### Si vous avez des Problèmes

**Problème: Je ne trouve pas l'URL de connexion**
- Solution: Dans le Dashboard Neon, cherchez "Connection Details" ou "Connection String"
- Ou allez dans "Settings" → "Connection"

**Problème: La connexion ne fonctionne pas**
- Vérifiez que vous avez copié l'URL complète (avec `?sslmode=require`)
- Vérifiez que votre projet Neon est actif (pas suspendu)

**Problème: Les migrations échouent**
- Vérifiez que DATABASE_URL est correct dans votre `.env`
- Vérifiez que Prisma est installé: `npm install` dans le dossier `backend/`
- Vérifiez que le schéma Prisma existe: `backend/prisma/schema.prisma`

---

## Coûts

- **Neon Free Tier:** 
  - 0.5 GB de stockage
  - 1 projet
  - Parfait pour le développement et les petits projets
  - Pas de carte de crédit requise

- **Upgrade:** 
  - Si vous avez besoin de plus, vous pouvez upgrader plus tard
  - Pour l'instant, le Free Tier devrait suffire

---

## Prochaines Étapes

Une fois que vous avez:
1. ✅ Créé la base de données Neon
2. ✅ Obtenu votre DATABASE_URL
3. ✅ Ajouté DATABASE_URL dans Railway

Vous pouvez:
- Ajouter les autres variables d'environnement dans Railway
- Le service Railway devrait démarrer correctement
- Votre application sera fonctionnelle!

---

## Note Importante

- 🔒 Gardez votre DATABASE_URL sécurisé - ne le partagez jamais publiquement
- 💾 Sauvegardez votre DATABASE_URL dans un endroit sûr
- 🔄 Si vous perdez l'URL, vous pouvez toujours la retrouver dans Neon Dashboard
