# Deployment Guide: Vercel + GitHub + Neon

This guide will help you deploy your For You Restaurant application using:
- **Vercel** for frontend (Next.js)
- **Railway/Render** for backend (NestJS)
- **Neon** for PostgreSQL database
- **GitHub** for version control and CI/CD

## Prerequisites

1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. Neon account (sign up at [neon.tech](https://neon.tech))
4. Railway account (sign up at [railway.app](https://railway.app)) OR Render account ([render.com](https://render.com))

---

## Step 1: Set Up Neon Database

1. **Create a Neon account** at [neon.tech](https://neon.tech)
2. **Create a new project**:
   - Click "Create Project"
   - Choose a project name (e.g., "foryou-restaurant")
   - Select a region closest to your users
   - Click "Create Project"

3. **Get your connection string**:
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string (it looks like: `postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require`)
   - **Save this** - you'll need it for the backend

4. **Run migrations** (you can do this later via Railway/Render or locally):
   ```bash
   cd backend
   DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
   ```

---

## Step 2: Deploy Backend to Railway

### Option A: Railway (Recommended)

1. **Install Railway CLI** (optional, or use web interface):
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Create a new project**:
   ```bash
   railway init
   ```

3. **Add environment variables** in Railway dashboard:
   - Go to your project → Variables
   - Add the following:
     ```
     DATABASE_URL=your-neon-connection-string
     JWT_SECRET=your-random-secret-key
     JWT_EXPIRES_IN=7d
     FRONTEND_URL=https://your-frontend.vercel.app
     PORT=4000
     NODE_ENV=production
     REDIS_URL=redis://default:password@host:port (if using Redis)
     ```

4. **Deploy**:
   ```bash
   railway up
   ```

   Or use the Railway web interface:
   - Connect your GitHub repo
   - Select the `backend` folder as root directory
   - Railway will auto-detect NestJS and deploy

5. **Run migrations**:
   ```bash
   railway run npx prisma migrate deploy
   ```

6. **Get your backend URL**:
   - Railway will provide a URL like: `https://your-app.railway.app`
   - **Save this URL** - you'll need it for the frontend

### Option B: Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Node

4. **Add environment variables** (same as Railway above)

5. **Deploy** and get your backend URL

---

## Step 3: Deploy Frontend to Vercel

### Method 1: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

4. **Add environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://your-backend-url.railway.app/api
   ```

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your GitHub repository**:
   - Select your repository
   - Click "Import"

4. **Configure the project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add environment variables**:
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app/api
     ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at: `https://your-project.vercel.app`

---

## Step 4: Update Backend CORS

After deploying the frontend, update your backend CORS settings:

1. **Go to Railway/Render dashboard**
2. **Update the `FRONTEND_URL` environment variable**:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. **Redeploy** the backend (or it will auto-redeploy)

---

## Step 5: Run Database Migrations

Make sure your database schema is up to date:

```bash
# Using Railway CLI
railway run npx prisma migrate deploy

# Or using Render shell
# Go to Render dashboard → Shell → Run:
cd backend
npx prisma migrate deploy
```

---

## Step 6: Seed Database (Optional)

If you have seed data:

```bash
# Railway
railway run npm run seed

# Render (via shell)
npm run seed
```

---

## Step 7: Set Up GitHub Actions (Optional)

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`.

To enable it:

1. **Get Vercel tokens**:
   - Go to Vercel → Settings → Tokens
   - Create a new token
   - Copy the token

2. **Get Vercel Project IDs**:
   - Go to your Vercel project → Settings → General
   - Copy "Project ID" and "Organization ID"

3. **Add GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID
     - `NEXT_PUBLIC_API_URL`: Your backend API URL
     - `DATABASE_URL`: Your Neon database URL

4. **Push to main branch** - GitHub Actions will automatically deploy

---

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway/Render)
- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Random secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration (e.g., `7d`)
- `FRONTEND_URL`: Frontend URL (e.g., `https://your-app.vercel.app`)
- `PORT`: Server port (default: `4000`)
- `NODE_ENV`: `production`
- `REDIS_URL`: (Optional) Redis connection string
- `STRIPE_SECRET_KEY`: (Optional) Stripe secret key
- `SENTRY_DSN`: (Optional) Sentry DSN for error tracking

---

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend CORS allows your frontend URL
- Check backend is running and accessible

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure SSL mode is enabled (`?sslmode=require`)

### Build failures
- Check Node.js version matches (18.x)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel/Railway dashboard

### CORS errors
- Update `FRONTEND_URL` in backend environment variables
- Redeploy backend after changing CORS settings

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Frontend can connect to backend API
- [ ] Admin login works
- [ ] Orders can be created
- [ ] Images upload correctly (check file storage)
- [ ] WebSocket connections work (if using real-time features)

---

## Useful Commands

```bash
# Check backend logs (Railway)
railway logs

# Check backend logs (Render)
# Go to Render dashboard → Logs

# Run Prisma Studio (local, connects to Neon)
DATABASE_URL="your-neon-url" npx prisma studio

# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs
