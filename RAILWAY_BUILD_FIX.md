# 🔧 Solution Définitive pour Railway Build Error

## Problème
Railway affiche toujours: "Error creating build plan with Railpack"

## Cause
Railway essaie de builder depuis la racine du projet au lieu du dossier `backend/`.

## Solutions (Essayez dans l'ordre)

### Solution 1: Configurer Root Directory dans Railway (Recommandé)

**Dans Railway Dashboard:**

1. Allez sur: https://railway.app/dashboard
2. Cliquez sur votre projet "perpetual-tranquility"
3. Cliquez sur votre service "foryou-restaurant"
4. Cliquez sur l'onglet **"Settings"** (en haut)
5. **Cherchez** dans les sections suivantes:
   - **"Build"** section → "Root Directory"
   - **"Deploy"** section → "Root Directory"  
   - **"Service"** section → "Root Directory"
   - **"General"** section → "Root Directory"
6. **Changez** le Root Directory à: `backend`
7. **Sauvegardez**

### Solution 2: Utiliser Dockerfile

Railway peut utiliser le Dockerfile qui est déjà dans `backend/Dockerfile`.

Pour forcer Railway à utiliser Dockerfile:

1. Railway Dashboard → Votre Service → Settings
2. Cherchez "Build Command" ou "Builder"
3. Changez de "Nixpacks" à "Dockerfile"
4. Sauvegardez

### Solution 3: Créer railway.json à la racine

Créez un fichier `railway.json` à la racine du projet qui pointe vers backend:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npm run build && npx prisma generate"
  },
  "deploy": {
    "startCommand": "cd backend && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Solution 4: Vérifier la Structure du Projet

Assurez-vous que Railway pointe vers le bon repository et que la structure est:

```
foryou-restaurant/
├── backend/
│   ├── package.json
│   ├── src/
│   ├── prisma/
│   └── nixpacks.toml
└── frontend/
```

## ✅ Vérification

Après avoir configuré:

1. Railway va automatiquement redéployer
2. Le build devrait réussir
3. Vous verrez "Deploy Successful"

## 🆘 Si Rien Ne Fonctionne

Essayez de créer un nouveau service Railway:

1. Railway Dashboard → Nouveau Service
2. Sélectionnez "GitHub Repo"
3. Choisissez votre repo
4. **IMPORTANT**: Dans les options de déploiement, spécifiez:
   - **Root Directory**: `backend`
   - Ou utilisez le Dockerfile
