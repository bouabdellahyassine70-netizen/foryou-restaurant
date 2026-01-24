#!/bin/bash

echo "🔍 Finding PostgreSQL installation..."

# Check for PostgreSQL.app
if [ -d "/Applications/Postgres.app" ]; then
    echo "✅ Found PostgreSQL.app"
    export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
    echo "Added PostgreSQL.app to PATH for this session"
fi

# Check for Homebrew PostgreSQL
if [ -d "/opt/homebrew/opt/postgresql@15" ]; then
    echo "✅ Found Homebrew PostgreSQL"
    export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
    echo "Added Homebrew PostgreSQL to PATH for this session"
elif [ -d "/usr/local/opt/postgresql@15" ]; then
    echo "✅ Found Homebrew PostgreSQL (Intel)"
    export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
    echo "Added Homebrew PostgreSQL to PATH for this session"
fi

# Check if psql is now available
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is accessible!"
    psql --version
    
    echo ""
    echo "📝 Next steps:"
    echo "1. Create database: createdb foryou_restaurant"
    echo "2. Or connect: psql postgres"
    echo ""
    echo "To make this permanent, add to ~/.zshrc:"
    if [ -d "/Applications/Postgres.app" ]; then
        echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"'
    elif [ -d "/opt/homebrew/opt/postgresql@15" ]; then
        echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"'
    fi
else
    echo "❌ PostgreSQL not found in common locations"
    echo ""
    echo "If you installed PostgreSQL.app:"
    echo "1. Open /Applications/Postgres.app"
    echo "2. Click 'Initialize' if needed"
    echo "3. The app will add psql to PATH automatically"
    echo ""
    echo "If you installed via Homebrew:"
    echo "1. Run: brew services start postgresql@15"
    echo "2. Add to PATH: export PATH=\"/opt/homebrew/opt/postgresql@15/bin:\$PATH\""
fi

