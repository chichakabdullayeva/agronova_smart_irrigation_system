require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agranova';

async function addDemoAdmin() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    console.log(`📍 Connection string: ${MONGODB_URI}`);
    
    // Set connection timeout to 5 seconds
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      retryWrites: false
    });
    console.log('✅ Connected to MongoDB');

    // Check if demo admin already exists
    const existingAdmin = await User.findOne({ email: 'demo@agranova.com' });
    if (existingAdmin) {
      console.log('⚠️  Demo admin account already exists');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      await mongoose.connection.close();
      return;
    }

    // Create demo admin account
    const demoAdmin = {
      name: 'Demo Admin',
      email: 'demo@agranova.com',
      password: 'demo123',
      role: 'admin',
      region: 'Baku',
      crops: ['All Crops']
    };

    const hashedPassword = await bcrypt.hash(demoAdmin.password, 12);
    const createdAdmin = await User.create({
      ...demoAdmin,
      password: hashedPassword
    });

    console.log('✅ Demo admin account created successfully!');
    console.log(`   Email: ${createdAdmin.email}`);
    console.log(`   Password: demo123`);
    console.log(`   Role: ${createdAdmin.role}`);
    console.log(`   Region: ${createdAdmin.region}`);

    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('❌ MongoDB connection failed - MongoDB server is not running');
      console.error('\n📋 To fix this:');
      console.error('   Option 1: Start MongoDB service');
      console.error('   Option 2: Set MONGODB_URI in .env to a MongoDB Atlas cloud instance');
      console.error('   Option 3: Ensure MongoDB is installed and running on localhost:27017');
    } else {
      console.error('❌ Error adding demo admin:', error.message);
    }
    process.exit(1);
  }
}

addDemoAdmin();
