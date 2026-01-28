#!/bin/bash

# Script pour exécuter le seed avec une DATABASE_URL fournie

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || nvm use node 2>/dev/null || true

export PATH="$HOME/.nvm/versions/node/$(nvm version)/bin:$PATH"

cd "$(dirname "$0")"

echo "🌱 Seed de la base de données"
echo ""

# Vérifier si DATABASE_URL est fourni
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erreur: DATABASE_URL n'est pas défini"
    echo ""
    echo "Usage:"
    echo "  DATABASE_URL='votre-url-neon' ./seed-with-db-url.sh"
    echo ""
    echo "Pour obtenir votre DATABASE_URL:"
    echo "  1. Allez sur https://railway.app"
    echo "  2. Sélectionnez votre projet backend"
    echo "  3. Allez dans Variables"
    echo "  4. Copiez la valeur de DATABASE_URL"
    echo ""
    exit 1
fi

echo "📦 Installation des dépendances..."
npm install --silent

echo ""
echo "🔧 Génération du client Prisma..."
npx prisma generate

echo ""
echo "🌱 Exécution du seed..."
npm run seed

echo ""
echo "✅ Seed terminé avec succès!"
echo ""
echo "Rafraîchissez votre site Vercel pour voir les produits."
