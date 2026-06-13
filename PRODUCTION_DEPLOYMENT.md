# 🚀 AGRANOVA - Production Deployment Guide

Deploy AGRANOVA Smart Irrigation System to Vercel with comprehensive demo data.

## 📋 Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Detailed Deployment Steps](#detailed-deployment-steps)
4. [Demo Data Overview](#demo-data-overview)
5. [Verification Checklist](#verification-checklist)
6. [Troubleshooting](#troubleshooting)
7. [Post-Deployment](#post-deployment)

---

## ⚡ Quick Start

### One-Command Deploy (Automated)

**Windows:**
```powershell
.\deploy.ps1 setup
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh setup
```

This will guide you through:
1. MongoDB Atlas setup
2. Environment configuration
3. Database seeding
4. Vercel deployment

### Estimated Time: 15-20 minutes

---

## 📦 Prerequisites

Before deployment, ensure you have:

### Software
- [ ] Node.js 18+ ([Download](https://nodejs.org/))
- [ ] Git ([Download](https://git-scm.com/))
- [ ] GitHub account with push access

### Cloud Accounts (Free Tier)
- [ ] [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [ ] [Vercel Account](https://vercel.com/)

### Repository
- [ ] Fork/clone AGRANOVA repository to GitHub
- [ ] Local copy of repository

---

## 🔧 Detailed Deployment Steps

### Step 1: Create MongoDB Atlas Database

#### 1.1 Sign Up & Create Project
```bash
# Go to https://www.mongodb.com/cloud/atlas
# Click "Sign Up"
# Create new account or use existing email
# Create new organization and project
```

#### 1.2 Create Free Cluster
```bash
# In MongoDB Atlas:
# 1. Go to "Clusters" tab
# 2. Click "Create a Cluster"
# 3. Select "Shared" tier (FREE)
# 4. Choose cloud provider and region close to you
# 5. Name: "agranova-production"
# 6. Click "Create"
# Wait 3-5 minutes for cluster to be ready
```

#### 1.3 Configure Network Access
```bash
# In MongoDB Atlas:
# 1. Go to "Network Access" (left sidebar)
# 2. Click "Add IP Address"
# 3. Select "Allow Access from Anywhere" (0.0.0.0/0)
# 4. Confirm changes
# Note: For production, restrict to Vercel IPs later
```

#### 1.4 Create Database User
```bash
# In MongoDB Atlas:
# 1. Go to "Database Access"
# 2. Click "Add New Database User"
# 3. Set Username: agranova_admin
# 4. Set Password: Use strong password (min 16 chars)
# 5. Click "Add User"
# SAVE THIS PASSWORD!
```

#### 1.5 Get Connection String
```bash
# In MongoDB Atlas:
# 1. Go to "Clusters" > "Connect"
# 2. Select "Drivers" > "Node.js"
# 3. Copy connection string
# 4. Replace <password> with your database password
# 5. Replace myFirstDatabase with agranova
# 6. SAVE THIS CONNECTION STRING!

# Example:
# mongodb+srv://agranova_admin:PASSWORD@cluster0.xxxxx.mongodb.net/agranova?retryWrites=true&w=majority
```

---

### Step 2: Update Local Environment Variables

#### 2.1 Update Backend Configuration
```bash
# Edit: backend/.env

NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://agranova_admin:PASSWORD@cluster0.xxxxx.mongodb.net/agranova?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_2026_change_in_production_secure123
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=https://your-app-name.vercel.app
```

#### 2.2 Update Frontend Configuration
```bash
# Create: frontend/.env.production

REACT_APP_API_URL=https://your-app-name.vercel.app/api
REACT_APP_SOCKET_URL=https://your-app-name.vercel.app
```

---

### Step 3: Populate Database with Demo Data

#### 3.1 Run Seed Script
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run comprehensive seed
npm run seed:comprehensive

# Expected output:
# ✅ Created 16 users with geographic locations
# ✅ Created 15 irrigation systems
# ✅ Created 6 devices
# ✅ Created 12 orders
# ✓ Community discussions and alerts populated
```

#### 3.2 Verify Data in MongoDB
```bash
# In MongoDB Atlas:
# 1. Go to "Browse Collections"
# 2. Verify collections exist:
#    - users (should have 16 documents)
#    - irrigationsystems (should have 15 documents)
#    - devices (should have 6 documents)
#    - orders (should have 12 documents)
```

---

### Step 4: Push to GitHub

```bash
# From repository root
git add .
git commit -m "Prepare production deployment with demo data"
git push origin main
```

---

### Step 5: Deploy to Vercel

#### 5.1 Connect Repository
```bash
# Go to https://vercel.com/dashboard
# Click "Add New" > "Project"
# Select "Import Git Repository"
# Choose your AGRANOVA repository
```

#### 5.2 Configure Build Settings
```bash
# In Vercel project settings:

Framework Preset: Other
Root Directory: . (root)
Build Command: npm run build
Output Directory: frontend/build
Install Command: npm install
```

#### 5.3 Add Environment Variables
```bash
# In Vercel project settings > Environment Variables
# Add these variables:

MONGODB_URI=mongodb+srv://agranova_admin:PASSWORD@cluster0.xxxxx.mongodb.net/agranova?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_2026_change_in_production_secure123
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

#### 5.4 Deploy
```bash
# Click "Deploy" button
# Wait for build to complete (2-5 minutes)
# Vercel will provide deployment URL
# Example: https://agronova-xxxxx.vercel.app
```

---

## 📊 Demo Data Overview

### Users (16 Total)

**Admin Accounts:**
- `admin@agranova.com` / `admin123`
- `demo@agranova.com` / `demo123`

**Farmer Accounts (by Region):**

| Region | Users | Coordinates |
|--------|-------|-------------|
| Baku | 2 | 40.5°N, 49.9°E |
| Ganja | 2 | 40.7°N, 46.4°E |
| Sheki | 2 | 41.2°N, 47.2°E |
| Lankaran | 2 | 38.8°N, 48.9°E |
| Quba | 2 | 41.4°N, 48.5°E |
| Shamakhi | 2 | 40.6°N, 48.6°E |
| Gabala | 2 | 41.0°N, 47.9°E |

All farmer accounts use: `password: user123`

### Irrigation Systems (15 Total)

| System | Region | Status | Coordinates |
|--------|--------|--------|-------------|
| SYS-2026-001 | Baku | Online | 40.5282°N, 49.9056°E |
| SYS-2026-002 | Baku | Online | 40.4500°N, 50.1200°E |
| SYS-2026-003 | Ganja | Online | 40.6828°N, 46.3606°E |
| ... | ... | ... | ... |
| SYS-2026-015 | Sumgait | **Offline** | 40.5897°N, 49.6686°E |

Each system has:
- ✅ Real-time sensor data
- ✅ Geographic coordinates for mapping
- ✅ Battery and water tank levels
- ✅ Pump status and solar power status
- ✅ Network connectivity status

### Shop Inventory (6 Products)

1. **AGRANOVA Smart Controller Pro** - $1,299
   - Advanced AI-powered control
   - Solar powered with battery backup
   - Supports 8 zones

2. **AGRANOVA Sensor Kit Advanced** - $449
   - 3x soil moisture sensors
   - 2x temperature sensors
   - 1x humidity sensor

3. **Solar Water Pump System** - $899
   - 500W solar pump
   - Automatic water control
   - 5-year warranty

4. **Basic Irrigation Controller** - $299
   - Simple timer-based control
   - 4-zone support
   - 1-year warranty

5. **AGRANOVA Field Gateway Mini** - $529
   - Dual SIM fallback
   - Wireless connectivity
   - Edge buffering

6. **Precision Drip Controller X2** - $649
   - 2-channel zone control
   - Leak detection support
   - Night mode irrigation

### Orders (12 Total)

Various statuses:
- 3 Delivered
- 2 Processing
- 2 Pending
- 2 Confirmed
- 2 Shipped
- 1 Cancelled

Payment methods included:
- Credit card
- Bank transfer
- Cash on delivery

### Community Content

**Discussions (4+)**
- Drip irrigation best practices
- Plant disease management
- Soil pH optimization
- Equipment maintenance
- System troubleshooting

**Alerts**
- System status alerts
- Battery warnings
- Water level notifications
- Equipment alerts

---

## ✅ Verification Checklist

### After Deployment

- [ ] **App Loads**: Visit `https://your-app.vercel.app`
- [ ] **Admin Panel**: Navigate to `/admin`
- [ ] **Admin Login**: Use `admin@agranova.com` / `admin123`

### Admin Dashboard Verification

- [ ] **Map Display**: 15 systems visible on map with locations
- [ ] **System Overview**: Shows "15 Online, 0 Offline" (or similar)
- [ ] **Real-time Data**: Sensor readings update dynamically
- [ ] **Orders List**: Shows 12 sample orders
- [ ] **Alerts**: 3+ admin alerts display
- [ ] **User Statistics**: Shows 16 users

### User Portal Verification (as farmer)

- [ ] **Farmer Login**: Use `rashad@farmer.com` / `user123`
- [ ] **Dashboard**: Shows assigned irrigation systems
- [ ] **Sensor Data**: Real-time readings display
- [ ] **Map**: Shows personal systems on map
- [ ] **Shop**: Browse 6 devices
- [ ] **Orders**: View personal orders
- [ ] **Community**: Access forum/discussions

### Feature Tests

- [ ] **Search**: Works on shop and community
- [ ] **Add to Cart**: Can add devices
- [ ] **Create Discussion**: Can post new discussion
- [ ] **Navigation**: All menu items work
- [ ] **Mobile**: Responsive on mobile devices
- [ ] **Charts**: Data visualization displays

---

## 🔍 Troubleshooting

### Issue: Build Fails on Vercel

**Check:**
1. Vercel build logs: `https://vercel.com/dashboard/project/settings/logs`
2. Look for error messages
3. Common causes:
   - Missing dependencies in package.json
   - Hardcoded absolute paths
   - Environment variables not set

**Solution:**
```bash
# Test build locally
npm run build

# Fix any errors
git add .
git commit -m "Fix build errors"
git push origin main
```

### Issue: API Returns 404 Errors

**Check:**
1. Verify `vercel.json` routes are correct
2. Check API endpoint file names match routes
3. Verify environment variables are set

**Solution:**
```bash
# Check API folder structure
ls -la api/

# Verify routes match files
grep -r "routes" vercel.json
```

### Issue: MongoDB Connection Fails

**Check:**
1. Connection string is correct
2. Database user credentials are valid
3. Network access is enabled

**Test:**
```bash
# Test connection string
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✓ Connected')).catch(e => console.log('✗', e.message))"
```

### Issue: No Data Displays

**Check:**
1. Did `seed:comprehensive` complete successfully?
2. Is MongoDB connection working?
3. Check API responses in browser DevTools

**Verify:**
```bash
# Check MongoDB Collections
# In MongoDB Atlas > Browse Collections
# Verify: users, irrigationsystems, devices, orders exist
```

### Issue: Map Shows No Users/Systems

**Check:**
1. Ensure users have `location` field with coordinates
2. Check irrigation systems have `location` fields
3. Verify API endpoint returns location data

**Solution:**
```bash
# Re-seed database
cd backend
npm run seed:comprehensive

# Then verify in MongoDB Atlas
```

---

## 📝 Post-Deployment

### Immediate Actions (First 24 Hours)

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor API response times
   - Watch error rates

2. **Verify All Features**
   - Test user login
   - Test admin functions
   - Check data accuracy

3. **Security Review**
   - Verify HTTPS enabled
   - Check CORS configuration
   - Review JWT secrets

4. **Backup Database**
   - Create MongoDB backup
   - Document backup procedures
   - Test restore process

### Short-term Tasks (First Week)

1. **Performance Optimization**
   - Analyze slow endpoints
   - Add database indexes
   - Optimize queries

2. **Monitoring Setup**
   - Configure error tracking (Sentry)
   - Set up alerts
   - Create dashboards

3. **User Onboarding**
   - Create admin documentation
   - Prepare user tutorials
   - Set up email templates

4. **Real Data Migration**
   - Plan data migration from staging
   - Create migration scripts
   - Test backup/restore

### Long-term Tasks (Monthly)

1. **Maintenance**
   - Update dependencies
   - Security patches
   - Performance reviews

2. **Scaling**
   - Monitor usage patterns
   - Plan capacity upgrades
   - Add caching layers

3. **Features**
   - Implement new features
   - Bug fixes
   - User feedback integration

---

## 🔐 Security Recommendations

### Immediate
- [ ] Change default demo passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure CORS properly

### Short-term
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Configure database backups
- [ ] Restrict MongoDB IP access

### Long-term
- [ ] Implement two-factor authentication
- [ ] Add user activity logging
- [ ] Set up security monitoring
- [ ] Regular security audits

---

## 📞 Support Resources

### Documentation
- [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) - Detailed deployment guide
- [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md) - Quick reference
- [README.md](README.md) - Project overview

### External Resources
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

## ✨ What's Included

### Frontend
- ✅ React dashboard with real-time updates
- ✅ Interactive user map
- ✅ Shop interface
- ✅ Community forum
- ✅ Mobile responsive design

### Backend
- ✅ Express.js REST API
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ Sensor data management
- ✅ Order processing
- ✅ Community features
- ✅ Alert system

### Demo Data
- ✅ 16 users across 7 regions
- ✅ 15 irrigation systems with sensors
- ✅ 6 agricultural devices
- ✅ 12 sample orders
- ✅ Community discussions
- ✅ Alert notifications

---

## 🎉 You're Ready!

**Time to deploy: 20 minutes**

After deployment, you'll have:
- ✅ Live production application
- ✅ 15 systems visible on map
- ✅ Real-time sensor data
- ✅ 12 sample orders
- ✅ Community forum
- ✅ Full admin dashboard

**Questions?** See troubleshooting section or check documentation files.

---

**Status**: Ready for Production Deployment  
**Last Updated**: June 13, 2026
