
#!/bin/bash
# Script automatisé pour seed la base de données Railway

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || nvm use node 2>/dev/null || true
export PATH="$HOME/.nvm/versions/node/$(nvm version)/bin:$PATH"

cd "$(dirname "$0")"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🌱 Seed de la Base de Données Railway                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Méthode 1: Via Railway CLI (si authentifié)
if command -v railway &> /dev/null && railway whoami &> /dev/null 2>&1; then
    echo "✅ Railway CLI détecté et authentifié"
    echo "🚀 Exécution du seed via Railway CLI..."
    echo ""
    railway run npm run seed
    echo ""
    echo "✅ Seed terminé!"
    exit 0
fi

# Méthode 2: Via DATABASE_URL fournie
if [ ! -z "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL fournie"
    echo "🚀 Exécution du seed avec DATABASE_URL..."
    echo ""
    npm install --silent
    npx prisma generate
    npm run seed
    echo ""
    echo "✅ Seed terminé!"
    exit 0
fi

# Si aucune méthode ne fonctionne
echo "❌ Aucune méthode disponible"
echo ""
echo "Option 1: Authentifiez-vous avec Railway CLI:"
echo "  railway login"
echo "  railway link"
echo "  ./seed-now.sh"
echo ""
echo "Option 2: Fournissez DATABASE_URL:"
echo "  DATABASE_URL='votre-url' ./seed-now.sh"
echo ""
echo "Option 3: Utilisez Railway Dashboard Shell:"
echo "  1. Allez sur https://railway.app"
echo "  2. Ouvrez votre projet backend"
echo "  3. Cliquez sur 'Shell'"
echo "  4. Exécutez: cd backend && npm run seed"
exit 1
