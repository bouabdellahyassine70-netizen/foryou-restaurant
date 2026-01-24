# 🚀 START HERE - Get Your Restaurant System Running

Follow these steps to get your For You Restaurant ordering system up and running.

## Prerequisites Check

First, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ Docker Desktop installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### Step 1: Start Database & Redis (2 minutes)

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant

# Start PostgreSQL and Redis containers
docker-compose up -d

# Verify they're running
docker ps
```

You should see `foryou-postgres` and `foryou-redis` containers running.

### Step 2: Setup Backend (5 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# The .env file is already configured for local development
# No changes needed unless you want to customize

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run seed

# Start the backend server
npm run start:dev
```

✅ **Backend should now be running on http://localhost:4000**
✅ **API docs available at http://localhost:4000/api/docs**

### Step 3: Setup Frontend (3 minutes)

**Open a NEW terminal window** (keep backend running), then:

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=http://localhost:4000" >> .env.local

# Start the frontend
npm run dev
```

✅ **Frontend should now be running on http://localhost:3000**

## Step 4: Test the System

### 1. Open Customer App
- Go to: http://localhost:3000
- You should see the menu with categories and items
- Try adding items to cart

### 2. Test Admin Dashboard
- Go to: http://localhost:3000/admin
- View orders, update statuses

### 3. Test Kitchen Display
- Go to: http://localhost:3000/kitchen
- See real-time order updates

### 4. Check API Documentation
- Go to: http://localhost:4000/api/docs
- Explore all available endpoints

## Default Login Credentials

After seeding, you can use:
- **Admin**: admin@foryou.com / admin123
- **Manager**: manager@foryou.com / manager123

## Quick Test Flow

1. **Browse Menu** → http://localhost:3000
2. **Add Items to Cart** → Click on menu items, add modifiers
3. **Place Order** → Click checkout (creates order)
4. **View in Kitchen** → http://localhost:3000/kitchen (see new order)
5. **Update Status** → In kitchen, click "Start" → "Ready" → "Served"
6. **View in Admin** → http://localhost:3000/admin (see all orders)

## Troubleshooting

### "Port already in use"
- Backend (4000): Kill process using port 4000 or change PORT in `.env`
- Frontend (3000): Kill process using port 3000

### "Cannot connect to database"
- Make sure Docker is running: `docker ps`
- Restart containers: `docker-compose restart`

### "Prisma errors"
- Run: `npm run prisma:generate` in backend folder
- Run: `npm run prisma:migrate` in backend folder

### "Module not found"
- Run: `npm install` in both backend and frontend folders

## Next Steps After Setup

1. **Customize Menu**: Edit `backend/prisma/seed.ts` to add your restaurant's items
2. **Configure Stripe**: Add your Stripe keys in `backend/.env` (optional)
3. **Deploy to Production**: See `DEPLOYMENT.md` for AWS setup
4. **Run Load Tests**: See `load-test/k6-load-test.js`

## Need Help?

- Check `QUICK_START.md` for detailed instructions
- Check `SMOKE_TESTS.md` for testing checklist
- Check `DEPLOYMENT.md` for production deployment

---

**🎉 You're all set! The system is ready to use.**

