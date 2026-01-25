# 🔍 Différence Entre URL Interne et Publique Railway

## ⚠️ Important

Railway utilise deux types d'URLs:

### URL Interne (pour communication entre services)
- Format: `service-name.railway.internal`
- Exemple: `foryou-restaurant.railway.internal`
- ❌ **Ne fonctionne PAS** pour Vercel
- ✅ Utilisée uniquement entre services Railway

### URL Publique (pour accès externe)
- Format: `https://[nom].up.railway.app`
- Exemple: `https://foryou-restaurant-production.up.railway.app`
- ✅ **C'est celle-ci** qu'il faut utiliser pour Vercel
- ✅ Accessible depuis Internet

## 📍 Comment Trouver l'URL Publique

### Méthode 1: Railway Dashboard

1. **Allez sur**: https://railway.app/dashboard
2. **Cliquez** sur votre projet "perpetual-tranquility"
3. **Cliquez** sur votre service "foryou-restaurant"
4. **Cliquez** sur l'onglet **"Settings"** (⚙️)
5. **Faites défiler** jusqu'à la section **"Networking"**
6. **Cherchez**:
   - "Public Domain"
   - "Generate Domain"
   - "Create Public Domain"

### Méthode 2: Si Pas de Domaine Public

1. Railway Dashboard → Votre Service → Settings
2. Section "Networking"
3. **Cliquez** sur **"Generate Domain"** ou **"Create Public Domain"**
4. Railway créera un domaine public automatiquement
5. **Copiez** le domaine généré

### Méthode 3: Via Railway CLI

```bash
railway login
cd backend
railway link
railway domain
```

## ✅ Format Correct pour Vercel

Une fois que vous avez l'URL publique:

```
https://[votre-domaine].up.railway.app/api
```

Exemples:
- `https://foryou-restaurant-production.up.railway.app/api`
- `https://foryou-restaurant.up.railway.app/api`
- `https://perpetual-tranquility-production.up.railway.app/api`

## 🚀 Configuration Vercel

Une fois que vous avez l'URL publique:

1. Vercel Dashboard → Votre Projet → Settings → Environment Variables
2. Ajoutez/Mettez à jour:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://[votre-domaine-public].up.railway.app/api`
3. Sauvegardez → Redéployez

## ⚠️ Note

L'URL `.railway.internal` est uniquement pour la communication interne Railway.
Pour que Vercel puisse accéder à votre API, vous DEVEZ utiliser l'URL publique!
