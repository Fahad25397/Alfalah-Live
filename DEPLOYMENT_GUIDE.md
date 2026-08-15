# Alfalah Honey - Deployment Guide

## Overview
This guide explains how to properly deploy the Alfalah Honey e-commerce application with:
- **Backend**: Railway (Node.js/Express + MongoDB)
- **Frontend**: Vercel (React + Vite)

## The Problem
The error you encountered (`at Ss (index-Dw32AzBX.js:19:9289)...`) is a **CORS (Cross-Origin Resource Sharing) error** combined with **incorrect API URL configuration**. When deploying:
1. Frontend on Vercel tries to call backend on Railway
2. Railway backend blocks requests from Vercel domain (CORS)
3. Frontend uses localhost URL in production

## Solution Summary

### 1. Backend (Railway) Configuration

#### Environment Variables to Set in Railway Dashboard:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### Key Changes Made:
- Updated `server.js` with proper CORS configuration that allows:
  - Localhost development (ports 5173, 3000)
  - Any `.vercel.app` subdomain
  - Custom `FRONTEND_URL` from environment
- Added health check endpoint at `/` for Railway health checks
- Updated `railway.json` to include `FRONTEND_URL` variable template

### 2. Frontend (Vercel) Configuration

#### Environment Variables to Set in Vercel Dashboard:
```
VITE_API_URL=https://your-railway-app.railway.app
```

#### Key Changes Made:
- Removed invalid `env` section from `vercel.json` (was using `@vite_api_url` which doesn't work)
- Updated `.env.example` with clear production variable template
- Frontend code already uses `import.meta.env.VITE_API_URL` with fallback to localhost

### 3. Deployment Steps

#### Step 1: Deploy Backend to Railway
1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Set Root Directory to `backend`
4. Add environment variables in Railway dashboard (see above)
5. Deploy - Railway will use `railway.json` config

#### Step 2: Deploy Frontend to Vercel
1. Connect Vercel to your GitHub repo
2. Set Root Directory to `frontend`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add `VITE_API_URL` environment variable in Vercel dashboard pointing to your Railway backend URL
7. Deploy

#### Step 3: Update CORS After Getting URLs
1. After Vercel deployment, copy your Vercel URL (e.g., `https://alfalah-honey.vercel.app`)
2. Go to Railway dashboard → Variables → Update `FRONTEND_URL` to your actual Vercel URL
3. Redeploy Railway backend
4. After Railway deployment, copy your Railway URL (e.g., `https://alfalah-honey.railway.app`)
5. Go to Vercel dashboard → Environment Variables → Update `VITE_API_URL` to your actual Railway URL
6. Redeploy Vercel frontend

## Code Changes Made

### `backend/server.js`
- Added comprehensive CORS configuration with dynamic origin checking
- Allows all `.vercel.app` subdomains automatically
- Supports custom `FRONTEND_URL` environment variable
- Added health check endpoint at `/`

### `backend/railway.json`
- Added `variables` section with `FRONTEND_URL` template

### `vercel.json`
- Removed invalid `env` section that used `@vite_api_url` placeholder

### `frontend/.env.example`
- Updated with clear development and production variable examples

## Verification Checklist

After deployment, verify:
- [ ] Backend health check: `https://your-railway-app.railway.app/` returns JSON
- [ ] Frontend loads: `https://your-vercel-app.vercel.app/`
- [ ] Products load on frontend (check Network tab for API calls)
- [ ] Admin panel works: `https://your-vercel-app.vercel.app/admin`
- [ ] Cart/checkout works end-to-end
- [ ] No CORS errors in browser console

## Common Issues

### "Failed to connect to backend server"
- Check `VITE_API_URL` in Vercel matches Railway URL exactly
- Ensure Railway backend is running (check logs)
- Verify MongoDB connection in Railway logs

### CORS Errors
- Ensure `FRONTEND_URL` in Railway matches Vercel URL exactly
- Check Railway logs for "Not allowed by CORS" messages
- Redeploy both after updating environment variables

### 404 on API Routes
- Verify Railway health check passes
- Check Railway logs for route registration
- Ensure `vercel.json` rewrites are correct for SPA routing

## Local Development
```bash
# Terminal 1 - Backend
cd backend
npm run deva

# Terminal 2 - Frontend
cd frontend
npm run dev
```
Frontend: http://localhost:5173
Backend: http://localhost:5000