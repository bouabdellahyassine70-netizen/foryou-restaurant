# Variables d'Environnement Railway - Liste Complète

## Variables Requises pour Railway Backend

### 1. DATABASE_URL
**Nom:** `DATABASE_URL`  
**Valeur:** `[VOTRE_URL_NEON_POSTGRESQL]`  
**Comment obtenir:**
- Allez sur https://console.neon.tech
- Sélectionnez votre projet
- Allez dans "Connection Details" ou "Connection String"
- Copiez l'URL complète
**Format:** `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`  
**Exemple:** `postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

### 2. JWT_SECRET
**Nom:** `JWT_SECRET`  
**Valeur:** `[GÉNÉRÉ_CI-DESSOUS]`  
**Comment générer:** Exécutez `openssl rand -base64 32` dans votre terminal  
**Valeur générée pour vous:**
```
[Voir ci-dessous - je vais générer une valeur]
```
**Important:** Gardez ce secret sécurisé et ne le partagez jamais publiquement

---

### 3. JWT_EXPIRES_IN
**Nom:** `JWT_EXPIRES_IN`  
**Valeur:** `7d`  
**Description:** Durée de validité des tokens JWT (7 jours)

---

### 4. FRONTEND_URL
**Nom:** `FRONTEND_URL`  
**Valeur:** `https://foryou-restaurant-k0jzjwrse.vercel.app`  
**Description:** URL de votre frontend Vercel  
**Note:** Si votre URL Vercel est différente, remplacez par votre URL réelle

---

### 5. PORT
**Nom:** `PORT`  
**Valeur:** `4000`  
**Description:** Port sur lequel le serveur écoute

---

### 6. NODE_ENV
**Nom:** `NODE_ENV`  
**Valeur:** `production`  
**Description:** Environnement d'exécution

---

## Liste Complète à Copier-Coller

### Pour Railway Dashboard → Variables → "+ New Variable"

**Variable 1:**
```
Nom: DATABASE_URL
Valeur: [COLLEZ VOTRE URL NEON ICI]
```

**Variable 2:**
```
Nom: JWT_SECRET
Valeur: [VALEUR GÉNÉRÉE CI-DESSOUS]
```

**Variable 3:**
```
Nom: JWT_EXPIRES_IN
Valeur: 7d
```

**Variable 4:**
```
Nom: FRONTEND_URL
Valeur: https://foryou-restaurant-k0jzjwrse.vercel.app
```

**Variable 5:**
```
Nom: PORT
Valeur: 4000
```

**Variable 6:**
```
Nom: NODE_ENV
Valeur: production
```

---

## Exemple de Configuration Complète

Une fois que vous avez toutes les valeurs, voici à quoi ça devrait ressembler:

```
DATABASE_URL=postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1pQ3
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://foryou-restaurant-k0jzjwrse.vercel.app
PORT=4000
NODE_ENV=production
```

---

## Instructions d'Installation

1. **Ouvrez Railway Dashboard**
   - Allez sur https://railway.app
   - Sélectionnez votre projet "perpetual-tranquility"
   - Cliquez sur le service "foryou-restaurant"
   - Cliquez sur l'onglet **"Variables"**

2. **Ajoutez chaque variable**
   - Cliquez sur **"+ New Variable"** (en haut à droite)
   - Entrez le **Nom** exactement comme indiqué ci-dessus
   - Entrez la **Valeur** correspondante
   - Cliquez sur **"Add"** ou **"Save"**
   - Répétez pour chaque variable

3. **Vérifiez**
   - Vous devriez voir toutes les 6 variables listées
   - Railway redéploiera automatiquement
   - Le service devrait démarrer correctement

---

## Ordre d'Importance

Si vous ne pouvez ajouter qu'une variable à la fois, ajoutez-les dans cet ordre:

1. **DATABASE_URL** (le plus critique - sans ça, le service ne peut pas démarrer)
2. **JWT_SECRET** (critique pour l'authentification)
3. **FRONTEND_URL** (nécessaire pour CORS)
4. **JWT_EXPIRES_IN** (recommandé)
5. **PORT** (recommandé)
6. **NODE_ENV** (recommandé)

---

## Note Importante

- Remplacez `[VOTRE_URL_NEON_POSTGRESQL]` par votre vraie URL Neon
- Remplacez `[VALEUR GÉNÉRÉE CI-DESSOUS]` par la valeur JWT_SECRET générée
- Ne partagez jamais vos variables d'environnement publiquement
- Gardez une copie de vos variables dans un endroit sécurisé
