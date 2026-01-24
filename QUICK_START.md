# Quick Start Guide

## Local Development Setup

### 1. Start Infrastructure Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker ps
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed

# Start backend
npm run start:dev
```

Backend will run on http://localhost:4000
API docs: http://localhost:4000/api/docs

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local

# Start frontend
npm run dev
```

Frontend will run on http://localhost:3000

### 4. Access the Application

- **Customer App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Kitchen Display**: http://localhost:3000/kitchen
- **API Documentation**: http://localhost:4000/api/docs

### 5. Default Credentials

After seeding:
- **Admin**: admin@foryou.com / admin123
- **Manager**: manager@foryou.com / manager123

## Testing the System

1. **Browse Menu**: Go to homepage, view menu items
2. **Add to Cart**: Click on items, add modifiers, add to cart
3. **Place Order**: Click checkout (you may need to register/login first)
4. **Track Order**: View order status page
5. **Admin**: Login to admin dashboard, view and update orders
6. **Kitchen**: Open kitchen page, see real-time orders

## Production Deployment

See `DEPLOYMENT.md` for AWS ECS/Fargate deployment instructions.

## Load Testing

```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/docs/getting-started/installation/

# Run load test
cd load-test
k6 run k6-load-test.js --env API_URL=http://localhost:4000/api
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `docker ps`
- Check DATABASE_URL in .env
- Try: `docker-compose restart postgres`

### Redis Connection Issues
- Verify Redis is running: `docker ps`
- Check REDIS_URL in .env
- Try: `docker-compose restart redis`

### Port Already in Use
- Backend (4000): Change PORT in .env
- Frontend (3000): Change port in package.json scripts

### Prisma Issues
- Run: `npm run prisma:generate`
- Run: `npm run prisma:migrate`
- Check DATABASE_URL is correct

