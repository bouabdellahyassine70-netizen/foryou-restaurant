# Setup with Postgres.app

Great! I can see Postgres.app is running. Let's get your restaurant system set up.

## Step 1: Create Database in Postgres.app

1. **In Postgres.app**, click the **"+"** button at the bottom left
2. **Enter database name**: `foryou_restaurant`
3. **Click "Create"** or press Enter

You should now see `foryou_restaurant` in your database list!

## Step 2: Configure Backend

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://ilyasmoktary@localhost:5432/foryou_restaurant?schema=public
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

**Note**: I used `ilyasmoktary` as the username (from your database list). If your PostgreSQL user is different, update the DATABASE_URL.

## Step 3: Setup Backend

```bash
cd /Users/ilyasmoktary/Documents/foryou-restaurant/backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Seed database (adds sample menu items)
npm run seed

# Start backend server
npm run start:dev
```

✅ Backend should be running on **http://localhost:4000**

## Step 4: Setup Frontend

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

✅ Frontend should be running on **http://localhost:3000**

## Step 5: Test It!

1. **Customer App**: http://localhost:3000
2. **Admin Dashboard**: http://localhost:3000/admin
3. **Kitchen Display**: http://localhost:3000/kitchen
4. **API Docs**: http://localhost:4000/api/docs

## Default Login (after seeding)

- **Admin**: admin@foryou.com / admin123
- **Manager**: manager@foryou.com / manager123

## Troubleshooting

### "Database does not exist"
- Make sure you created `foryou_restaurant` in Postgres.app
- Check the database name matches in `.env` file

### "Connection refused"
- Make sure Postgres.app is running (green checkmark visible)
- Check port 5432 is correct

### "Password authentication failed"
- If you set a password in Postgres.app, update DATABASE_URL:
  ```
  DATABASE_URL=postgresql://ilyasmoktary:YOUR_PASSWORD@localhost:5432/foryou_restaurant?schema=public
  ```

### Redis errors (optional)
- Redis is optional for basic functionality
- You can ignore Redis errors for now, or install Redis separately

---

**Ready to go! Start with Step 1 above.**

