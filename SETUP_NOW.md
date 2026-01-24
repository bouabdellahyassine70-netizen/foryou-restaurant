# 🚀 Quick Setup - PostgreSQL Version

## Current Status
✅ Project code is ready
❌ PostgreSQL needs to be installed
❌ Backend needs to be configured
❌ Frontend needs to be configured

## Step 1: Install PostgreSQL (Choose One Method)

### Method A: Using Homebrew (Recommended)

```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

### Method B: PostgreSQL.app (Easier)

1. Download: https://postgresapp.com/
2. Install and open the app
3. Click "Initialize"

See `INSTALL_POSTGRESQL.md` for detailed instructions.

## Step 2: Create Database

After PostgreSQL is installed:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE foryou_restaurant;

# Exit
\q
```

Or use command line:
```bash
createdb foryou_restaurant
```

## Step 3: Configure Backend

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Copy environment file
cp .env.example .env

# Edit .env and update DATABASE_URL if needed
# If using your macOS username (not 'foryou'), update:
# DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/foryou_restaurant?schema=public
```

## Step 4: Setup Backend

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database (adds sample menu items)
npm run seed

# Start backend server
npm run start:dev
```

✅ Backend should be running on http://localhost:4000

## Step 5: Setup Frontend

**Open a NEW terminal window** (keep backend running):

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=http://localhost:4000" >> .env.local

# Start frontend
npm run dev
```

✅ Frontend should be running on http://localhost:3000

## Step 6: Test It!

1. **Open Customer App**: http://localhost:3000
2. **Browse Menu**: You should see categories and items
3. **Add to Cart**: Click items, add modifiers
4. **View Admin**: http://localhost:3000/admin
5. **View Kitchen**: http://localhost:3000/kitchen
6. **API Docs**: http://localhost:4000/api/docs

## Default Login (after seeding)

- **Admin**: admin@foryou.com / admin123
- **Manager**: manager@foryou.com / manager123

## Troubleshooting

### "psql: command not found"
- PostgreSQL not installed or not in PATH
- See `INSTALL_POSTGRESQL.md`

### "Database does not exist"
- Run: `createdb foryou_restaurant`

### "Connection refused"
- PostgreSQL not running
- Start it: `brew services start postgresql@15` (if using Homebrew)

### "Password authentication failed"
- Update DATABASE_URL in `.env` to use your macOS username:
  ```
  DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/foryou_restaurant?schema=public
  ```

### Redis errors (optional)
- Redis is optional for basic functionality
- Install: `brew install redis && brew services start redis`
- Or ignore Redis errors for now

## Need Help?

- `INSTALL_POSTGRESQL.md` - How to install PostgreSQL
- `POSTGRESQL_SETUP.md` - Detailed PostgreSQL setup
- `QUICK_START.md` - General quick start guide

