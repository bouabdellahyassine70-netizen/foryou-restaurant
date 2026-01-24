# Quick Deployment Checklist

## 🚀 Quick Start (5 minutes)

### 1. Neon Database Setup (2 min)
1. Go to [neon.tech](https://neon.tech) → Sign up
2. Create new project → Copy connection string
3. Save: `DATABASE_URL`

### 2. Backend Deployment - Railway (2 min)
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Deploy from GitHub repo
3. Select `backend` folder
4. Add environment variables:
   ```
   DATABASE_URL=<your-neon-url>
   JWT_SECRET=<random-secret>
   FRONTEND_URL=https://your-app.vercel.app (update after frontend deploy)
   PORT=4000
   NODE_ENV=production
   ```
5. Deploy → Copy backend URL

### 3. Frontend Deployment - Vercel (1 min)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Import Project → Select repo
3. Root Directory: `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>/api
   ```
5. Deploy

### 4. Update Backend CORS
1. Railway dashboard → Variables
2. Update `FRONTEND_URL` with your Vercel URL
3. Redeploy

### 5. Run Migrations
```bash
railway run npx prisma migrate deploy
```

## ✅ Done!

Your app is live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- Database: Neon (managed)

## 📝 Environment Variables Cheat Sheet

**Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL`

**Railway (Backend):**
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PORT=4000`
- `NODE_ENV=production`

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
