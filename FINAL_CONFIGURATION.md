# ✅ Configuration Finale - URLs Trouvées

## 🎯 URLs Configurées

### Railway Backend (API)
```
https://foryou-restaurant-production.up.railway.app/api
```

### Vercel Frontend
```
https://foryou-restaurant-k0jzjwrse.vercel.app
```

## 📋 Configuration Vercel

### Étape 1: Vercel Environment Variables

1. **Allez sur**: https://vercel.com/dashboard
2. **Cliquez** sur votre projet "foryou-restaurant"
3. **Allez dans**: Settings → Environment Variables
4. **Supprimez** l'ancien `NEXT_PUBLIC_API_URL` (s'il contient "placeholder")
5. **Ajoutez**:
   ```
   Key:   NEXT_PUBLIC_API_URL
   Value: https://foryou-restaurant-production.up.railway.app/api
   ```
   ⚠️ **IMPORTANT**: 
   - Pas d'espaces avant ou après!
   - Doit commencer par `https://`
   - Doit se terminer par `/api`

6. **Cliquez** "Save"
7. **Allez dans** "Deployments"
8. **Cliquez** "..." sur le dernier déploiement → "Redeploy"

## 📋 Configuration Railway

### Étape 2: Railway Environment Variables

1. **Allez sur**: https://railway.app/dashboard
2. **Cliquez** sur votre service "foryou-restaurant"
3. **Allez dans**: Variables
4. **Vérifiez/Mettez à jour**:
   ```
   Key:   FRONTEND_URL
   Value: https://foryou-restaurant-k0jzjwrse.vercel.app
   ```
   (Utilisez votre URL Vercel réelle - vérifiez dans Vercel dashboard)

5. **Redémarrez** le service Railway si nécessaire

## ✅ Vérification

Après configuration:

1. ✅ Vercel redéploiera automatiquement
2. ✅ Railway devrait accepter les requêtes de Vercel (CORS configuré)
3. ✅ Votre app devrait fonctionner!

## 🔍 Test

Une fois configuré, testez:

1. Ouvrez votre app Vercel: https://foryou-restaurant-k0jzjwrse.vercel.app
2. Vérifiez la console du navigateur (F12)
3. Vous ne devriez plus voir d'erreurs CORS
4. Le menu devrait se charger

## 🐛 Si Ça Ne Fonctionne Pas

1. Vérifiez que Railway est bien déployé (Deployments → Successful)
2. Vérifiez que les variables d'environnement sont correctes (pas d'espaces)
3. Vérifiez les logs Railway pour voir si le backend reçoit les requêtes
4. Vérifiez les logs Vercel pour voir les erreurs de build
