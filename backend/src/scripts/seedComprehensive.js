require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Device = require('../models/Device');
const Order = require('../models/Order');
const Discussion = require('../models/Discussion');
const IrrigationSystem = require('../models/IrrigationSystem');
const UserReputation = require('../models/UserReputation');
const FarmerGroup = require('../models/FarmerGroup');
const Alert = require('../models/Alert');
const AdminAlert = require('../models/AdminAlert');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agranova';

// Enhanced users with geographic locations for mapping
const users = [
  {
    name: 'Admin User',
    email: 'admin@agranova.com',
    password: 'admin123',
    role: 'admin',
    region: 'Baku',
    crops: ['Tomatoes', 'Wheat'],
    location: { latitude: 40.4093, longitude: 49.8671 }
  },
  {
    name: 'Demo Admin',
    email: 'demo@agranova.com',
    password: 'demo123',
    role: 'admin',
    region: 'Baku',
    crops: ['All Crops'],
    location: { latitude: 40.3957, longitude: 49.8671 }
  },
  // Baku Region Farmers
  {
    name: 'Rashad Mammadov',
    email: 'rashad@farmer.com',
    password: 'user123',
    role: 'user',
    region: 'Baku',
    crops: ['Cotton', 'Barley'],
    location: { latitude: 40.5282, longitude: 49.9056 }
  },
  {
    name: 'Farah Quliyev',
    email: 'farah@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Baku',
    crops: ['Wheat', 'Tomatoes'],
    location: { latitude: 40.4500, longitude: 50.1200 }
  },
  // Ganja Region Farmers
  {
    name: 'Leyla Hasanova',
    email: 'leyla@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Ganja',
    crops: ['Grapes', 'Apples'],
    location: { latitude: 40.6828, longitude: 46.3606 }
  },
  {
    name: 'Ibrahim Heydarov',
    email: 'ibrahim@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Ganja',
    crops: ['Walnuts', 'Almonds'],
    location: { latitude: 40.7100, longitude: 46.4000 }
  },
  // Sheki Region Farmers
  {
    name: 'Kamran Aliyev',
    email: 'kamran@agro.az',
    password: 'user123',
    role: 'user',
    region: 'Sheki',
    crops: ['Tea', 'Rice'],
    location: { latitude: 41.1919, longitude: 47.1706 }
  },
  {
    name: 'Gulnar Agayeva',
    email: 'gulnar@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Sheki',
    crops: ['Silk', 'Tobacco'],
    location: { latitude: 41.2000, longitude: 47.2000 }
  },
  // Lankaran Region Farmers
  {
    name: 'Aysel Quliyeva',
    email: 'aysel@agro.az',
    password: 'user123',
    role: 'user',
    region: 'Lankaran',
    crops: ['Tea', 'Citrus'],
    location: { latitude: 38.7539, longitude: 48.8509 }
  },
  {
    name: 'Elmir Safarov',
    email: 'elmir@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Lankaran',
    crops: ['Rice', 'Vegetables'],
    location: { latitude: 38.7600, longitude: 48.8600 }
  },
  // Quba Region Farmers
  {
    name: 'Tural Ismayilov',
    email: 'tural@farmer.az',
    password: 'user123',
    role: 'user',
    region: 'Quba',
    crops: ['Hazelnut', 'Potato'],
    location: { latitude: 41.3600, longitude: 48.5100 }
  },
  {
    name: 'Rena Kerimova',
    email: 'rena@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Quba',
    crops: ['Pomegranate', 'Walnut'],
    location: { latitude: 41.3700, longitude: 48.5200 }
  },
  // Shamakhi Region Farmers
  {
    name: 'Nigar Rahimova',
    email: 'nigar@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Shamakhi',
    crops: ['Cotton', 'Corn'],
    location: { latitude: 40.6314, longitude: 48.6364 }
  },
  {
    name: 'Vugar Mammadov',
    email: 'vugar@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Shamakhi',
    crops: ['Wheat', 'Barley'],
    location: { latitude: 40.6400, longitude: 48.6500 }
  },
  // Gabala Region Farmers
  {
    name: 'Elvin Abbasov',
    email: 'elvin@smartfarm.az',
    password: 'user123',
    role: 'user',
    region: 'Gabala',
    crops: ['Apple', 'Plum'],
    location: { latitude: 40.9878, longitude: 47.9319 }
  },
  {
    name: 'Sevinc Alizade',
    email: 'sevinc@farm.az',
    password: 'user123',
    role: 'user',
    region: 'Gabala',
    crops: ['Cherry', 'Apricot'],
    location: { latitude: 41.0000, longitude: 47.9500 }
  }
];

const devices = [
  {
    name: 'AGRANOVA Smart Controller Pro',
    model: 'ASC-PRO-2026',
    description: 'Advanced irrigation controller with AI-powered water management, solar panel, and real-time monitoring.',
    features: ['AI-powered water optimization', 'Solar powered with battery backup', 'Real-time soil moisture monitoring', '4G/WiFi connectivity', 'Weather forecast integration', 'Mobile app control', 'Supports up to 8 zones'],
    specifications: {
      waterCapacity: 'Manages up to 5000L/day',
      coverage: 'Up to 5 hectares',
      solarPower: '100W solar panel included',
      connectivity: '4G LTE, WiFi, Bluetooth'
    },
    price: 1299,
    currency: 'USD',
    category: 'complete-system',
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 47
  },
  {
    name: 'AGRANOVA Sensor Kit Advanced',
    model: 'ASK-ADV-2026',
    description: 'Complete sensor kit for precision agriculture with soil moisture, temperature, and humidity sensors.',
    features: ['3x Soil moisture sensors', '2x Temperature sensors', '1x Humidity sensor', 'Wireless connectivity', '2-year battery life', 'Weather-resistant design'],
    specifications: {
      waterCapacity: 'N/A',
      coverage: 'Monitors up to 2 hectares',
      solarPower: 'Battery powered',
      connectivity: 'LoRa, WiFi'
    },
    price: 449,
    currency: 'USD',
    category: 'sensor-kit',
    inStock: true,
    stockQuantity: 50,
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: 'Solar Water Pump System',
    model: 'SWP-500-2026',
    description: 'Efficient solar-powered water pump system for irrigation with automatic control.',
    features: ['500W solar pump', 'Automatic water level control', 'Built-in inverter', 'Low maintenance', 'Works in remote areas', '5-year warranty'],
    specifications: {
      waterCapacity: 'Pumps up to 3000L/hour',
      coverage: 'Irrigates up to 3 hectares',
      solarPower: '500W solar panel array',
      connectivity: 'Manual/Automatic control'
    },
    price: 899,
    currency: 'USD',
    category: 'pump-system',
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviewCount: 34
  },
  {
    name: 'Basic Irrigation Controller',
    model: 'BIC-100-2026',
    description: 'Simple and affordable irrigation controller for small farms.',
    features: ['Easy to install', 'Timer-based control', 'Manual override', 'Weather-resistant', '4 zone control', '1-year warranty'],
    specifications: {
      waterCapacity: 'Manages up to 1000L/day',
      coverage: 'Up to 1 hectare',
      solarPower: 'AC powered',
      connectivity: 'Manual control only'
    },
    price: 299,
    currency: 'USD',
    category: 'irrigation-controller',
    inStock: true,
    stockQuantity: 40,
    rating: 4.3,
    reviewCount: 112
  },
  {
    name: 'AGRANOVA Field Gateway Mini',
    model: 'AFG-MINI-2026',
    description: 'Compact field gateway for connecting edge sensors to cloud dashboard.',
    features: ['Dual SIM fallback', 'Low-power mode', 'Remote firmware updates', 'Edge buffering'],
    specifications: {
      waterCapacity: 'N/A',
      coverage: 'Up to 1.5 kilometers',
      solarPower: 'Optional 40W panel',
      connectivity: '4G LTE, WiFi, LoRa'
    },
    price: 529,
    currency: 'USD',
    category: 'sensor-kit',
    inStock: true,
    stockQuantity: 18,
    rating: 4.5,
    reviewCount: 21
  },
  {
    name: 'Precision Drip Controller X2',
    model: 'PDC-X2-2026',
    description: 'Two-channel precision drip controller for vineyards and orchards.',
    features: ['2-channel zone control', 'Pressure anomaly alerts', 'Night mode irrigation', 'Leak detection support'],
    specifications: {
      waterCapacity: 'Manages up to 2200L/day',
      coverage: 'Up to 2.2 hectares',
      solarPower: '60W panel supported',
      connectivity: 'WiFi, Bluetooth'
    },
    price: 649,
    currency: 'USD',
    category: 'irrigation-controller',
    inStock: true,
    stockQuantity: 22,
    rating: 4.4,
    reviewCount: 16
  }
];

// Enhanced irrigation systems across all regions
const irrigationSystems = [
  // Baku systems
  {
    systemId: 'SYS-2026-001',
    region: 'Baku',
    location: { latitude: 40.5282, longitude: 49.9056 },
    soilMoisture: 65,
    temperature: 24,
    humidity: 55,
    pumpStatus: 'ON',
    waterTankLevel: 75,
    batteryLevel: 82,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-002',
    region: 'Baku',
    location: { latitude: 40.4500, longitude: 50.1200 },
    soilMoisture: 70,
    temperature: 25,
    humidity: 50,
    pumpStatus: 'OFF',
    waterTankLevel: 85,
    batteryLevel: 88,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  // Ganja systems
  {
    systemId: 'SYS-2026-003',
    region: 'Ganja',
    location: { latitude: 40.6828, longitude: 46.3606 },
    soilMoisture: 45,
    temperature: 26,
    humidity: 48,
    pumpStatus: 'OFF',
    waterTankLevel: 85,
    batteryLevel: 77,
    solarStatus: 'CHARGING',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-004',
    region: 'Ganja',
    location: { latitude: 40.7100, longitude: 46.4000 },
    soilMoisture: 52,
    temperature: 24,
    humidity: 52,
    pumpStatus: 'ON',
    waterTankLevel: 68,
    batteryLevel: 79,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  // Sheki systems
  {
    systemId: 'SYS-2026-005',
    region: 'Sheki',
    location: { latitude: 41.1919, longitude: 47.1706 },
    soilMoisture: 70,
    temperature: 22,
    humidity: 62,
    pumpStatus: 'ON',
    waterTankLevel: 60,
    batteryLevel: 69,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-006',
    region: 'Sheki',
    location: { latitude: 41.2000, longitude: 47.2000 },
    soilMoisture: 58,
    temperature: 21,
    humidity: 60,
    pumpStatus: 'OFF',
    waterTankLevel: 72,
    batteryLevel: 81,
    solarStatus: 'CHARGING',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  // Lankaran systems
  {
    systemId: 'SYS-2026-007',
    region: 'Lankaran',
    location: { latitude: 38.7539, longitude: 48.8509 },
    soilMoisture: 80,
    temperature: 28,
    humidity: 75,
    pumpStatus: 'OFF',
    waterTankLevel: 90,
    batteryLevel: 85,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-008',
    region: 'Lankaran',
    location: { latitude: 38.7600, longitude: 48.8600 },
    soilMoisture: 28,
    temperature: 30,
    humidity: 72,
    pumpStatus: 'OFF',
    waterTankLevel: 25,
    batteryLevel: 19,
    solarStatus: 'INACTIVE',
    systemStatus: 'Warning',
    systemHealth: 'Warning'
  },
  // Quba systems
  {
    systemId: 'SYS-2026-009',
    region: 'Quba',
    location: { latitude: 41.3600, longitude: 48.5100 },
    soilMoisture: 55,
    temperature: 20,
    humidity: 58,
    pumpStatus: 'ON',
    waterTankLevel: 78,
    batteryLevel: 84,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-010',
    region: 'Quba',
    location: { latitude: 41.3700, longitude: 48.5200 },
    soilMoisture: 62,
    temperature: 19,
    humidity: 55,
    pumpStatus: 'OFF',
    waterTankLevel: 80,
    batteryLevel: 86,
    solarStatus: 'CHARGING',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  // Shamakhi systems
  {
    systemId: 'SYS-2026-011',
    region: 'Shamakhi',
    location: { latitude: 40.6314, longitude: 48.6364 },
    soilMoisture: 58,
    temperature: 23,
    humidity: 50,
    pumpStatus: 'OFF',
    waterTankLevel: 64,
    batteryLevel: 74,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-012',
    region: 'Shamakhi',
    location: { latitude: 40.6400, longitude: 48.6500 },
    soilMoisture: 48,
    temperature: 24,
    humidity: 52,
    pumpStatus: 'ON',
    waterTankLevel: 71,
    batteryLevel: 77,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  // Gabala systems
  {
    systemId: 'SYS-2026-013',
    region: 'Gabala',
    location: { latitude: 40.9878, longitude: 47.9319 },
    soilMoisture: 45,
    temperature: 22,
    humidity: 48,
    pumpStatus: 'ON',
    waterTankLevel: 76,
    batteryLevel: 82,
    solarStatus: 'ACTIVE',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  {
    systemId: 'SYS-2026-014',
    region: 'Gabala',
    location: { latitude: 41.0000, longitude: 47.9500 },
    soilMoisture: 50,
    temperature: 21,
    humidity: 46,
    pumpStatus: 'OFF',
    waterTankLevel: 82,
    batteryLevel: 88,
    solarStatus: 'CHARGING',
    systemStatus: 'Online',
    systemHealth: 'Normal'
  },
  // Offline/Problem system
  {
    systemId: 'SYS-2026-015',
    region: 'Sumgait',
    location: { latitude: 40.5897, longitude: 49.6686 },
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    pumpStatus: 'OFF',
    waterTankLevel: 0,
    batteryLevel: 0,
    solarStatus: 'ERROR',
    systemStatus: 'Offline',
    systemHealth: 'Critical'
  }
];

async function seedComprehensive() {
  let createdUsers, createdDevices, createdSystems, createdOrders;

  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Device.deleteMany({}),
      Order.deleteMany({}),
      Discussion.deleteMany({}),
      IrrigationSystem.deleteMany({}),
      UserReputation.deleteMany({}),
      FarmerGroup.deleteMany({}),
      Alert.deleteMany({}),
      AdminAlert.deleteMany({})
    ]);
    console.log('✅ Existing data cleared');

    console.log('👥 Creating users with geographic locations...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('📦 Creating devices...');
    createdDevices = await Device.insertMany(devices);
    console.log(`✅ Created ${createdDevices.length} devices`);

    console.log('🚰 Creating irrigation systems...');
    const systemsWithOwners = irrigationSystems.map((system, index) => ({
      ...system,
      ownerId: createdUsers[(index % (createdUsers.length - 1)) + 2]._id,
      ownerName: createdUsers[(index % (createdUsers.length - 1)) + 2].name,
      installDate: new Date('2025-03-01'),
      lastMaintenance: new Date('2026-02-10'),
      lastActive: system.systemStatus === 'Offline' ? new Date(Date.now() - 70 * 60 * 1000) : new Date(),
      sensorOnline: system.systemStatus !== 'Offline',
      deviceResponding: system.systemStatus !== 'Offline',
      networkStatus: system.systemStatus === 'Offline' ? 'Disconnected' : 'Connected',
      firmwareVersion: '1.4.2',
      hardwareStatus: system.systemHealth === 'Critical' ? 'Fault' : 'OK'
    }));
    createdSystems = await IrrigationSystem.insertMany(systemsWithOwners);
    console.log(`✅ Created ${createdSystems.length} irrigation systems`);

    console.log('🛒 Creating sample orders...');
    const sampleOrders = [];
    for (let i = 0; i < 12; i++) {
      sampleOrders.push({
        orderId: `ORD-20260313-${String(i + 1).padStart(4, '0')}`,
        user: createdUsers[i + 2]._id,
        userName: createdUsers[i + 2].name,
        userEmail: createdUsers[i + 2].email,
        device: createdDevices[i % createdDevices.length]._id,
        deviceName: createdDevices[i % createdDevices.length].name,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: createdDevices[i % createdDevices.length].price,
        totalAmount: createdDevices[i % createdDevices.length].price * (Math.floor(Math.random() * 3) + 1),
        status: ['delivered', 'processing', 'pending', 'confirmed', 'shipped'][i % 5],
        paymentStatus: i % 3 === 0 ? 'unpaid' : 'paid',
        paymentMethod: ['card', 'bank-transfer', 'cash-on-delivery'][i % 3],
        trackingNumber: i % 3 === 0 ? null : `TRK-AG-${String(i + 1).padStart(4, '0')}`,
        shippingAddress: {
          region: createdUsers[i + 2].region,
          city: createdUsers[i + 2].region,
          address: `${Math.floor(Math.random() * 1000)} Farm Street`,
          zipCode: 'AZ' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          phone: '+99450' + String(Math.floor(Math.random() * 10000000)).padStart(7, '0')
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} orders`);

    console.log('🏆 Creating user reputation records...');
    const reputations = createdUsers.map((user, index) => ({
      user: user._id,
      points: Math.floor(Math.random() * 1500),
      statistics: {
        totalAnswers: Math.floor(Math.random() * 100),
        helpfulAnswers: Math.floor(Math.random() * 50),
        totalPosts: Math.floor(Math.random() * 30),
        totalHelpfulVotes: Math.floor(Math.random() * 60)
      }
    }));
    await UserReputation.insertMany(reputations);
    console.log(`✅ Created ${reputations.length} reputation records`);

    console.log('💬 Creating community discussions...');
    const discussions = [
      {
        title: 'Best practices for drip irrigation in cotton fields?',
        content: 'I have a 10-hectare cotton field and want to implement drip irrigation. What spacing should I use for the drip lines? Any recommendations from experienced farmers?',
        author: createdUsers[3]._id,
        problemType: 'irrigation',
        category: 'irrigation-problems',
        tags: ['drip-irrigation', 'cotton', 'water-pressure'],
        views: 156,
        isSolved: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Tomato leaf curl disease - need help!',
        content: 'My tomato plants are showing leaf curl symptoms. Leaves are yellowing and curling upward. This started about a week ago.',
        author: createdUsers[4]._id,
        problemType: 'plant-disease',
        category: 'crop-diseases',
        tags: ['tomatoes', 'disease', 'leaf-curl'],
        views: 89,
        isSolved: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'How to improve soil pH for grape cultivation?',
        content: 'My soil test shows pH 5.8, but grapes prefer 6.0-6.5. Which amendments should I apply and at what rates?',
        author: createdUsers[5]._id,
        problemType: 'soil-issues',
        category: 'soil-fertility',
        tags: ['grapes', 'soil-ph', 'amendments'],
        views: 124,
        isSolved: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Solar panel maintenance in dusty conditions',
        content: 'In our dusty region, panels lose efficiency quickly. How often should I clean and what method is safest?',
        author: createdUsers[6]._id,
        problemType: 'equipment-problems',
        category: 'equipment-devices',
        tags: ['solar', 'maintenance', 'dust'],
        views: 167,
        isSolved: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ];
    const createdDiscussions = await Discussion.insertMany(discussions);
    console.log(`✅ Created ${createdDiscussions.length} discussions`);

    console.log('📢 Creating alerts...');
    const alerts = [
      {
        type: 'LOW_WATER',
        severity: 'WARNING',
        message: 'Water tank level dropped to 18% in SYS-2026-008',
        isRead: false,
        timestamp: new Date(Date.now() - 35 * 60 * 1000)
      },
      {
        type: 'BATTERY_LOW',
        severity: 'WARNING',
        message: 'Battery level is 19% in SYS-2026-008',
        isRead: false,
        timestamp: new Date(Date.now() - 70 * 60 * 1000)
      },
      {
        type: 'IRRIGATION_START',
        severity: 'INFO',
        message: 'Irrigation started automatically for zone 2 in SYS-2026-001',
        isRead: true,
        timestamp: new Date(Date.now() - 140 * 60 * 1000)
      },
      {
        type: 'IRRIGATION_STOP',
        severity: 'INFO',
        message: 'Irrigation cycle completed successfully',
        isRead: true,
        timestamp: new Date(Date.now() - 210 * 60 * 1000)
      },
      {
        type: 'SYSTEM_OPTIMAL',
        severity: 'INFO',
        message: 'All systems operating at optimal conditions',
        isRead: true,
        timestamp: new Date(Date.now() - 300 * 60 * 1000)
      }
    ];
    await Alert.insertMany(alerts);
    console.log(`✅ Created ${alerts.length} alerts`);

    console.log('⚠️ Creating admin alerts...');
    const adminAlerts = [
      {
        systemId: 'SYS-2026-008',
        systemOwnerId: createdUsers[10]._id,
        ownerName: createdUsers[10].name,
        region: 'Lankaran',
        alertType: 'NETWORK_FAILURE',
        severity: 'WARNING',
        message: 'Poor network connectivity detected',
        details: 'Packet loss above 18% for last 20 minutes',
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        systemId: 'SYS-2026-015',
        systemOwnerId: createdUsers[15]._id,
        ownerName: createdUsers[15].name,
        region: 'Sumgait',
        alertType: 'SYSTEM_OFFLINE',
        severity: 'CRITICAL',
        message: 'System is offline',
        details: 'No telemetry received in last 60 minutes',
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 90 * 60 * 1000)
      },
      {
        systemId: 'SYS-2026-008',
        systemOwnerId: createdUsers[10]._id,
        ownerName: createdUsers[10].name,
        region: 'Lankaran',
        alertType: 'BATTERY_CRITICAL',
        severity: 'WARNING',
        message: 'Battery trending lower than expected',
        details: 'Battery projection below 20% in next 8 hours',
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 150 * 60 * 1000)
      }
    ];
    await AdminAlert.insertMany(adminAlerts);
    console.log(`✅ Created ${adminAlerts.length} admin alerts`);

    console.log('\n🎉 Comprehensive seed complete!\n');
    console.log('📊 Summary:');
    console.log(`   ✓ ${createdUsers.length} users with geographic locations`);
    console.log(`   ✓ ${createdDevices.length} devices for shop`);
    console.log(`   ✓ ${createdSystems.length} irrigation systems mapped across regions`);
    console.log(`   ✓ ${createdOrders.length} orders with various statuses`);
    console.log(`   ✓ Community discussions and alerts populated`);
    console.log('\n📍 Demo Accounts:');
    console.log('   Admin: admin@agranova.com / admin123');
    console.log('   Admin: demo@agranova.com / demo123');
    console.log('\n🔗 Sample Farmer Accounts:');
    createdUsers.slice(2, 6).forEach(user => {
      console.log(`   ${user.email} / user123 (${user.region})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedComprehensive();
