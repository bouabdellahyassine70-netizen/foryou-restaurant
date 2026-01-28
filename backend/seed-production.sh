#!/bin/bash

# Script pour seed la base de données de production (Neon)

echo "🌱 Seed de la base de données de production"
echo ""

# Vérifier si DATABASE_URL est fourni
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL n'est pas défini"
  echo ""
  echo "Usage:"
  echo "  DATABASE_URL='votre-url-neon' ./seed-production.sh"
  echo ""
  echo "Ou via Railway CLI:"
  echo "  railway run npm run seed"
  echo ""
  exit 1
fi

echo "📦 Installation des dépendances..."
npm install

echo ""
echo "🔧 Génération du client Prisma..."
npx prisma generate

echo ""
echo "🌱 Exécution du seed..."
npm run seed

echo ""
echo "✅ Seed terminé!"
