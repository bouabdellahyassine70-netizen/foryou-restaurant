# 🔧 Configurer le Projet Vercel Existant pour le Backend

Vous avez déjà un projet Vercel ouvert. Voici comment le configurer pour déployer le backend.

## Option 1: Utiliser le Même Projet (Monorepo)

Si vous voulez déployer le frontend ET le backend depuis le même projet Vercel:

### Configuration dans Vercel Dashboard

1. **Allez sur votre projet Vercel**
   - https://vercel.com/dashboard
   - Ouvrez votre projet existant

2. **Allez dans Settings → General**
   - **Root Directory**: Laissez vide (racine du repo)
   - **Build Command**: `cd backend && npm install && npm run build && npx prisma generate`
   - **Output Directory**: `backend/dist` (ou laissez vide)
   - **Install Command**: `cd backend && npm install`

3. **Créez un fichier `vercel.json` à la racine** avec cette configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

---

## Option 2: Créer un Projet Séparé pour le Backend (Recommandé)

C'est plus simple de créer un **nouveau projet Vercel** juste pour le backend:

### Étapes

1. **Allez sur Vercel Dashboard**
   - https://vercel.com/dashboard
   - Cliquez sur **"Add New Project"**

2. **Importez le même repository GitHub**

3. **Configuration:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Output Directory**: (laisser vide)
   - **Install Command**: `npm install`

4. **Variables d'Environnement:**
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=votre-secret-jwt-random
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://votre-frontend.vercel.app
   NODE_ENV=production
   PORT=4000
   ```

5. **Après le déploiement:**
   ```bash
   cd backend
   vercel env pull .env.local
   npx prisma migrate deploy
   npm run seed
   ```

6. **Mettez à jour le frontend:**
   - Dans votre projet frontend Vercel existant
   - Settings → Environment Variables
   - Ajoutez/modifiez: `NEXT_PUBLIC_API_URL=https://votre-backend.vercel.app/api`

---

## Option 3: Modifier le Projet Existant (Si c'est le Frontend)

Si votre projet Vercel actuel est configuré pour le frontend:

### Garder le Frontend tel quel, ajouter le Backend

1. **Créez un nouveau projet Vercel pour le backend** (Option 2 ci-dessus)
   - C'est la méthode la plus simple et recommandée

### OU modifier le projet existant:

1. **Allez dans Settings → General**
   - Changez **Root Directory** à: `frontend` (pour garder le frontend)
   - Sauvegardez

2. **Créez un nouveau projet Vercel pour le backend** (Option 2)

---

## ✅ Recommandation

**Je recommande l'Option 2** (deux projets séparés):
- ✅ Plus simple à gérer
- ✅ Déploiements indépendants
- ✅ Variables d'environnement séparées
- ✅ Pas de conflits de configuration

---

## 🔗 Après Configuration

1. **Backend URL**: `https://votre-backend.vercel.app`
2. **Frontend URL**: `https://votre-frontend.vercel.app`
3. **API Endpoint**: `https://votre-backend.vercel.app/api`
4. **API Docs**: `https://votre-backend.vercel.app/api/docs`

---

## 📝 Checklist

- [ ] Projet backend créé sur Vercel
- [ ] Root Directory: `backend`
- [ ] Build Command configuré
- [ ] Variables d'environnement ajoutées
- [ ] Migrations Prisma exécutées
- [ ] Base de données seedée
- [ ] `NEXT_PUBLIC_API_URL` mis à jour dans le frontend
- [ ] `FRONTEND_URL` mis à jour dans le backend
- [ ] Test: Frontend peut communiquer avec le backend
