const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Alert = require('../models/Alert');
const { isDatabaseConnected } = require('../config/database');

// Get all alerts
router.get('/', protect, async (req, res) => {
  try {
    // If database is not connected, return mock data
    if (!isDatabaseConnected()) {
      const mockAlerts = [
        {
          _id: 'demo_alert_001',
          title: 'High Moisture Level',
          description: 'Soil moisture is above 90%',
          type: 'warning',
          severity: 'medium',
          isRead: false,
          timestamp: new Date(),
          systemId: 'demo_system_001'
        },
        {
          _id: 'demo_alert_002',
          title: 'Low Battery',
          description: 'Solar panel battery: 25%',
          type: 'warning',
          severity: 'high',
          isRead: false,
          timestamp: new Date(Date.now() - 3600000),
          systemId: 'demo_system_001'
        }
      ];

      return res.status(200).json({
        success: true,
        count: mockAlerts.length,
        data: mockAlerts,
        _note: 'Running in demo mode - data is simulated'
      });
    }

    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50);
    
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark alert as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark all alerts as read
router.put('/read/all', protect, async (req, res) => {
  try {
    await Alert.updateMany({ isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All alerts marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete alert
router.delete('/:id', protect, async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Alert deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
