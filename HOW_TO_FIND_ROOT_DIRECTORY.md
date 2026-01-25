# 🔍 Comment Trouver Root Directory dans Railway

## Méthode 1: Settings Tab

1. **Allez sur**: https://railway.app/dashboard
2. **Cliquez** sur votre projet "perpetual-tranquility"
3. **Cliquez** sur votre service "foryou-restaurant"
4. **Cliquez** sur l'onglet **"Settings"** (en haut, à côté de "Deployments", "Variables", etc.)
5. **Faites défiler** jusqu'à la section **"Build & Deploy"** ou **"Service Settings"**
6. Cherchez **"Root Directory"** ou **"Working Directory"**

## Méthode 2: Service Settings (Nouvelle Interface)

Dans la nouvelle interface Railway:

1. Railway Dashboard → Votre Projet
2. Cliquez sur votre service "foryou-restaurant"
3. En haut, vous verrez plusieurs onglets: **"Deployments"**, **"Variables"**, **"Metrics"**, **"Settings"**
4. Cliquez sur **"Settings"**
5. Cherchez dans les sections:
   - **"Build"** section
   - **"Deploy"** section
   - **"Service"** section

## Méthode 3: Si Root Directory n'existe pas

Si vous ne trouvez pas "Root Directory", Railway utilise peut-être une configuration différente.

### Alternative: Créer nixpacks.toml

Créez un fichier `nixpacks.toml` dans le dossier `backend/`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build", "npx prisma generate"]

[start]
cmd = "npm run start:prod"
```

### Alternative: Utiliser Dockerfile

Railway peut utiliser un Dockerfile si présent dans le dossier backend.

## Méthode 4: Vérifier dans les Deployments

1. Railway Dashboard → Votre Service
2. Cliquez sur **"Deployments"**
3. Cliquez sur le dernier déploiement (celui qui a échoué)
4. Regardez les logs - ils peuvent indiquer le dossier utilisé

## Solution Rapide: Créer nixpacks.toml

Si vous ne trouvez pas Root Directory, créez ce fichier dans `backend/nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build", "npx prisma generate"]

[start]
cmd = "npm run start:prod"
```

Puis poussez vers GitHub et Railway devrait le détecter automatiquement.
