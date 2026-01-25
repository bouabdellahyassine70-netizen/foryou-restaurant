# Guide: Supprimer la Commande Pre-Deploy dans Railway

## Problème
Le build réussit ✅ mais la commande "Pre-deploy" échoue ❌, empêchant le déploiement.

## Solution: Supprimer la Commande Pre-Deploy

### Méthode 1: Via Settings (Recommandé)

1. **Ouvrez Railway Dashboard**
   - Allez sur https://railway.app
   - Sélectionnez votre projet "perpetual-tranquility"
   - Cliquez sur le service "foryou-restaurant"

2. **Allez dans Settings**
   - Cliquez sur l'onglet **"Settings"** en haut

3. **Trouvez "Pre-deploy Command"**
   - Dans la section **"Deploy"** ou **"Build"**
   - Cherchez un champ nommé:
     - "Pre-deploy Command"
     - "Pre Deploy Command"
     - "Predeploy Command"
     - Ou similaire

4. **Supprimez la Commande**
   - Effacez tout le contenu du champ
   - Laissez-le **complètement vide**
   - Cliquez sur **"Save"** ou **"Update"**

5. **Redéployez**
   - Railway devrait redéployer automatiquement
   - Ou cliquez sur **"Redeploy"** manuellement

### Méthode 2: Via l'Interface de Déploiement

1. **Ouvrez les Détails du Déploiement**
   - Onglet **"Deployments"**
   - Cliquez sur le dernier déploiement (celui qui a échoué)

2. **Vérifiez la Configuration**
   - Regardez la section **"Configuration"**
   - Cherchez "Pre-deploy Command"
   - Si vous voyez une commande, notez-la

3. **Allez dans Settings**
   - Retournez à **Settings**
   - Supprimez la commande comme dans Méthode 1

### Méthode 3: Via Railway CLI (Si Installé)

```bash
railway service
railway variables
# Cherchez une variable comme RAILWAY_PRE_DEPLOY_COMMAND ou similaire
# Supprimez-la si elle existe
```

## Vérification

Après avoir supprimé la commande pre-deploy:

✅ **Build**: Devrait réussir (déjà le cas)
✅ **Pre-deploy**: Sera ignoré (pas de commande)
✅ **Deploy**: Devrait réussir
✅ **Service**: Devrait démarrer correctement

## Si le Problème Persiste

1. **Vérifiez les Logs**
   - Onglet **"Deploy Logs"** ou **"Build Logs"**
   - Regardez quelle commande exacte est exécutée
   - Copiez l'erreur exacte

2. **Vérifiez les Variables d'Environnement**
   - Settings → Variables
   - Cherchez des variables liées à "pre-deploy" ou "deploy"
   - Supprimez-les si elles existent

3. **Contactez le Support**
   - Utilisez le bouton **"Get Help"** dans Railway
   - Partagez les logs d'erreur

## Note Importante

Le `railway.json` dans le code ne contient **PAS** de commande pre-deploy.
Cela signifie que la commande est configurée directement dans l'interface Railway.
Vous devez la supprimer manuellement dans l'interface.
