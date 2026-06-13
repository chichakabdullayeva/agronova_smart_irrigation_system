# AGRANOVA - Vercel Deployment Guide with Demo Data

This guide walks you through deploying AGRANOVA Smart Irrigation System to Vercel with comprehensive demo data.

## Prerequisites

- GitHub account with repository push access
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)
- Node.js 18+ installed locally

## Step 1: Set Up MongoDB Atlas (Production Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up and create a free account
3. Create a new organization and project

### 1.2 Create a Cluster
1. Click "Create a Database"
2. Select "Free" tier (M0 Sandbox)
3. Choose your preferred cloud provider and region
4. Name your cluster (e.g., "agranova-production")
5. Click "Create Cluster"

### 1.3 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (or use 0.0.0.0/0)
4. Confirm

### 1.4 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Set Username: `agranova_admin`
4. Set Password: Use a strong password (save it!)
5. Click "Add User"

### 1.5 Get Connection String
1. Go to "Clusters" and click "Connect"
2. Select "Drivers" > Node.js
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `agranova`
6. Save the full connection string (you'll need it for Vercel)

Example: `mongodb+srv://agranova_admin:PASSWORD@cluster0.xxxxx.mongodb.net/agranova?retryWrites=true&w=majority`

## Step 2: Prepare Local Demo Data

### 2.1 Update Backend .env
Edit `backend/.env`:

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://agranova_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/agranova?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_2026_change_in_production_12345
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=https://your-app.vercel.app
```

### 2.2 Update Frontend .env.production
Edit `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-app.vercel.app/api
REACT_APP_SOCKET_URL=https://your-app.vercel.app
```

### 2.3 Seed Production Database Locally
From the backend directory:

```bash
cd backend
npm install
node src/scripts/seedComprehensive.js
```

This will populate your MongoDB Atlas database with:
- 16 users across 7 regions (with geographic coordinates)
- 12 active irrigation systems with real-time data
- 6 agricultural devices in the shop
- 12 sample orders with different statuses
- Community discussions and alerts
- Demo admin accounts for testing

**Demo Accounts Created:**
- Admin: `admin@agranova.com` / `admin123`
- Admin: `demo@agranova.com` / `demo123`
- Sample Farmers: `rashad@farmer.com`, `leyla@farm.az`, etc. / `user123`

## Step 3: Configure Vercel

### 3.1 Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select the repository: `agronova_smart_irrigation_system`

### 3.2 Configure Project Settings
1. **Framework**: Select "Next.js" or "Other"
2. **Root Directory**: `.` (root)
3. **Build Command**: `npm run build`
4. **Output Directory**: `frontend/build`
5. **Install Command**: `npm install`

### 3.3 Set Environment Variables
In Vercel project settings, add these environment variables:

```
MONGODB_URI=mongodb+srv://agranova_admin:PASSWORD@cluster0.xxxxx.mongodb.net/agranova?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_2026_change_in_production_12345
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

**Important**: Use your actual MongoDB connection string and secure keys!

## Step 4: Deploy to Vercel

### 4.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment with demo data"
git push origin main
```

### 4.2 Trigger Deployment
1. Vercel will automatically detect the push
2. Deployment will start automatically
3. Wait for build to complete (usually 2-5 minutes)
4. Once complete, you'll get a URL like: `https://agronova-xxxxx.vercel.app`

### 4.3 Monitor Deployment
- Check the Vercel dashboard for build logs
- Look for any build errors
- If errors occur, check:
  - Environment variables are set correctly
  - MongoDB connection string is valid
  - All dependencies are installed
  - Build command completes successfully

## Step 5: Post-Deployment Verification

### 5.1 Test Frontend
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Verify the homepage loads
3. Check that styling and assets load correctly

### 5.2 Test Admin Panel
1. Navigate to `/admin`
2. Login with: `admin@agranova.com` / `admin123`
3. Verify dashboard displays:
   - System overview with data
   - User map with farmer locations
   - Device inventory
   - Recent orders
   - Alerts and notifications
   - Community discussions

### 5.3 Test User Portal
1. Navigate to `/`
2. Login with: `rashad@farmer.com` / `user123`
3. Verify user dashboard shows:
   - Personal irrigation systems with live data
   - System status and alerts
   - Available devices for purchase
   - Community forum access
   - Sensor readings and history

### 5.4 Test Key Features
- **Map View**: Check if users and systems display on map
- **Shop**: Browse and add devices to cart
- **Dashboard**: Verify real-time sensor data
- **Community**: View discussions and ask questions
- **Alerts**: Check if alerts are displayed

## Step 6: Production Optimization

### 6.1 Enable CORS
The `vercel.json` already includes CORS headers. Verify in `api/middleware/cors.js`:

```javascript
res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
res.header('Access-Control-Allow-Credentials', 'true');
```

### 6.2 Monitor Performance
1. Check Vercel Analytics dashboard
2. Monitor API response times
3. Check function execution times
4. Optimize slow endpoints if needed

### 6.3 Set Up Error Tracking
Consider adding error tracking:
- Sentry (free tier available)
- Error tracking in Vercel dashboard

### 6.4 Enable Database Backups
In MongoDB Atlas:
1. Go to "Backup" tab in your cluster
2. Enable "Cloud Backups"
3. Set retention policy
4. Schedule regular backups

## Step 7: Domain Configuration (Optional)

### 7.1 Add Custom Domain
1. In Vercel project settings, go to "Domains"
2. Click "Add"
3. Enter your custom domain
4. Update DNS records according to Vercel's instructions
5. Wait for DNS propagation (up to 48 hours)

### 7.2 Enable HTTPS
- Vercel automatically provides free SSL certificate
- No additional configuration needed

## Step 8: Data Management

### 8.1 Re-seed Production Data
If you need to reset demo data:

```bash
# From backend directory
MONGODB_URI=mongodb+srv://... node src/scripts/seedComprehensive.js
```

### 8.2 Backup Database
Manually export data from MongoDB Atlas:
1. Go to "Database Backups"
2. Click "Restore" > "Download"
3. Save backup file securely

### 8.3 Monitor Database Usage
- Check MongoDB Atlas dashboard for:
  - Storage usage
  - Connection count
  - Query performance
  - Index efficiency

## Troubleshooting

### Issue: Build Fails
**Solution**:
1. Check build logs in Vercel
2. Verify all dependencies are listed in package.json
3. Check for hardcoded absolute paths
4. Ensure environment variables are set

### Issue: API Endpoints Return 404
**Solution**:
1. Verify `vercel.json` routing rules
2. Check API functions in `api/` directory
3. Verify FRONTEND_URL environment variable

### Issue: Database Connection Fails
**Solution**:
1. Test connection string locally first
2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
3. Check database user credentials
4. Verify MongoDB_URI env var is correct

### Issue: Sensor Data Not Displaying
**Solution**:
1. Verify seedComprehensive.js ran successfully
2. Check MongoDB Atlas for data:
   - Go to "Browse Collections"
   - Verify collections exist: users, irrigationsystems, devices, orders
3. Check browser console for API errors
4. Verify CORS is enabled

### Issue: Map Not Showing Users
**Solution**:
1. Ensure users have `location` fields with latitude/longitude
2. Check frontend map component configuration
3. Verify API endpoint returns user locations
4. Check browser console for JavaScript errors

## Performance Tips

### 1. Database Indexing
The Vercel deployment should create indexes automatically. Verify in MongoDB Atlas:
- Go to "Indexes" tab
- Ensure indexes exist on frequently queried fields

### 2. API Response Optimization
- Use pagination for large datasets
- Implement caching strategies
- Compress API responses

### 3. Frontend Optimization
- Enable gzip compression in Vercel
- Optimize images
- Use code splitting
- Lazy load components

### 4. Monitoring
Set up monitoring for:
- API latency
- Database query performance
- Error rates
- User engagement

## Security Checklist

- [ ] Change default passwords in demo accounts
- [ ] Use strong JWT secret (at least 32 characters)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database IP whitelist restrictions
- [ ] Set up rate limiting on API endpoints
- [ ] Implement request logging
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Maintenance Tasks

### Weekly
- Monitor error rates
- Check database performance
- Review user feedback

### Monthly
- Update dependencies
- Review security logs
- Optimize slow queries
- Backup critical data

### Quarterly
- Security audit
- Performance review
- Capacity planning
- Disaster recovery drill

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## Next Steps

1. ✅ Deploy to production
2. ✅ Populate with demo data
3. ✅ Test all features
4. 📝 Create admin documentation
5. 📝 Set up user onboarding
6. 📝 Plan marketing launch
7. 📝 Set up customer support

---

**Last Updated**: June 13, 2026
**Status**: Ready for Production Deployment
