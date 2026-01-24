# PostgreSQL Setup Guide for For You Restaurant

## Step 1: Install PostgreSQL

### On macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
brew services list | grep postgresql
```

### Alternative: Install PostgreSQL.app

Download from: https://postgresapp.com/
- Simple GUI application
- One-click install
- Includes psql command line tools

## Step 2: Create Database

After PostgreSQL is installed and running:

```bash
# Connect to PostgreSQL (default user is your macOS username)
psql postgres

# Or if you need to specify user:
psql -U postgres
```

Then in the PostgreSQL prompt:

```sql
-- Create database
CREATE DATABASE foryou_restaurant;

-- Create user (optional, or use your existing user)
CREATE USER foryou WITH PASSWORD 'foryou_dev_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE foryou_restaurant TO foryou;

-- Exit
\q
```

## Step 3: Update Backend Configuration

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Create .env file with PostgreSQL connection
cat > .env << 'EOF'
DATABASE_URL=postgresql://foryou:foryou_dev_password@localhost:5432/foryou_restaurant?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars-please
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
EOF
```

**Note**: If you're using your macOS username instead of 'foryou', update the DATABASE_URL:
```
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/foryou_restaurant?schema=public
```

## Step 4: Setup Backend

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run seed

# Start backend server
npm run start:dev
```

## Step 5: Setup Frontend

Open a NEW terminal window:

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

## Step 6: Test Connection

```bash
# Test database connection
psql -d foryou_restaurant -c "SELECT 1;"

# Or if using specific user:
psql -U foryou -d foryou_restaurant -c "SELECT 1;"
```

## Troubleshooting

### "psql: command not found"
- Make sure PostgreSQL is installed
- Add PostgreSQL to PATH:
  ```bash
  echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
  source ~/.zshrc
  ```

### "Connection refused"
- Make sure PostgreSQL is running:
  ```bash
  brew services list | grep postgresql
  # If not running:
  brew services start postgresql@15
  ```

### "Database does not exist"
- Create it: `createdb foryou_restaurant`
- Or use psql: `psql postgres -c "CREATE DATABASE foryou_restaurant;"`

### "Password authentication failed"
- Try without password in DATABASE_URL:
  ```
  DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/foryou_restaurant?schema=public
  ```
- Or reset PostgreSQL password (if needed)

## Redis (Optional for now)

Redis is used for caching and queues. For basic functionality, you can skip it initially by setting:
```
REDIS_URL=redis://localhost:6379
```

If you get Redis errors, you can:
1. Install Redis: `brew install redis && brew services start redis`
2. Or comment out Redis-related code temporarily

## Access Your App

Once everything is running:
- **Customer App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Kitchen Display**: http://localhost:3000/kitchen
- **API Docs**: http://localhost:4000/api/docs

## Default Credentials

After seeding:
- **Admin**: admin@foryou.com / admin123
- **Manager**: manager@foryou.com / manager123

