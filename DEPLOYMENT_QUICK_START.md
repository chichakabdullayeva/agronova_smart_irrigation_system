# AGRANOVA Deployment Quick Start

Quick reference for deploying AGRANOVA to production with demo data.

## ⚡ 5-Minute Quick Deploy

### Step 1: Get MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create cluster (M0 Sandbox)
3. Create database user with password
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/agranova?retryWrites=true&w=majority`

### Step 2: Update Environment Files
**`backend/.env`:**
```env
NODE_ENV=production
MONGODB_URI=YOUR_MONGODB_URI_HERE
JWT_SECRET=your_jwt_secret_key_2026_change_in_production
FRONTEND_URL=https://your-app.vercel.app
```

**`frontend/.env.production`:**
```env
REACT_APP_API_URL=https://your-app.vercel.app/api
REACT_APP_SOCKET_URL=https://your-app.vercel.app
```

### Step 3: Seed Production Database
```bash
cd backend
npm install
npm run seed:comprehensive
```

You'll see:
```
✅ Created 16 users with geographic locations
✅ Created 15 irrigation systems mapped across regions
✅ Created 6 devices for shop
✅ Created 12 orders with various statuses
✓ Community discussions and alerts populated
```

### Step 4: Deploy to Vercel
```bash
git add .
git commit -m "Deploy to production with demo data"
git push origin main
```

Then in Vercel dashboard:
1. Add environment variables (same as `.env` files)
2. Click Deploy
3. Wait 2-5 minutes
4. ✅ Done! Visit: `https://your-app.vercel.app`

## 📊 What Gets Seeded

### Users (16 total)
- 2 Admin accounts
- 14 Farmer accounts across 7 regions:
  - 2 in Baku
  - 2 in Ganja
  - 2 in Sheki
  - 2 in Lankaran
  - 2 in Quba
  - 2 in Shamakhi
  - 2 in Gabala

### Irrigation Systems (15 total)
- 14 active systems with real-time data
- 1 offline system for alert testing
- Mapped across all regions
- Various statuses: Online, Warning, Offline

### Shop Inventory (6 products)
- Smart Controller Pro ($1,299)
- Sensor Kit Advanced ($449)
- Solar Water Pump System ($899)
- Basic Irrigation Controller ($299)
- Field Gateway Mini ($529)
- Precision Drip Controller X2 ($649)

### Orders (12 total)
- Different statuses: delivered, processing, pending, confirmed, shipped, cancelled
- Various payment methods
- Realistic customer data

### Community Content
- 4+ Discussion threads
- Alerts and warnings
- Admin alerts for system issues

## 🔐 Demo Accounts

### Admin Accounts
```
Email: admin@agranova.com
Password: admin123

Email: demo@agranova.com
Password: demo123
```

### Sample Farmer Accounts
```
Email: rashad@farmer.com
Password: user123
Region: Baku

Email: leyla@farm.az
Password: user123
Region: Ganja

Email: kamran@agro.az
Password: user123
Region: Sheki

Email: aysel@agro.az
Password: user123
Region: Lankaran
```

## 🗺️ What You'll See

### Admin Dashboard
- ✅ 15 systems on map with live coordinates
- ✅ System health indicators
- ✅ Real-time sensor data
- ✅ Recent orders list
- ✅ Active alerts
- ✅ User statistics

### User Dashboard
- ✅ Personal irrigation systems
- ✅ Live sensor readings
- ✅ System alerts
- ✅ Device recommendations
- ✅ Community discussions

### Shop
- ✅ 6 devices with descriptions
- ✅ Pricing and availability
- ✅ Add to cart functionality
- ✅ 12 sample orders

### Community
- ✅ Discussion forum
- ✅ Questions and answers
- ✅ User reputation system
- ✅ Farmer groups

## ✅ Verification Checklist

After deployment, verify:

- [ ] Admin panel loads at `/admin`
- [ ] Can login with `admin@agranova.com` / `admin123`
- [ ] User map displays with farmer locations
- [ ] Irrigation systems show on map
- [ ] Sensor data displays in real-time
- [ ] Shop shows 6 products
- [ ] Orders are listed
- [ ] Alerts display correctly
- [ ] Community discussions are visible
- [ ] Can purchase devices

## 🚀 Performance

Deployed on Vercel with:
- **Build time**: ~2-5 minutes
- **First load**: <3 seconds
- **API latency**: <200ms
- **Database**: MongoDB Atlas (free tier)
- **Hosting**: Vercel (free tier)

## 📱 What's Included

### Frontend
- React dashboard with charts
- Real-time sensor data display
- User map with farmer locations
- Shop interface
- Community forum
- Admin panel

### Backend
- Express.js REST API
- MongoDB database
- JWT authentication
- Sensor data collection
- Order management
- Community discussions
- Alert system

### Features
- ✅ Real-time monitoring
- ✅ Multi-user support
- ✅ Geographic mapping
- ✅ Shop & orders
- ✅ Community forum
- ✅ Alert system
- ✅ Mobile responsive

## 🔧 Troubleshooting

### Build Fails
→ Check Vercel logs: `https://vercel.com/dashboard/project/settings/logs`

### API Returns 404
→ Verify `vercel.json` routes and `FRONTEND_URL` env var

### No Data Displays
→ Run: `npm run seed:comprehensive` and verify MongoDB connection

### Map Empty
→ Check users have `location` field with coordinates

### Can't Login
→ Use credentials from seed output or check MongoDB for users

## 📞 Support Files

- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `README.md` - Project overview
- `HOW_TO_RUN.md` - Local development setup

## 📚 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add to custom domain (optional)
3. ✅ Create admin user documentation
4. ✅ Plan marketing launch
5. ✅ Set up customer support
6. ✅ Monitor performance
7. ✅ Add payment processing
8. ✅ Set up email notifications

---

**Estimated time to deploy**: 15-20 minutes including:
- MongoDB Atlas setup: 5 min
- Code updates: 2 min
- Seeding database: 3 min
- Vercel deployment: 5 min
- Testing: 5 min

**Questions?** Check `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.
