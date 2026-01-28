# 🚀 Déploiement sur Vercel (Frontend + Backend)

Ce guide vous explique comment déployer votre application complète sur Vercel uniquement.

## 📋 Prérequis

1. ✅ Compte Vercel (gratuit)
2. ✅ Compte Neon (base de données PostgreSQL gratuite)
3. ✅ GitHub repository avec votre code

---

## Étape 1: Créer la Base de Données Neon

1. Allez sur **https://neon.tech**
2. Créez un compte (gratuit)
3. Créez un nouveau projet
4. Copiez l'URL de connexion (DATABASE_URL)
   - Format: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

---

## Étape 2: Déployer le Backend sur Vercel

### 2.1. Connecter le Backend à Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Add New Project"**
3. Importez votre repository GitHub
4. **Configuration du projet:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Output Directory**: (laisser vide)
   - **Install Command**: `npm install`

### 2.2. Variables d'Environnement Backend

Dans Vercel → Votre Projet Backend → Settings → Environment Variables, ajoutez:

```
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=votre-secret-jwt-random
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-frontend.vercel.app
NODE_ENV=production
PORT=4000
```

**Pour générer JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 2.3. Exécuter les Migrations Prisma

Après le déploiement du backend, vous devez exécuter les migrations:

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel link
cd backend
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Via Vercel Dashboard**
1. Allez dans votre projet backend sur Vercel
2. Cliquez sur "Deployments"
3. Cliquez sur le dernier déploiement
4. Cliquez sur "Functions" → Ouvrez une fonction
5. Utilisez la console pour exécuter les migrations

**Option C: Via Script Local**
Créez un fichier `backend/.env.local` avec votre DATABASE_URL, puis:
```bash
cd backend
npx prisma migrate deploy
```

### 2.4. Seed la Base de Données

Après les migrations, seedez la base de données:

```bash
cd backend
npm run seed
```

Ou via Vercel CLI:
```bash
vercel env pull .env.local
npm run seed
```

---

## Étape 3: Déployer le Frontend sur Vercel

### 3.1. Connecter le Frontend à Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Add New Project"**
3. Importez le même repository GitHub
4. **Configuration du projet:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (automatique pour Next.js)
   - **Output Directory**: `.next` (automatique)
   - **Install Command**: `npm install`

### 3.2. Variables d'Environnement Frontend

Dans Vercel → Votre Projet Frontend → Settings → Environment Variables, ajoutez:

```
NEXT_PUBLIC_API_URL=https://votre-backend.vercel.app/api
```

**Important:** Remplacez `votre-backend.vercel.app` par l'URL réelle de votre backend Vercel.

---

## Étape 4: Mettre à Jour les URLs

### 4.1. Backend - Mettre à jour FRONTEND_URL

Dans Vercel → Backend → Settings → Environment Variables:
- Mettez à jour `FRONTEND_URL` avec l'URL réelle de votre frontend Vercel

### 4.2. Frontend - Mettre à jour NEXT_PUBLIC_API_URL

Dans Vercel → Frontend → Settings → Environment Variables:
- Mettez à jour `NEXT_PUBLIC_API_URL` avec l'URL réelle de votre backend Vercel

### 4.3. Redéployer

Après avoir mis à jour les variables:
1. Backend: Vercel → Deployments → "Redeploy"
2. Frontend: Vercel → Deployments → "Redeploy"

---

## ⚠️ Limitations Vercel Serverless Functions

### WebSockets
- ❌ Les WebSockets ne fonctionnent **pas** avec Vercel Serverless Functions
- ✅ Solution: Utilisez des polling ou des alternatives comme Pusher/Supabase Realtime

### Redis/BullMQ
- ⚠️ Redis peut avoir des problèmes avec les fonctions serverless
- ✅ Solution: Utilisez Upstash Redis (compatible Vercel) ou désactivez BullMQ

### Timeouts
- ⚠️ Timeout de 10s (Hobby) ou 60s (Pro)
- ✅ Pour les opérations longues, utilisez Vercel Background Functions

---

## ✅ Vérification

1. **Backend**: Visitez `https://votre-backend.vercel.app/api/docs` (Swagger)
2. **Frontend**: Visitez `https://votre-frontend.vercel.app`
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
- Vérifiez que `npx prisma generate` est exécuté dans le build command
- Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📝 URLs Finales

- **Frontend**: `https://votre-frontend.vercel.app`
- **Backend API**: `https://votre-backend.vercel.app/api`
- **API Docs**: `https://votre-backend.vercel.app/api/docs`

---

## 🎉 C'est Fait!

Votre application est maintenant déployée sur Vercel! 🚀
