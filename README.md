# For You Restaurant - Production Ordering System

A production-grade restaurant ordering platform supporting dine-in (QR/table), takeaway, and delivery with real-time kitchen updates.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router) - Customer & Admin UI
- TypeScript
- Tailwind CSS
- React Query
- Socket.io Client

**Backend:**
- NestJS - Production-grade API
- PostgreSQL - Primary database
- Redis - Caching & queues
- BullMQ - Job queues
- Socket.io - Real-time WebSocket
- Prisma - ORM

**Infrastructure:**
- Docker & Docker Compose
- AWS ECS/Fargate (production)
- Application Load Balancer
- CloudWatch for monitoring
- Sentry for error tracking

**Payment:**
- Stripe (optional toggle)
- Pay at counter

## Features

- ✅ Customer web app: menu browsing, modifiers, cart, checkout, order tracking, QR table ordering
- ✅ Admin dashboard: menu CRUD, pricing, availability schedules, promo codes, user management
- ✅ Kitchen Display System: live tickets, station routing, status updates
- ✅ Real-time order updates via WebSocket
- ✅ Multiple order types: dine-in, takeaway, delivery
- ✅ Payment processing (Stripe + counter payment)
- ✅ Production-ready: auth, validation, rate limiting, monitoring

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Local Development

```bash
# Start all services
docker-compose up -d

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run migrations
cd backend && npm run prisma:migrate
cd backend && npm run seed

# Start backend
cd backend && npm run start:dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

Access:
- Customer app: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin
- API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

## Production Deployment

See `DEPLOYMENT.md` for AWS deployment instructions.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│   NestJS    │────▶│ PostgreSQL  │
│  Frontend   │     │    API      │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                            │
                            ├────▶ Redis (Cache/Queue)
                            │
                            └────▶ Socket.io (Real-time)
```

## Order Status Flow

```
created → paid/confirmed → accepted → preparing → ready → served/dispatched → completed
                              │
                              └──→ cancelled (with refund if paid)
```

## Project Structure

```
foryou-restaurant/
├── backend/          # NestJS API
├── frontend/         # Next.js app
├── docker-compose.yml
├── .env.example
└── docs/            # Documentation
```

