# Variables d'Environnement Railway - Guide Rapide

## Variables Requises pour Railway Backend

### Variables Critiques (Obligatoires)

1. **DATABASE_URL**
   - **Description**: URL de connexion à votre base de données Neon PostgreSQL
   - **Comment obtenir**: 
     - Allez sur https://console.neon.tech
     - Sélectionnez votre projet
     - Allez dans "Connection Details" ou "Connection String"
     - Copiez l'URL complète
   - **Format**: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

2. **JWT_SECRET**
   - **Description**: Secret pour signer les tokens JWT
   - **Comment générer**: 
     ```bash
     openssl rand -base64 32
     ```
   - **Exemple**: `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1pQ3`
   - **Important**: Gardez ce secret sécurisé et ne le partagez jamais publiquement

3. **FRONTEND_URL**
   - **Description**: URL de votre frontend Vercel
   - **Format**: `https://votre-app.vercel.app`
   - **Exemple**: `https://foryou-restaurant-k0jzjwrse.vercel.app`

### Variables Recommandées

4. **JWT_EXPIRES_IN**
   - **Description**: Durée de validité des tokens JWT
   - **Valeur**: `7d` (7 jours)

5. **PORT**
   - **Description**: Port sur lequel le serveur écoute
   - **Valeur**: `4000`
   - **Note**: Railway peut assigner un port différent, mais cette variable est utilisée comme fallback

6. **NODE_ENV**
   - **Description**: Environnement d'exécution
   - **Valeur**: `production`

## Comment Ajouter les Variables dans Railway

### Méthode 1: Via l'Interface Web (Recommandé)

1. **Ouvrez Railway Dashboard**
   - Allez sur https://railway.app
   - Sélectionnez votre projet "perpetual-tranquility"
   - Cliquez sur le service "foryou-restaurant"

2. **Allez dans Variables**
   - Cliquez sur l'onglet **"Variables"** en haut

3. **Ajoutez chaque variable**
   - Cliquez sur **"+ New Variable"** (en haut à droite)
   - Entrez le **Nom** de la variable
   - Entrez la **Valeur** de la variable
   - Cliquez sur **"Add"** ou **"Save"**

4. **Répétez** pour chaque variable ci-dessus

### Méthode 2: Via Railway CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Ajouter les variables
railway variables set DATABASE_URL="votre-url-neon"
railway variables set JWT_SECRET="votre-secret"
railway variables set FRONTEND_URL="https://votre-app.vercel.app"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set PORT="4000"
railway variables set NODE_ENV="production"
```

## Vérification

Après avoir ajouté toutes les variables:

1. **Vérifiez dans Railway Dashboard**
   - Onglet **Variables**
   - Vous devriez voir toutes les variables listées

2. **Railway redéploiera automatiquement**
   - Le service devrait démarrer correctement
   - Le crash devrait être résolu

## Ordre d'Importance

Si vous ne pouvez ajouter qu'une variable à la fois, ajoutez-les dans cet ordre:

1. **DATABASE_URL** (le plus critique - sans ça, le service ne peut pas démarrer)
2. **JWT_SECRET** (critique pour l'authentification)
3. **FRONTEND_URL** (nécessaire pour CORS)
4. **JWT_EXPIRES_IN** (recommandé)
5. **PORT** (recommandé)
6. **NODE_ENV** (recommandé)

## Dépannage

### Le service crash toujours après avoir ajouté les variables

1. **Vérifiez les logs**
   - Railway Dashboard → Deployments → Dernier déploiement → Deploy Logs
   - Cherchez les erreurs en rouge

2. **Vérifiez que les valeurs sont correctes**
   - DATABASE_URL: Doit être une URL PostgreSQL valide
   - JWT_SECRET: Doit être une chaîne non vide
   - FRONTEND_URL: Doit être une URL HTTPS valide

3. **Vérifiez qu'il n'y a pas d'espaces**
   - Les valeurs ne doivent pas avoir d'espaces avant ou après
   - Utilisez "Copy" au lieu de taper manuellement si possible

## Exemple de Configuration Complète

```
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1pQ3
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://foryou-restaurant-k0jzjwrse.vercel.app
PORT=4000
NODE_ENV=production
```

## Note Importante

- Ne partagez jamais vos variables d'environnement publiquement
- Ne commitez jamais les fichiers `.env` dans Git
- Utilisez des secrets forts pour JWT_SECRET
- Gardez une copie de vos variables dans un endroit sécurisé
