# Variables d'Environnement - Liste Complète avec Valeurs

## RAILWAY BACKEND - Variables d'Environnement

### Variable 1: DATABASE_URL
**Nom:** `DATABASE_URL`  
**Valeur:** `[VOUS DEVEZ COLLER VOTRE URL NEON ICI]`  
**Format:** `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`  
**Comment obtenir:**
- Allez sur https://console.neon.tech
- Sélectionnez votre projet
- Allez dans "Connection Details" ou "Connection String"
- Copiez l'URL complète

---

### Variable 2: JWT_SECRET
**Nom:** `JWT_SECRET`  
**Valeur:** `yQ5/HcZAJr3/ZFg3JDrq+RfnOSKMjqoMXnWwuqD5a+s=`  
**Note:** ✅ Cette valeur a été générée pour vous - utilisez-la telle quelle

---

### Variable 3: JWT_EXPIRES_IN
**Nom:** `JWT_EXPIRES_IN`  
**Valeur:** `7d`

---

### Variable 4: FRONTEND_URL
**Nom:** `FRONTEND_URL`  
**Valeur:** `https://foryou-restaurant-k0jzjwrse.vercel.app`  
**Note:** ⚠️ Si votre URL Vercel est différente, remplacez-la par votre URL réelle

---

### Variable 5: PORT
**Nom:** `PORT`  
**Valeur:** `4000`

---

### Variable 6: NODE_ENV
**Nom:** `NODE_ENV`  
**Valeur:** `production`

---

## Instructions d'Ajout dans Railway

1. **Ouvrez Railway Dashboard**
   - https://railway.app
   - Sélectionnez votre projet "perpetual-tranquility"
   - Cliquez sur le service "foryou-restaurant"
   - Cliquez sur l'onglet **"Variables"**

2. **Ajoutez chaque variable**
   - Cliquez sur **"+ New Variable"** (en haut à droite)
   - **Nom:** Copiez exactement le nom indiqué ci-dessus
   - **Valeur:** Copiez exactement la valeur indiquée ci-dessus
   - Cliquez sur **"Add"** ou **"Save"**
   - Répétez pour chaque variable

3. **Ordre recommandé**
   - Ajoutez-les dans cet ordre:
     1. DATABASE_URL (le plus critique)
     2. JWT_SECRET
     3. FRONTEND_URL
     4. JWT_EXPIRES_IN
     5. PORT
     6. NODE_ENV

---

## Exemple de Configuration Complète

Une fois que vous avez ajouté toutes les variables, voici à quoi ça devrait ressembler:

```
DATABASE_URL=postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=yQ5/HcZAJr3/ZFg3JDrq+RfnOSKMjqoMXnWwuqD5a+s=
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://foryou-restaurant-k0jzjwrse.vercel.app
PORT=4000
NODE_ENV=production
```

**Note:** Remplacez `DATABASE_URL` par votre vraie URL Neon PostgreSQL.

---

## Vérification

Après avoir ajouté toutes les variables:

1. ✅ Vérifiez dans Railway Dashboard → Variables
   - Vous devriez voir toutes les 6 variables listées

2. ✅ Railway redéploiera automatiquement
   - Le service devrait démarrer correctement
   - Le crash devrait être résolu

3. ✅ Vérifiez le statut
   - Le service ne devrait plus être "Crashed"
   - Il devrait être "Active" ou "Running"

---

## Important

- ⚠️ **DATABASE_URL**: Vous DEVEZ remplacer cette valeur par votre vraie URL Neon
- ✅ **JWT_SECRET**: Utilisez la valeur générée ci-dessus
- ✅ **FRONTEND_URL**: Vérifiez que c'est votre vraie URL Vercel
- 🔒 Ne partagez jamais vos variables d'environnement publiquement
- 💾 Gardez une copie de vos variables dans un endroit sécurisé
