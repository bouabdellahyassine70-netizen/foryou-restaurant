# 🚨 URGENT: Fix Environment Variables

## Current Problems:

1. ❌ **Vercel**: `NEXT_PUBLIC_API_URL` is set to `placeholder.railway.app` (with a space!)
2. ❌ **Railway**: `FRONTEND_URL` is set to `https://railway.com` (wrong!)

## 🔧 Quick Fix Steps:

### VERCEL (Frontend)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: Your project "foryou-restaurant"
3. **Go to**: Settings → Environment Variables
4. **Find**: `NEXT_PUBLIC_API_URL`
5. **DELETE** it if it contains "placeholder" or has spaces
6. **Click**: "Add New"
7. **Enter**:
   ```
   Key:   NEXT_PUBLIC_API_URL
   Value: https://YOUR-RAILWAY-URL.railway.app/api
   ```
   ⚠️ **Replace `YOUR-RAILWAY-URL` with your actual Railway URL**
   ⚠️ **NO SPACES anywhere!**
   ⚠️ **Must end with `/api` (no space after)**

8. **Click**: "Save"
9. **Go to**: Deployments tab
10. **Click**: "..." on latest deployment → "Redeploy"

### RAILWAY (Backend)

1. **Go to**: https://railway.app/dashboard
2. **Click**: Your backend service
3. **Go to**: Variables tab
4. **Find**: `FRONTEND_URL`
5. **DELETE** it if it says "railway.com"
6. **Click**: "New Variable"
7. **Enter**:
   ```
   Key:   FRONTEND_URL
   Value: https://foryou-restaurant-k0jzjwrse.vercel.app
   ```
   ⚠️ **Use your actual Vercel URL** (check Vercel dashboard)
   ⚠️ **NO trailing slash**
   ⚠️ **NO spaces**

8. **Click**: "Add"
9. **Click**: "Restart" button on your service

## 📍 How to Find Your URLs:

### Railway Backend URL:
1. Railway Dashboard → Your Backend Service
2. Click "Settings" tab
3. Scroll to "Networking" section
4. Copy "Public Domain" (e.g., `your-app.up.railway.app`)
5. Add `/api` at the end: `https://your-app.up.railway.app/api`

### Vercel Frontend URL:
1. Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Copy the production domain
   (e.g., `foryou-restaurant-k0jzjwrse.vercel.app`)

## ✅ After Fixing:

1. ✅ **Vercel**: Wait for redeploy (or manually redeploy)
2. ✅ **Railway**: Restart the service
3. ✅ **Test**: Refresh your Vercel app

## 🔍 Verify:

After setting variables, check:
- ✅ No `placeholder.railway.app` in network requests
- ✅ No `%20` (space) in URLs
- ✅ No CORS errors in browser console
- ✅ Menu loads successfully

The app will work once these variables are set correctly! ✅
