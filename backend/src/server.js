require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const { initializeSocket } = require('./config/socket');
const sensorService = require('./services/sensorService');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Initialize Socket.io
const io = initializeSocket(server);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/systems', require('./routes/adminSystems'));
app.use('/api/sensors', require('./routes/sensors'));
app.use('/api/irrigation', require('./routes/irrigation'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/community', require('./routes/community'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AGRANOVA API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║          🌱 AGRANOVA API SERVER 🌱               ║
║                                                   ║
║  Status: RUNNING                                  ║
║  Port: ${PORT}                                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}                        ║
║  Database: Connected                              ║
║  WebSocket: Active                                ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);

  // Start sensor data simulation
  sensorService.startSimulation(io);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  sensorService.stopSimulation();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
