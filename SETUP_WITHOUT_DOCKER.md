# Setup Without Docker

If you have PostgreSQL and Redis installed locally, follow these steps:

## Prerequisites
- PostgreSQL 15+ running locally
- Redis running locally

## Step 1: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE foryou_restaurant;

# Create user (optional)
CREATE USER foryou WITH PASSWORD 'foryou_dev_password';
GRANT ALL PRIVILEGES ON DATABASE foryou_restaurant TO foryou;

# Exit psql
\q
```

## Step 2: Update Backend Environment

```bash
cd backend

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://foryou:foryou_dev_password@localhost:5432/foryou_restaurant?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
EOF
```

## Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed

# Start backend
npm run start:dev
```

## Step 4: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=http://localhost:4000" >> .env.local

# Start frontend
npm run dev
```

## Verify Services

```bash
# Check PostgreSQL
psql -U foryou -d foryou_restaurant -c "SELECT 1;"

# Check Redis
redis-cli ping
# Should return: PONG
```

If both work, you're ready to go!

