#!/bin/bash

# 🔧 Auto-Fix Environment Variables Script
# This script helps you set the correct environment variables

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔧 Environment Variables Setup Helper                  ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "This script will help you configure environment variables."
echo ""

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo -e "${GREEN}✅ Railway CLI found${NC}"
    HAS_RAILWAY_CLI=true
else
    echo -e "${YELLOW}⚠️  Railway CLI not found. Install it with: npm i -g @railway/cli${NC}"
    HAS_RAILWAY_CLI=false
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
    HAS_VERCEL_CLI=true
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Install it with: npm i -g vercel${NC}"
    HAS_VERCEL_CLI=false
fi

echo ""
echo "┌──────────────────────────────────────────────────────────┐"
echo "│  STEP 1: Get Your Railway Backend URL                   │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""
echo "1. Go to: https://railway.app/dashboard"
echo "2. Click on your backend service"
echo "3. Go to Settings → Networking"
echo "4. Copy the 'Public Domain' (e.g., your-app.up.railway.app)"
echo ""
read -p "Enter your Railway backend URL (without https://): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
    echo -e "${RED}❌ Railway URL is required!${NC}"
    exit 1
fi

# Clean the URL
RAILWAY_URL=$(echo "$RAILWAY_URL" | tr -d ' ' | sed 's|^https\?://||' | sed 's|/$||')
RAILWAY_API_URL="https://${RAILWAY_URL}/api"

echo ""
echo -e "${GREEN}✅ Railway API URL: ${RAILWAY_API_URL}${NC}"
echo ""

echo "┌──────────────────────────────────────────────────────────┐"
echo "│  STEP 2: Get Your Vercel Frontend URL                   │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click on your project"
echo "3. Go to Settings → Domains"
echo "4. Copy the production domain"
echo ""
read -p "Enter your Vercel frontend URL (without https://): " VERCEL_URL

if [ -z "$VERCEL_URL" ]; then
    echo -e "${RED}❌ Vercel URL is required!${NC}"
    exit 1
fi

# Clean the URL
VERCEL_URL=$(echo "$VERCEL_URL" | tr -d ' ' | sed 's|^https\?://||' | sed 's|/$||')
VERCEL_FULL_URL="https://${VERCEL_URL}"

echo ""
echo -e "${GREEN}✅ Vercel Frontend URL: ${VERCEL_FULL_URL}${NC}"
echo ""

echo "┌──────────────────────────────────────────────────────────┐"
echo "│  Setting Environment Variables                           │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""

# Set Railway variable
if [ "$HAS_RAILWAY_CLI" = true ]; then
    echo "Setting FRONTEND_URL in Railway..."
    railway variables set FRONTEND_URL="$VERCEL_FULL_URL" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Set FRONTEND_URL in Railway${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not set Railway variable automatically${NC}"
        echo "   Please set it manually: FRONTEND_URL=$VERCEL_FULL_URL"
    fi
else
    echo -e "${YELLOW}⚠️  Railway CLI not available${NC}"
    echo "   Please set manually in Railway dashboard:"
    echo "   FRONTEND_URL=$VERCEL_FULL_URL"
fi

# Set Vercel variable
if [ "$HAS_VERCEL_CLI" = true ]; then
    echo "Setting NEXT_PUBLIC_API_URL in Vercel..."
    vercel env add NEXT_PUBLIC_API_URL production <<< "$RAILWAY_API_URL" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Set NEXT_PUBLIC_API_URL in Vercel${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not set Vercel variable automatically${NC}"
        echo "   Please set it manually: NEXT_PUBLIC_API_URL=$RAILWAY_API_URL"
    fi
else
    echo -e "${YELLOW}⚠️  Vercel CLI not available${NC}"
    echo "   Please set manually in Vercel dashboard:"
    echo "   NEXT_PUBLIC_API_URL=$RAILWAY_API_URL"
fi

echo ""
echo "┌──────────────────────────────────────────────────────────┐"
echo "│  Manual Setup Instructions                               │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""
echo "If automatic setup didn't work, set these manually:"
echo ""
echo -e "${GREEN}VERCEL:${NC}"
echo "  1. Go to: https://vercel.com/dashboard"
echo "  2. Your Project → Settings → Environment Variables"
echo "  3. Add: NEXT_PUBLIC_API_URL = $RAILWAY_API_URL"
echo "  4. Redeploy"
echo ""
echo -e "${GREEN}RAILWAY:${NC}"
echo "  1. Go to: https://railway.app/dashboard"
echo "  2. Your Service → Variables"
echo "  3. Add: FRONTEND_URL = $VERCEL_FULL_URL"
echo "  4. Restart service"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
