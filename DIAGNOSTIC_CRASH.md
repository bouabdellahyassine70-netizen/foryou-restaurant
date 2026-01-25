# Guide: Diagnostic du Crash Railway

## Problème
Le build réussit ✅ mais le service crash ❌ immédiatement après le démarrage.

## Causes Possibles

### 1. Variables d'Environnement Manquantes (Le Plus Probable)

Le service démarre mais crash car des variables essentielles manquent.

**Variables Requises:**
- `DATABASE_URL` - URL de connexion à Neon PostgreSQL
- `JWT_SECRET` - Secret pour signer les tokens JWT
- `FRONTEND_URL` - URL du frontend Vercel
- `PORT` - Port du serveur (par défaut: 4000)
- `NODE_ENV` - Environnement (production)

**Comment Vérifier:**
1. Railway Dashboard → Votre Service → **Variables**
2. Vérifiez que toutes les variables ci-dessus sont présentes
3. Vérifiez qu'elles ont des valeurs (pas vides)

### 2. Pre-Deploy Command Qui Échoue

Même si le build réussit, une commande pre-deploy peut échouer.

**Comment Vérifier:**
1. Railway Dashboard → Votre Service → **Settings** → **Deploy**
2. Cherchez "Pre-deploy step" ou "+ Add pre-deploy step"
3. Si une commande existe, supprimez-la ou corrigez-la

### 3. Le Service Démarre Mais Crash Immédiatement

Le service démarre mais rencontre une erreur au runtime.

**Comment Vérifier:**
1. Railway Dashboard → Votre Service → **Deployments**
2. Cliquez sur le dernier déploiement
3. Regardez **"Deploy Logs"** ou **"HTTP Logs"**
4. Cherchez les erreurs en rouge
5. Les erreurs communes:
   - `Cannot connect to database` → DATABASE_URL incorrect
   - `JWT_SECRET is required` → JWT_SECRET manquant
   - `Port already in use` → Conflit de port
   - `Module not found` → Problème de build

### 4. Problème avec le Port

Railway peut assigner un port différent de celui configuré.

**Solution:**
Le code devrait utiliser `process.env.PORT || 4000` pour être compatible avec Railway.

## Actions Immédiates

### Étape 1: Vérifier les Variables d'Environnement

1. Railway Dashboard → Votre Service → **Variables**
2. Vérifiez que ces variables existent:

```
DATABASE_URL=postgresql://... (votre URL Neon)
JWT_SECRET=votre-secret-random
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-app.vercel.app
PORT=4000
NODE_ENV=production
```

3. Si une variable manque, ajoutez-la:
   - Cliquez sur **"New Variable"**
   - Entrez le nom et la valeur
   - Cliquez sur **"Add"**

### Étape 2: Vérifier les Logs

1. Railway Dashboard → Votre Service → **Deployments**
2. Cliquez sur le dernier déploiement (celui qui a crashé)
3. Cliquez sur **"Deploy Logs"** ou **"HTTP Logs"**
4. Regardez les dernières lignes pour voir l'erreur exacte
5. Copiez l'erreur et partagez-la

### Étape 3: Vérifier Pre-Deploy

1. Railway Dashboard → Votre Service → **Settings** → **Deploy**
2. Cherchez "Pre-deploy step"
3. Si une commande existe et échoue, supprimez-la

### Étape 4: Redémarrer le Service

Après avoir corrigé les variables ou supprimé la pre-deploy:

1. Railway Dashboard → Votre Service → **Deployments**
2. Cliquez sur **"Redeploy"** ou **"Restart"**

## Erreurs Communes et Solutions

### Erreur: "Cannot connect to database"
**Solution:** Vérifiez `DATABASE_URL` dans Variables. Assurez-vous que l'URL Neon est correcte et accessible.

### Erreur: "JWT_SECRET is required"
**Solution:** Ajoutez `JWT_SECRET` dans Variables avec une valeur aléatoire (ex: `openssl rand -base64 32`).

### Erreur: "Module not found" ou "Cannot find module"
**Solution:** Le build n'a peut-être pas inclus tous les fichiers. Vérifiez que le Dockerfile copie correctement tous les fichiers nécessaires.

### Erreur: "Port already in use"
**Solution:** Railway assigne automatiquement un port. Assurez-vous que le code utilise `process.env.PORT || 4000`.

## Vérification Finale

Après avoir corrigé les problèmes:

✅ **Variables**: Toutes les variables requises sont présentes
✅ **Pre-deploy**: Aucune commande qui échoue
✅ **Logs**: Aucune erreur dans les logs
✅ **Service**: Le service démarre et reste actif

## Si le Problème Persiste

1. **Contactez le Support Railway**
   - Utilisez le bouton **"Get Help"** dans Railway
   - Partagez les logs d'erreur complets

2. **Vérifiez la Documentation**
   - Railway Docs: https://docs.railway.app
   - Vérifiez les exemples de déploiement NestJS

3. **Testez Localement**
   - Assurez-vous que le service fonctionne localement avec les mêmes variables d'environnement
