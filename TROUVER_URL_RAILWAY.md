# 🔍 Comment Trouver Votre URL Railway

## Méthode 1 : Dashboard Railway (Le Plus Simple)

1. **Allez sur**: https://railway.app/dashboard
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez** sur votre projet backend (celui qui contient NestJS)
4. **Cliquez** sur l'onglet **"Settings"** (icône engrenage ⚙️)
5. **Faites défiler** jusqu'à la section **"Networking"**
6. **Cherchez** "Public Domain" ou "Generate Domain"
7. **Copiez** le domaine affiché (ex: `foryou-restaurant-production.up.railway.app`)
8. **Ajoutez** `/api` à la fin: `https://foryou-restaurant-production.up.railway.app/api`

## Méthode 2 : Via les Deployments

1. Railway Dashboard → Votre Service
2. Cliquez sur l'onglet **"Deployments"**
3. Cliquez sur le dernier déploiement
4. Regardez les logs - l'URL peut y être affichée

## Méthode 3 : Générer un Domaine

Si vous ne voyez pas de domaine:

1. Railway Dashboard → Votre Service
2. Settings → Networking
3. Cliquez sur **"Generate Domain"**
4. Railway générera un domaine automatiquement
5. Copiez-le et ajoutez `/api` à la fin

## Format de l'URL

Votre URL Railway ressemblera à:
- `https://[nom-du-service].up.railway.app`
- Exemple: `https://foryou-restaurant-production.up.railway.app`

Pour l'API, ajoutez `/api`:
- `https://[nom-du-service].up.railway.app/api`
- Exemple: `https://foryou-restaurant-production.up.railway.app/api`

## Une fois que vous avez l'URL

1. **Allez sur Vercel**: https://vercel.com/dashboard
2. Votre Projet → Settings → Environment Variables
3. **Supprimez** l'ancien `NEXT_PUBLIC_API_URL` (s'il contient "placeholder")
4. **Ajoutez**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://VOTRE-URL-RAILWAY.railway.app/api`
5. **Sauvegardez** → **Redéployez**

## Besoin d'Aide?

Si vous ne trouvez toujours pas:
1. Vérifiez que votre backend est bien déployé sur Railway
2. Vérifiez que le service est actif (pas en pause)
3. Regardez les logs de déploiement pour voir l'URL
