require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agranova';

async function addDemoAdmin() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if demo admin already exists
    const existingAdmin = await User.findOne({ email: 'demo@agranova.com' });
    if (existingAdmin) {
      console.log('⚠️  Demo admin account already exists');
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
  } catch (error) {
    console.error('❌ Error adding demo admin:', error.message);
    process.exit(1);
  }
}

addDemoAdmin();
