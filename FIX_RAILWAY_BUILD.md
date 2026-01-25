# 🔧 Fix Railway Build Error

## Problème
Railway affiche: "Error creating build plan with Railpack"

## Solution

### Option 1: Configurer Root Directory dans Railway (Recommandé)

1. **Allez sur Railway Dashboard**: https://railway.app/dashboard
2. **Cliquez sur votre service** "foryou-restaurant"
3. **Cliquez sur "Settings"**
4. **Trouvez "Root Directory"**
5. **Changez-le à**: `backend`
6. **Sauvegardez**

Railway va automatiquement redéployer avec la bonne configuration.

### Option 2: Vérifier railway.json

Le fichier `backend/railway.json` est maintenant correct. Il suppose que Railway est configuré avec `backend` comme Root Directory.

### Configuration Requise dans Railway

Dans Railway Dashboard → Votre Service → Settings:

- **Root Directory**: `backend`
- **Build Command**: (laissé vide, utilise railway.json)
- **Start Command**: (laissé vide, utilise railway.json)

### Variables d'Environnement Requises

Assurez-vous que ces variables sont définies dans Railway:

1. `DATABASE_URL` - Votre connection string Neon
2. `JWT_SECRET` - Clé secrète (générer avec: `openssl rand -base64 32`)
3. `JWT_EXPIRES_IN` - `7d`
4. `FRONTEND_URL` - `https://foryou-restaurant-k0jzjwrse.vercel.app`
5. `PORT` - `4000`
6. `NODE_ENV` - `production`

### Après Configuration

1. Railway va automatiquement redéployer
2. Attendez que le build réussisse
3. Obtenez votre URL Railway depuis Settings → Networking
4. Configurez `NEXT_PUBLIC_API_URL` dans Vercel avec cette URL
