# 🔧 Fix CORS and Environment Variables

## Issues Found:
1. ❌ API URL is `placeholder.railway.app` (not set in Vercel)
2. ❌ URL has space: `api%20` = `api ` (space in env var)
3. ❌ CORS only allows `https://railway.com` instead of Vercel URL

## ✅ Fixes Applied:

### 1. Backend CORS Updated
- Now allows multiple origins (Vercel + local)
- Supports all Vercel preview URLs with pattern matching

### 2. Environment Variables Needed

## 📋 VERCEL Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add/Update:

```
Name: NEXT_PUBLIC_API_URL
Value: https://YOUR-RAILWAY-BACKEND-URL.railway.app/api
```

**⚠️ IMPORTANT:** 
- Replace `YOUR-RAILWAY-BACKEND-URL` with your actual Railway backend URL
- Make sure there are NO SPACES before or after the URL
- The URL should end with `/api` (no trailing space)

## 📋 RAILWAY Environment Variables

Go to: **Railway Dashboard → Your Backend Service → Variables**

Add/Update:

```
Name: FRONTEND_URL
Value: https://foryou-restaurant-k0jzjwrse.vercel.app
```

**⚠️ IMPORTANT:**
- Use your actual Vercel URL (check your Vercel dashboard)
- If you have a custom domain, use that instead
- No trailing slash

## 🔍 How to Find Your URLs:

### Railway Backend URL:
1. Go to Railway dashboard
2. Click on your backend service
3. Click "Settings" → "Networking"
4. Copy the "Public Domain" URL
5. Add `/api` at the end

### Vercel Frontend URL:
1. Go to Vercel dashboard
2. Click on your project
3. Copy the URL from the "Domains" section
4. Use the production domain (or preview domain if testing)

## 🚀 After Setting Variables:

1. **Vercel**: Redeploy (or wait for auto-deploy)
2. **Railway**: Restart the service

## ✅ Verification:

After setting variables, check:
- ✅ No CORS errors in browser console
- ✅ API calls work (menu loads)
- ✅ No `placeholder.railway.app` in network requests
- ✅ No `%20` (space) in URLs
