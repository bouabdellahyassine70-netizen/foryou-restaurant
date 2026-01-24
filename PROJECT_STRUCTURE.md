# Project Structure

```
foryou-restaurant/
├── backend/                          # NestJS API
│   ├── src/
│   │   ├── auth/                    # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── menu/                    # Menu management
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu.service.ts
│   │   │   ├── menu.module.ts
│   │   │   └── dto/
│   │   ├── orders/                  # Order management
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── orders.module.ts
│   │   │   └── dto/
│   │   ├── payments/                # Payment processing
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── payments.module.ts
│   │   ├── promo-codes/             # Promo code management
│   │   ├── tables/                  # Table/QR code management
│   │   ├── users/                   # User management
│   │   ├── websocket/               # Real-time WebSocket
│   │   │   └── websocket.gateway.ts
│   │   ├── common/                  # Shared utilities
│   │   │   ├── prisma/
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   └── filters/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── seed.ts                  # Seed data
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── page.tsx            # Homepage (customer menu)
│   │   │   ├── admin/               # Admin dashboard
│   │   │   ├── kitchen/            # Kitchen Display System
│   │   │   ├── orders/[id]/        # Order tracking
│   │   │   ├── layout.tsx
│   │   │   ├── providers.tsx
│   │   │   └── globals.css
│   │   ├── components/             # React components
│   │   │   ├── Menu.tsx
│   │   │   └── Cart.tsx
│   │   ├── lib/                     # Utilities
│   │   │   ├── api.ts              # API client
│   │   │   └── store.ts            # Zustand stores
│   │   └── types/                   # TypeScript types
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── load-test/                       # Load testing scripts
│   └── k6-load-test.js
│
├── docker-compose.yml               # Local development services
├── README.md                        # Main documentation
├── QUICK_START.md                   # Quick start guide
├── DEPLOYMENT.md                    # Production deployment
├── SMOKE_TESTS.md                   # Testing checklist
└── .gitignore
```

## Key Features by Module

### Backend Modules

1. **Auth Module**: JWT authentication, registration, login
2. **Menu Module**: Categories, items, modifiers, availability
3. **Orders Module**: Order creation, status management, cancellation
4. **Payments Module**: Stripe integration, payment intents, refunds
5. **Promo Codes Module**: Discount codes, validation, usage tracking
6. **Tables Module**: Table management, QR code generation
7. **Users Module**: User CRUD, role management
8. **WebSocket Module**: Real-time order updates

### Frontend Pages

1. **Homepage** (`/`): Customer menu browsing and cart
2. **Admin** (`/admin`): Order management, menu CRUD, user management
3. **Kitchen** (`/kitchen`): Real-time kitchen display system
4. **Order Tracking** (`/orders/[id]`): Customer order status tracking

## Database Schema

- **User**: Authentication, roles (ADMIN, MANAGER, KITCHEN_STAFF, WAITER, CUSTOMER)
- **Category**: Menu categories
- **MenuItem**: Food items with prices
- **Modifier**: Item customizations (extra cheese, size, etc.)
- **Order**: Orders with status tracking
- **OrderItem**: Order line items
- **OrderItemModifier**: Modifiers applied to order items
- **Table**: Restaurant tables with QR codes
- **PromoCode**: Discount codes
- **AuditLog**: Activity logging

## Order Status Flow

```
CREATED → PAID/CONFIRMED → ACCEPTED → PREPARING → READY → SERVED/DISPATCHED → COMPLETED
                              ↓
                         CANCELLED (with refund if paid)
```

## Technology Stack

- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL, Redis, Socket.io
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Zustand, React Query
- **Infrastructure**: Docker, AWS ECS/Fargate, ALB, RDS, ElastiCache
- **Monitoring**: CloudWatch, Sentry
- **Testing**: k6 (load testing)

