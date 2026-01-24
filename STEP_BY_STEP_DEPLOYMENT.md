# Step-by-Step Deployment Guide

## 🎯 Overview
This guide will walk you through deploying your For You Restaurant app:
1. **GitHub** - Version control
2. **Neon** - PostgreSQL database
3. **Railway** - Backend API
4. **Vercel** - Frontend

---

## STEP 1: Push Code to GitHub

### Option A: Create New Repository (Recommended)

1. **On GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - **Repository name**: `foryou-restaurant`
   - **Description**: "Restaurant ordering system"
   - Choose **Public** or **Private**
   - **DO NOT** check "Initialize with README"
   - Click "Create repository"

2. **Push Your Code** (from terminal):
   ```bash
   cd /Users/yassinbouabdellah/Downloads/foryou-restaurant
   
   # Initialize git if needed
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Ready for deployment"
   
   # Add remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/foryou-restaurant.git
   
   # Push
   git branch -M main
   git push -u origin main
   ```

### Option B: Use GitHub Import (If you're on import page)

1. **On the GitHub import page**:
   - **Repository name**: `foryou-restaurant`
   - Choose **Public** or **Private**
   - Click "Begin import"
   - Wait for import to complete

---

## STEP 2: Set Up Neon Database

1. **Go to Neon**: [neon.tech](https://neon.tech)
   - Click "Sign Up"
   - **Sign up with GitHub** (easiest option)

2. **Create a New Project**:
   - Click "Create Project" button
   - **Project name**: `foryou-restaurant`
   - **Region**: Choose closest to your users (e.g., `US East` or `EU West`)
   - **PostgreSQL version**: Keep default (15 or 16)
   - Click "Create Project"

3. **Get Your Connection String**:
   - After project creation, you'll see a connection string
   - It looks like: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - **Click "Copy" button** next to the connection string
   - **SAVE THIS STRING** - You'll need it for Railway backend

---

## STEP 3: Deploy Backend to Railway

1. **Go to Railway**: [railway.app](https://railway.app)
   - Click "Start a New Project"
   - **Sign up with GitHub** (recommended)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub if prompted
   - Find and select `foryou-restaurant` repository
   - Click "Deploy Now"

3. **Configure the Service**:
   - Railway will detect it's a Node.js project
   - Click on the service that was created
   - Go to **Settings** tab
   - **Root Directory**: Change to `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run start:prod`
   - Click "Save"

4. **Add Environment Variables**:
   - Go to **Variables** tab
   - Click "New Variable" and add each one:

   **Variable 1:**
   ```
   Name: DATABASE_URL
   Value: [paste your Neon connection string here]
   ```
   
   **Variable 2:**
   ```
   Name: JWT_SECRET
   Value: [generate a random secret]
   ```
   To generate: Run `openssl rand -base64 32` in terminal
   
   **Variable 3:**
   ```
   Name: JWT_EXPIRES_IN
   Value: 7d
   ```
   
   **Variable 4:**
   ```
   Name: FRONTEND_URL
   Value: https://your-app.vercel.app
   ```
   (We'll update this after deploying frontend - use placeholder for now)
   
   **Variable 5:**
   ```
   Name: PORT
   Value: 4000
   ```
   
   **Variable 6:**
   ```
   Name: NODE_ENV
   Value: production
   ```

5. **Deploy**:
   - Railway will automatically deploy when you save settings
   - Go to **Deployments** tab
   - Wait for deployment to complete (look for "Deploy Successful")

6. **Get Your Backend URL**:
   - Go to **Settings** → **Networking**
   - Under "Public Domain", click "Generate Domain"
   - Copy the URL (e.g., `https://foryou-restaurant-production.up.railway.app`)
   - **SAVE THIS URL** - You'll need it for Vercel

7. **Run Database Migrations**:
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click "View Logs"
   - Click the three dots (⋯) → "Open Shell"
   - Run:
     ```bash
     npx prisma migrate deploy
     ```
   - Wait for migrations to complete
   - You should see "Applied migration: ..." messages

---

## STEP 4: Deploy Frontend to Vercel

1. **Go to Vercel**: [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Find and select `foryou-restaurant` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Click "Edit" → Change to `frontend`
   - **Build Command**: `npm run build` (default - keep as is)
   - **Output Directory**: `.next` (default - keep as is)
   - **Install Command**: `npm install` (default - keep as is)

4. **Add Environment Variables**:
   - Scroll down to "Environment Variables"
   - Click "Add" next to the variable:

   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-railway-backend-url.railway.app/api
   ```
   (Replace `your-railway-backend-url` with your actual Railway backend URL from Step 3)

5. **Deploy**:
   - Click "Deploy" button at the bottom
   - Wait for build to complete (2-3 minutes)
   - You'll see "Building..." then "Ready"

6. **Get Your Frontend URL**:
   - After deployment, you'll see your live URL
   - It looks like: `https://foryou-restaurant.vercel.app`
   - **Copy this URL**

---

## STEP 5: Update Backend CORS

1. **Go back to Railway**: [railway.app](https://railway.app)
   - Open your backend project
   - Go to **Variables** tab

2. **Update FRONTEND_URL**:
   - Find `FRONTEND_URL` variable
   - Click "Edit" (pencil icon)
   - Change value to your Vercel URL: `https://your-app.vercel.app`
   - Click "Save"

3. **Redeploy** (if needed):
   - Railway will auto-redeploy when you save variables
   - Go to **Deployments** tab
   - Wait for deployment to complete

---

## STEP 6: Verify Everything Works

1. **Test Frontend**:
   - Open your Vercel URL: `https://your-app.vercel.app`
   - You should see the restaurant homepage
   - Try navigating to menu
   - Try adding items to cart

2. **Test Backend API**:
   - Open: `https://your-backend.railway.app/api/docs`
   - You should see Swagger API documentation
   - Try some API endpoints

3. **Test Admin Login**:
   - Go to: `https://your-app.vercel.app/admin/login`
   - You'll need to create an admin user first (see Step 7)

---

## STEP 7: Create Admin User

You need to create an admin user to access the admin panel.

### Option A: Using Railway Shell (Recommended)

1. Go to Railway → Your backend project
2. Click on your latest deployment → "View Logs"
3. Click three dots (⋯) → "Open Shell"
4. Run:
   ```bash
   npm run seed
   ```
   (If you have a seed script with admin user)

### Option B: Using Prisma Studio (Local)

1. On your local machine, open terminal:
   ```bash
   cd backend
   DATABASE_URL="your-neon-connection-string" npx prisma studio
   ```
2. This opens Prisma Studio in your browser
3. Go to User table → Click "Add record"
4. Fill in:
   - email: `admin@foryou.com`
   - password: (you need to hash it - see below)
   - role: `ADMIN`
   - isActive: `true`
5. To hash password, run in terminal:
   ```bash
   node -e "const bcrypt=require('bcryptjs');console.log(bcrypt.hashSync('yourpassword',10))"
   ```
   Replace `yourpassword` with your desired password

### Option C: Direct SQL (via Neon Dashboard)

1. Go to Neon dashboard
2. Click "SQL Editor" in left sidebar
3. Run this SQL (replace password hash):
   ```sql
   INSERT INTO "User" (id, email, password, role, "isActive", "createdAt", "updatedAt")
   VALUES (
     gen_random_uuid(),
     'admin@foryou.com',
     '$2a$10$YourHashedPasswordHere', -- Use bcrypt to hash your password
     'ADMIN',
     true,
     NOW(),
     NOW()
   );
   ```

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Neon database created and connection string saved
- [ ] Backend deployed to Railway with all environment variables
- [ ] Database migrations run successfully
- [ ] Frontend deployed to Vercel with `NEXT_PUBLIC_API_URL`
- [ ] Backend CORS updated with Vercel URL
- [ ] Frontend accessible and working
- [ ] Backend API accessible (check `/api/docs`)
- [ ] Admin user created
- [ ] Admin login works

---

## 🆘 Troubleshooting

### Frontend shows "Cannot connect to API"
- ✅ Check `NEXT_PUBLIC_API_URL` in Vercel matches your Railway backend URL
- ✅ Make sure Railway backend is running (check deployments tab)
- ✅ Verify CORS settings in backend (FRONTEND_URL should match Vercel URL)

### Database connection errors
- ✅ Double-check `DATABASE_URL` in Railway matches Neon connection string exactly
- ✅ Ensure SSL mode is included: `?sslmode=require`
- ✅ Check Neon database is running (not paused - check Neon dashboard)

### Build failures
- ✅ Check Railway/Vercel build logs for specific errors
- ✅ Verify Node.js version (should be 18.x)
- ✅ Check all dependencies are in package.json
- ✅ Make sure Root Directory is set correctly (`backend` for Railway, `frontend` for Vercel)

### CORS errors in browser console
- ✅ Update `FRONTEND_URL` in Railway with exact Vercel URL
- ✅ Redeploy backend after changing CORS settings
- ✅ Check browser console for exact error message

### Need help?
- **Railway logs**: Railway dashboard → Deployments → View Logs
- **Vercel logs**: Vercel dashboard → Deployments → Click deployment → View Build Logs
- **Neon logs**: Neon dashboard → Logs tab

---

## 🎉 You're Done!

Your app should now be live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/api/docs`
- **Database**: Neon (managed)

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs
