const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // Set shorter timeout for connection
    mongoose.set('bufferTimeoutMS', 3000);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agranova', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️  MongoDB not connected - Running in demo mode`);
    // Continue without database for demo purposes
  }
};

const isDatabaseConnected = () => isConnected;

module.exports = { connectDB, isDatabaseConnected };
