#!/bin/bash

# Script pour exécuter le seed sur Railway via CLI

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || nvm use node 2>/dev/null || true

export PATH="$HOME/.nvm/versions/node/$(nvm version)/bin:$PATH"

cd "$(dirname "$0")"

echo "🌱 Exécution du seed sur Railway..."
echo ""

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé"
    echo "Installation..."
    npm install -g @railway/cli
fi

# Vérifier l'authentification
if ! railway whoami &> /dev/null; then
    echo "⚠️  Vous devez vous connecter à Railway d'abord"
    echo ""
    echo "Exécutez cette commande dans votre terminal:"
    echo "  railway login"
    echo ""
    echo "Puis réessayez ce script."
    exit 1
fi

# Vérifier si le projet est lié
if [ ! -f ".railway" ]; then
    echo "⚠️  Le projet n'est pas lié à Railway"
    echo ""
    echo "Exécutez cette commande dans votre terminal:"
    echo "  railway link"
    echo ""
    echo "Sélectionnez votre projet Railway, puis réessayez ce script."
    exit 1
fi

echo "✅ Railway CLI configuré"
echo ""

# Exécuter le seed via Railway
echo "🚀 Exécution du seed sur la base de données de production..."
railway run npm run seed

echo ""
echo "✅ Seed terminé avec succès!"
echo ""
echo "Rafraîchissez votre site Vercel pour voir les produits."
