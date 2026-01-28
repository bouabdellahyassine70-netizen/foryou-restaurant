# 🌱 Guide pour Seed la Base de Données

Votre base de données Neon est vide, c'est pourquoi vous voyez "No categories found." sur le site.

## Option 1: Via Railway CLI (Recommandé)

### Étape 1: Installer Railway CLI (si pas déjà fait)
```bash
npm install -g @railway/cli
railway login
```

### Étape 2: Se connecter à votre projet Railway
```bash
cd backend
railway link
# Sélectionnez votre projet Railway
```

### Étape 3: Exécuter le seed sur la base de données de production
```bash
railway run npm run seed
```

Cela va:
- ✅ Créer les utilisateurs admin et manager
- ✅ Créer toutes les catégories (17 catégories)
- ✅ Créer tous les produits du menu (100+ items)
- ✅ Créer 10 tables
- ✅ Créer un code promo WELCOME10

---

## Option 2: Via Railway Dashboard

### Étape 1: Récupérer votre DATABASE_URL
1. Allez sur [Railway Dashboard](https://railway.app)
2. Sélectionnez votre projet
3. Cliquez sur votre service backend
4. Allez dans l'onglet "Variables"
5. Copiez la valeur de `DATABASE_URL`

### Étape 2: Exécuter le seed localement avec la DATABASE_URL de production
```bash
cd backend
DATABASE_URL="votre-database-url-neon" npm run seed
```

⚠️ **Attention**: Remplacez `votre-database-url-neon` par votre vraie URL Neon.

---

## Option 3: Via Railway Shell (Terminal dans Railway)

1. Allez sur Railway Dashboard
2. Sélectionnez votre service backend
3. Cliquez sur "Deployments" → "View Logs"
4. Cliquez sur "Shell" (ou "Open Shell")
5. Exécutez:
```bash
cd backend
npm run seed
```

---

## Vérification

Après avoir exécuté le seed, vous devriez voir:
- ✅ 17 catégories créées
- ✅ 100+ produits créés
- ✅ Utilisateurs admin et manager créés

**Identifiants par défaut:**
- Admin: `admin@foryou.com` / `admin123`
- Manager: `manager@foryou.com` / `manager123`

---

## Si le seed échoue

1. Vérifiez que `DATABASE_URL` est correctement configuré dans Railway
2. Vérifiez que les migrations Prisma sont appliquées:
   ```bash
   railway run npx prisma migrate deploy
   ```
3. Vérifiez les logs Railway pour voir l'erreur exacte
