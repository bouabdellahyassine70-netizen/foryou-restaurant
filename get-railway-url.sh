#!/bin/bash

# Auto-find Railway URL script
# This script tries multiple methods to find your Railway backend URL

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔍 Recherche Automatique de l'URL Railway              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Method 1: Try Railway CLI
if command -v railway &> /dev/null; then
    echo -e "${GREEN}✅ Railway CLI trouvé${NC}"
    echo "Tentative de récupération de l'URL..."
    
    cd backend 2>/dev/null || cd .
    
    # Try to get domain (macOS compatible)
    RAILWAY_DOMAIN=$(railway domain 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1 | sed 's|https://||' | sed 's|/$||')
    
    if [ ! -z "$RAILWAY_DOMAIN" ]; then
        RAILWAY_API_URL="https://${RAILWAY_DOMAIN}/api"
        echo -e "${GREEN}✅ URL Railway trouvée!${NC}"
        echo ""
        echo "┌──────────────────────────────────────────────────────────┐"
        echo "│  Votre URL Railway                                        │"
        echo "└──────────────────────────────────────────────────────────┘"
        echo ""
        echo "Domaine: $RAILWAY_DOMAIN"
        echo "URL API: $RAILWAY_API_URL"
        echo ""
        echo "┌──────────────────────────────────────────────────────────┐"
        echo "│  Configuration Vercel                                    │"
        echo "└──────────────────────────────────────────────────────────┘"
        echo ""
        echo "Allez sur: https://vercel.com/dashboard"
        echo "Votre Projet → Settings → Environment Variables"
        echo ""
        echo "Ajoutez/Mettez à jour:"
        echo "  Key:   NEXT_PUBLIC_API_URL"
        echo "  Value: $RAILWAY_API_URL"
        echo ""
        exit 0
    else
        echo -e "${YELLOW}⚠️  Railway CLI n'est pas connecté${NC}"
        echo ""
        echo "Pour vous connecter:"
        echo "  1. railway login"
        echo "  2. cd backend"
        echo "  3. railway link"
        echo "  4. Relancez ce script"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Railway CLI n'est pas installé${NC}"
    echo ""
    echo "Installation..."
    npm install -g @railway/cli 2>&1 | tail -3
    echo ""
    echo "Une fois installé, connectez-vous:"
    echo "  1. railway login"
    echo "  2. cd backend"
    echo "  3. railway link"
    echo "  4. Relancez ce script"
    echo ""
fi

# Method 2: Instructions manuelles
echo "┌──────────────────────────────────────────────────────────┐"
echo "│  Méthode Manuelle (Plus Simple)                        │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""
echo "1. Ouvrez: https://railway.app/dashboard"
echo "2. Cliquez sur votre service backend"
echo "3. Cliquez sur 'Settings' (⚙️)"
echo "4. Faites défiler jusqu'à 'Networking'"
echo "5. Copiez le 'Public Domain'"
echo "6. Ajoutez /api à la fin"
echo ""
echo "Exemple:"
echo "  Domaine: foryou-restaurant-production.up.railway.app"
echo "  URL API: https://foryou-restaurant-production.up.railway.app/api"
echo ""
