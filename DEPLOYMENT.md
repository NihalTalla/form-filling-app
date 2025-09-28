# Deployment Guide

This guide covers deploying the Form-Filling Web Application to cloud platforms.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   Database      │
│   (React)       │    │   (Node.js)     │    │   (MySQL)       │
│                 │    │                 │    │                 │
│ Vercel/Netlify  │    │ Railway/Render  │    │ Supabase/       │
│                 │    │                 │    │ PlanetScale     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

- Node.js 18+ installed
- MySQL database (local or cloud)
- Git repository
- Accounts on deployment platforms

## 1. Database Deployment

### Option A: Supabase (Recommended)

1. **Create Account**: Go to [supabase.com](https://supabase.com)
2. **Create Project**: 
   - Click "New Project"
   - Choose organization
   - Enter project name: `form-app-db`
   - Set database password
   - Select region closest to your users

3. **Configure Database**:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Get Connection Details**:
   - Go to Settings → Database
   - Copy connection string
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]`

### Option B: PlanetScale

1. **Create Account**: Go to [planetscale.com](https://planetscale.com)
2. **Create Database**:
   - Click "New Database"
   - Name: `form-app`
   - Region: Choose closest to your users

3. **Create Branch**: 
   - Use `main` branch or create development branch
   - Apply schema using PlanetScale CLI or web console

4. **Get Connection String**:
   - Go to database dashboard
   - Click "Connect"
   - Copy connection string

### Option C: Railway MySQL

1. **Create Account**: Go to [railway.app](https://railway.app)
2. **Create Project**: 
   - Click "New Project"
   - Select "Provision MySQL"

3. **Configure**:
   - Railway will auto-generate credentials
   - Access database via Railway dashboard
   - Run schema creation scripts

## 2. Backend Deployment

### Option A: Railway (Recommended)

1. **Prepare Repository**:
   ```bash
   cd backend
   # Ensure package.json has correct start script
   # "start": "node server.js"
   ```

2. **Deploy to Railway**:
   - Connect GitHub repository to Railway
   - Select `backend` folder as source
   - Railway auto-detects Node.js

3. **Environment Variables**:
   ```
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_PORT=3306
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Custom Start Command** (if needed):
   ```
   node server.js
   ```

### Option B: Render

1. **Create Account**: Go to [render.com](https://render.com)

2. **Create Web Service**:
   - Connect GitHub repository
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

3. **Environment Variables**: Add same variables as Railway

4. **Health Check**: Render will use `/api/health` endpoint

## 3. Frontend Deployment

### Option A: Vercel (Recommended)

1. **Prepare Frontend**:
   ```bash
   cd frontend
   # Update .env for production
   echo "VITE_API_URL=https://your-backend-url.com" > .env.production
   ```

2. **Deploy to Vercel**:
   - Connect GitHub repository to Vercel
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-railway-url.railway.app
   ```

### Option B: Netlify

1. **Prepare Build**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop `dist` folder to Netlify
   - Or connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**: Add in Netlify dashboard

## 4. Complete Deployment Steps

### Step 1: Database First
1. Deploy database (Supabase/PlanetScale/Railway)
2. Create tables using provided schema
3. Note connection credentials

### Step 2: Backend Second
1. Update backend `.env` with production database credentials
2. Deploy to Railway/Render
3. Test API endpoints
4. Note backend URL

### Step 3: Frontend Last
1. Update frontend environment with production backend URL
2. Deploy to Vercel/Netlify
3. Test complete application flow

## 5. Environment Variables Summary

### Backend (.env)
```env
# Database
DB_HOST=your_production_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.railway.app
```

## 6. Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.com/api/health
```

### Frontend Form Test
1. Open deployed frontend URL
2. Fill form with test data
3. Submit and verify success message
4. Check database for new record

## 7. Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Configure DNS records

### Railway Custom Domain
1. Go to Railway dashboard
2. Select your service
3. Go to Settings → Networking
4. Add custom domain
5. Configure DNS records

## 8. Monitoring and Maintenance

### Health Monitoring
- Set up uptime monitoring (UptimeRobot, etc.)
- Monitor `/api/health` endpoint
- Set up alerts for downtime

### Database Monitoring
- Monitor connection count
- Watch for query performance
- Set up backup schedules

### Logs
- Railway: View logs in dashboard
- Vercel: View function logs
- Render: Access logs via dashboard

## 9. Troubleshooting

### Common Issues

**CORS Errors**:
- Ensure `FRONTEND_URL` is set correctly in backend
- Check Vercel/Netlify domain in CORS configuration

**Database Connection**:
- Verify all environment variables
- Check database firewall settings
- Test connection from deployment platform

**Build Failures**:
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Review build logs for specific errors

**404 Errors**:
- Ensure correct API endpoints
- Check backend routing configuration
- Verify deployment completed successfully

## 10. Security Checklist

- [ ] Environment variables properly set
- [ ] Database credentials secured
- [ ] HTTPS enabled on all services
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Helmet security headers enabled
- [ ] No sensitive data in client-side code

## 11. Performance Optimization

### Frontend
- Enable gzip compression
- Configure CDN (Vercel/Netlify handle this)
- Optimize images and assets
- Enable browser caching

### Backend
- Enable response compression
- Configure database connection pooling
- Implement API caching where appropriate
- Monitor response times

This deployment guide ensures your form-filling application is production-ready and scalable across multiple cloud platforms.