#!/bin/bash

# Auto-configure Vercel with Railway URL
# Usage: ./configure-vercel.sh YOUR-RAILWAY-URL

RAILWAY_URL="$1"

if [ -z "$RAILWAY_URL" ]; then
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  🔧 Configuration Automatique Vercel                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Usage: ./configure-vercel.sh YOUR-RAILWAY-URL"
    echo ""
    echo "Exemple:"
    echo "  ./configure-vercel.sh foryou-restaurant-production.up.railway.app"
    echo ""
    echo "Ou avec https://:"
    echo "  ./configure-vercel.sh https://foryou-restaurant-production.up.railway.app"
    echo ""
    exit 1
fi

# Clean the URL
RAILWAY_URL=$(echo "$RAILWAY_URL" | sed 's|^https\?://||' | sed 's|/$||' | sed 's|/api$||')
RAILWAY_API_URL="https://${RAILWAY_URL}/api"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ Configuration Vercel                                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "URL Railway: $RAILWAY_URL"
echo "URL API: $RAILWAY_API_URL"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI trouvé"
    echo ""
    echo "Configuration automatique..."
    echo "Key: NEXT_PUBLIC_API_URL"
    echo "Value: $RAILWAY_API_URL"
    echo ""
    echo "Pour configurer avec Vercel CLI:"
    echo "  vercel env add NEXT_PUBLIC_API_URL production"
    echo "  (Entrez: $RAILWAY_API_URL)"
    echo ""
else
    echo "⚠️  Vercel CLI non installé"
    echo ""
    echo "Installation..."
    npm install -g vercel 2>&1 | tail -3
    echo ""
fi

echo "┌──────────────────────────────────────────────────────────┐"
echo "│  Configuration Manuelle dans Vercel                     │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""
echo "1. Allez sur: https://vercel.com/dashboard"
echo "2. Votre Projet → Settings → Environment Variables"
echo "3. Supprimez l'ancien NEXT_PUBLIC_API_URL (s'il contient 'placeholder')"
echo "4. Ajoutez:"
echo ""
echo "   Key:   NEXT_PUBLIC_API_URL"
echo "   Value: $RAILWAY_API_URL"
echo ""
echo "5. Sauvegardez → Redéployez"
echo ""
echo "✅ Une fois configuré, votre app fonctionnera!"
