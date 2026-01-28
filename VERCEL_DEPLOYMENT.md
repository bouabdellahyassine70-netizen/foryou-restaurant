# 🚀 Déploiement Complet sur Vercel

Guide pour déployer le frontend ET le backend sur Vercel uniquement.

## 📋 Structure

- **Frontend**: Next.js → Vercel (déjà configuré)
- **Backend**: NestJS → Vercel Serverless Functions (nouveau)
- **Database**: Neon PostgreSQL (externe)

---

## Étape 1: Préparer la Base de Données Neon

1. Créez un compte sur **https://neon.tech** (gratuit)
2. Créez un nouveau projet
3. Copiez l'URL de connexion (DATABASE_URL)
   - Format: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

---

## Étape 2: Déployer le Backend sur Vercel

### 2.1. Créer un Nouveau Projet Vercel pour le Backend

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Add New Project"**
3. Importez votre repository GitHub
4. **Configuration:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Output Directory**: (laisser vide)
   - **Install Command**: `npm install`

### 2.2. Variables d'Environnement Backend

Dans Vercel → Backend Project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=votre-secret-jwt-random
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-frontend.vercel.app
NODE_ENV=production
PORT=4000
```

**Générer JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 2.3. Exécuter les Migrations Prisma

Après le premier déploiement:

**Option A: Via Vercel CLI (Recommandé)**
```bash
npm install -g vercel
vercel login
cd backend
vercel link
vercel env pull .env.local
npx prisma migrate deploy
npm run seed
```

**Option B: Via Script Local**
1. Créez `backend/.env.local` avec votre `DATABASE_URL`
2. Exécutez:
```bash
cd backend
npx prisma migrate deploy
npm run seed
```

### 2.4. Obtenir l'URL du Backend

Après le déploiement, Vercel vous donnera une URL comme:
- `https://votre-backend.vercel.app`

Notez cette URL! Vous en aurez besoin pour le frontend.

---

## Étape 3: Mettre à Jour le Frontend

### 3.1. Variables d'Environnement Frontend

Dans Vercel → Frontend Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://votre-backend.vercel.app/api
```

**Important:** Remplacez `votre-backend.vercel.app` par l'URL réelle de votre backend Vercel.

### 3.2. Mettre à Jour FRONTEND_URL dans le Backend

Dans Vercel → Backend Project → Settings → Environment Variables:

Mettez à jour `FRONTEND_URL` avec l'URL réelle de votre frontend Vercel:
```
FRONTEND_URL=https://votre-frontend.vercel.app
```

### 3.3. Redéployer

1. Backend: Vercel → Deployments → "Redeploy"
2. Frontend: Vercel → Deployments → "Redeploy"

---

## ⚠️ Limitations Vercel Serverless Functions

### WebSockets
- ❌ **Ne fonctionne pas** avec Vercel Serverless Functions
- ✅ **Solution**: Utilisez polling ou désactivez les WebSockets temporairement

### Redis/BullMQ
- ⚠️ Peut avoir des problèmes avec les fonctions serverless
- ✅ **Solution**: Utilisez Upstash Redis (compatible Vercel) ou désactivez BullMQ

### Timeouts
- ⚠️ Timeout de 10s (Hobby) ou 60s (Pro)
- ✅ Pour les opérations longues, utilisez Vercel Background Functions

---

## ✅ Vérification

1. **Backend API Docs**: `https://votre-backend.vercel.app/api/docs`
2. **Frontend**: `https://votre-frontend.vercel.app`
3. **Test**: Essayez de créer une commande

---

## 🔧 Dépannage

### Erreur: "Cannot connect to database"
- Vérifiez que `DATABASE_URL` est correct dans Vercel
- Vérifiez que les migrations Prisma sont exécutées

### Erreur: "CORS blocked"
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL réelle du frontend
- Vérifiez que `NEXT_PUBLIC_API_URL` dans le frontend correspond à l'URL réelle du backend

### Erreur: "Module not found"
- Vérifiez que `npx prisma generate` est dans le build command
- Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📝 URLs Finales

- **Frontend**: `https://votre-frontend.vercel.app`
- **Backend API**: `https://votre-backend.vercel.app/api`
- **API Docs**: `https://votre-backend.vercel.app/api/docs`

---

## 🎉 C'est Fait!

Votre application est maintenant déployée entièrement sur Vercel! 🚀
