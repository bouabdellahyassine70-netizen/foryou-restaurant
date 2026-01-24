#!/bin/bash

echo "🔍 Finding PostgreSQL binary..."

# Try different Postgres.app paths
PSQL_PATHS=(
    "/Applications/Postgres.app/Contents/Versions/latest/bin/psql"
    "/Applications/Postgres.app/Contents/Versions/18/bin/psql"
    "/Applications/Postgres.app/Contents/Versions/17/bin/psql"
    "/Applications/Postgres.app/Contents/Versions/16/bin/psql"
    "/Applications/Postgres.app/Contents/Versions/15/bin/psql"
)

PSQL=""
for path in "${PSQL_PATHS[@]}"; do
    if [ -f "$path" ]; then
        PSQL="$path"
        echo "✅ Found PostgreSQL at: $PSQL"
        break
    fi
done

if [ -z "$PSQL" ]; then
    echo "❌ Could not find psql"
    echo ""
    echo "Please create the database manually:"
    echo "1. Open Postgres.app"
    echo "2. Click the '+' button at the bottom"
    echo "3. Enter database name: foryou_restaurant"
    echo "4. Click 'Create'"
    exit 1
fi

# Get directory for createdb
PSQL_DIR=$(dirname "$PSQL")
CREATEDB="$PSQL_DIR/createdb"

echo ""
echo "📝 Creating database 'foryou_restaurant'..."

# Create database
"$CREATEDB" foryou_restaurant 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database 'foryou_restaurant' created successfully!"
    echo ""
    echo "📋 Database connection info:"
    echo "   Database: foryou_restaurant"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   User: $(whoami)"
    echo ""
    echo "🔗 DATABASE_URL for .env file:"
    echo "   DATABASE_URL=postgresql://$(whoami)@localhost:5432/foryou_restaurant?schema=public"
else
    echo "⚠️  Database might already exist, or there was an error"
    echo "   You can create it manually in Postgres.app by clicking '+'"
fi

