#!/bin/bash
# Script to initialize and push to GitHub

cd /Users/yassinbouabdellah/Downloads/foryou-restaurant

echo "🚀 Initializing Git repository..."
git init

echo "📦 Adding all files..."
git add .

echo "💾 Creating initial commit..."
git commit -m "Initial commit - Restaurant app ready for deployment"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/new"
echo "2. Create repository named: foryou-restaurant"
echo "3. Copy the repository URL (it will look like:)"
echo "   https://github.com/YOUR_USERNAME/foryou-restaurant.git"
echo ""
echo "4. Then run these commands (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/foryou-restaurant.git"
echo "   git branch -M main"
echo "   git push -u origin main"
