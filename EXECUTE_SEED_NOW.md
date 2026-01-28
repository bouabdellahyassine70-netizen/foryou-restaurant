# 🚀 Exécuter le Seed MAINTENANT

## Méthode la Plus Simple (2 minutes)

### Étape 1: Ouvrir Railway Shell
1. Allez sur **https://railway.app**
2. Cliquez sur votre projet backend
3. Cliquez sur **"Deployments"** en haut
4. Cliquez sur **"View Logs"** du dernier déploiement
5. Cliquez sur **"Shell"** (ou **"Open Shell"**) en haut à droite

### Étape 2: Exécuter le Seed
Dans le terminal Railway qui s'ouvre, copiez-collez ces commandes:

```bash
cd backend
npm run seed
```

C'est tout! ✅

Le seed va créer:
- ✅ 17 catégories
- ✅ 100+ produits
- ✅ Utilisateurs admin et manager
- ✅ 10 tables
- ✅ Code promo WELCOME10

### Étape 3: Vérifier
Rafraîchissez votre site Vercel (`foryou-restaurant.vercel.app`) et vous devriez voir tous les produits!

---

## Si ça ne fonctionne pas

### Vérifier que DATABASE_URL est configuré
1. Railway Dashboard → Votre Service → **Variables**
2. Vérifiez que `DATABASE_URL` existe et a une valeur
3. Si elle n'existe pas, ajoutez-la avec votre URL Neon

### Vérifier les migrations Prisma
Dans Railway Shell, exécutez:
```bash
cd backend
npx prisma migrate deploy
```

Puis réessayez:
```bash
npm run seed
```

---

## Identifiants par défaut créés

- **Admin**: `admin@foryou.com` / `admin123`
- **Manager**: `manager@foryou.com` / `manager123`
