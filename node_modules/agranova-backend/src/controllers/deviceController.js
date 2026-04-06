const Device = require('../models/Device');
const { isDatabaseConnected } = require('../config/database');

// Mock device data for demo mode
const getMockDevices = () => [
  {
    _id: 'demo_device_001',
    name: 'Basic Irrigation Controller',
    model: 'IC-100',
    description: 'Entry-level irrigation controller with 4 zones and mobile app connectivity',
    features: [
      '4-zone control',
      'Mobile app integration',
      'Weather-based scheduling',
      'Battery backup'
    ],
    specifications: {
      waterCapacity: 'Up to 4 zones',
      coverage: '0.5-2 hectares',
      solarPower: 'Optional solar panel',
      connectivity: 'WiFi + Bluetooth'
    },
    price: 299.99,
    currency: 'USD',
    category: 'irrigation-controller',
    inStock: true,
    stockQuantity: 15,
    rating: 4.2,
    reviewCount: 28,
    image: '/devices/controller.jpg',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: 'demo_device_002',
    name: 'Advanced Sensor Kit',
    model: 'SK-200',
    description: 'Complete sensor package with soil moisture, temperature, and humidity sensors',
    features: [
      'Soil moisture monitoring',
      'Temperature & humidity sensors',
      'Wireless connectivity',
      'Real-time data transmission',
      'Weather-resistant design'
    ],
    specifications: {
      waterCapacity: 'N/A',
      coverage: '1-3 hectares',
      solarPower: 'Solar powered',
      connectivity: 'LoRa + WiFi'
    },
    price: 449.99,
    currency: 'USD',
    category: 'sensor-kit',
    inStock: true,
    stockQuantity: 8,
    rating: 4.5,
    reviewCount: 42,
    image: '/devices/sensor-kit.jpg',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: 'demo_device_003',
    name: 'Complete Irrigation System',
    model: 'CIS-500',
    description: 'Full-featured irrigation system with controller, sensors, and pump integration',
    features: [
      '8-zone controller',
      'Integrated sensor network',
      'Pump control',
      'Advanced scheduling',
      'Remote monitoring',
      'Automated watering'
    ],
    specifications: {
      waterCapacity: 'Up to 8 zones',
      coverage: '2-5 hectares',
      solarPower: 'Solar hybrid',
      connectivity: 'WiFi + Cellular'
    },
    price: 899.99,
    currency: 'USD',
    category: 'complete-system',
    inStock: true,
    stockQuantity: 5,
    rating: 4.7,
    reviewCount: 15,
    image: '/devices/complete-system.jpg',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: 'demo_device_004',
    name: 'High-Capacity Pump System',
    model: 'PS-300',
    description: 'Powerful pump system for large-scale irrigation with variable speed control',
    features: [
      'Variable speed control',
      'High flow capacity',
      'Energy efficient',
      'Remote monitoring',
      'Automatic protection systems'
    ],
    specifications: {
      waterCapacity: '500-1000 L/min',
      coverage: '3-10 hectares',
      solarPower: 'Optional solar boost',
      connectivity: 'WiFi + Modbus'
    },
    price: 1299.99,
    currency: 'USD',
    category: 'pump-system',
    inStock: false,
    stockQuantity: 0,
    rating: 4.3,
    reviewCount: 8,
    image: '/devices/pump-system.jpg',
    isActive: true,
    createdAt: new Date()
  }
];

// @desc    Get all devices
// @route   GET /api/devices
// @access  Public
exports.getDevices = async (req, res) => {
  try {
    const { category, inStock, minPrice, maxPrice, search } = req.query;
    
    // If database is not connected, return mock data
    if (!isDatabaseConnected()) {
      let mockDevices = getMockDevices();
      
      if (category) mockDevices = mockDevices.filter(d => d.category === category);
      if (inStock === 'true') mockDevices = mockDevices.filter(d => d.inStock === true);
      if (minPrice) mockDevices = mockDevices.filter(d => d.price >= parseFloat(minPrice));
      if (maxPrice) mockDevices = mockDevices.filter(d => d.price <= parseFloat(maxPrice));
      if (search) {
        const searchLower = search.toLowerCase();
        mockDevices = mockDevices.filter(d =>
          d.name.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower)
        );
      }

      return res.status(200).json({
        success: true,
        count: mockDevices.length,
        data: mockDevices,
        _note: 'Running in demo mode - data is simulated'
      });
    }
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (inStock === 'true') query.inStock = true;
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const devices = await Device.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch devices'
    });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Public
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch device'
    });
  }
};

// @desc    Create device (Admin only)
// @route   POST /api/devices
// @access  Private/Admin
exports.createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);

    // Log device creation
    if (req.logChange) {
      req.logChange({
        action: 'CREATE',
        collectionName: 'Device',
        documentId: device._id,
        newValues: device.toObject(),
        reason: 'New device added by admin'
      }).catch(err => console.error('Audit log error:', err));
    }

    // Log behavior
    if (req.logBehavior) {
      req.logBehavior({
        action: 'DEVICE_CREATED',
        category: 'DEVICE_OPERATION',
        relatedEntityType: 'Device',
        relatedEntityId: device._id,
        description: `Created device: ${device.name || 'Unnamed'}`,
        data: { price: device.price },
        severity: 'LOW'
      }).catch(err => console.error('Audit log error:', err));
    }

    res.status(201).json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('Error creating device:', error);
    
    // Log failed creation
    if (req.logBehavior) {
      req.logBehavior({
        action: 'DEVICE_CREATION_FAILED',
        category: 'DEVICE_OPERATION',
        description: 'Failed to create device',
        result: 'FAILED',
        errorDetails: error.message,
        severity: 'MEDIUM'
      }).catch(err => console.error('Audit log error:', err));
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create device'
    });
  }
};

// @desc    Update device (Admin only)
// @route   PUT /api/devices/:id
// @access  Private/Admin
exports.updateDevice = async (req, res) => {
  try {
    // Get old values
    const oldDevice = await Device.findById(req.params.id);
    if (!oldDevice) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }
    const oldValues = oldDevice.toObject();

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Calculate changed fields
    const changedFields = Object.keys(req.body).filter(
      key => JSON.stringify(oldValues[key]) !== JSON.stringify(req.body[key])
    );

    // Log device update
    if (req.logChange && changedFields.length > 0) {
      req.logChange({
        action: 'UPDATE',
        collectionName: 'Device',
        documentId: device._id,
        oldValues,
        newValues: device.toObject(),
        changedFields,
        reason: `Device updated: ${changedFields.join(', ')}`
      }).catch(err => console.error('Audit log error:', err));
    }

    // Log behavior
    if (req.logBehavior && changedFields.length > 0) {
      req.logBehavior({
        action: 'DEVICE_UPDATED',
        category: 'DEVICE_OPERATION',
        relatedEntityType: 'Device',
        relatedEntityId: device._id,
        description: `Updated device: ${device.name || 'Unnamed'}`,
        data: { changedFields },
        severity: 'LOW'
      }).catch(err => console.error('Audit log error:', err));
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('Error updating device:', error);
    
    // Log failed update
    if (req.logBehavior) {
      req.logBehavior({
        action: 'DEVICE_UPDATE_FAILED',
        category: 'DEVICE_OPERATION',
        relatedEntityId: req.params.id,
        description: 'Failed to update device',
        result: 'FAILED',
        errorDetails: error.message,
        severity: 'MEDIUM'
      }).catch(err => console.error('Audit log error:', err));
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update device'
    });
  }
};

// @desc    Delete device (Admin only)
// @route   DELETE /api/devices/:id
// @access  Private/Admin
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Log device deletion
    if (req.logChange) {
      req.logChange({
        action: 'DELETE',
        collectionName: 'Device',
        documentId: req.params.id,
        oldValues: device.toObject(),
        reason: `Device deleted: ${device.name || 'Unnamed'}`
      }).catch(err => console.error('Audit log error:', err));
    }

    // Log behavior
    if (req.logBehavior) {
      req.logBehavior({
        action: 'DEVICE_DELETED',
        category: 'DEVICE_OPERATION',
        relatedEntityType: 'Device',
        relatedEntityId: req.params.id,
        description: `Deleted device: ${device.name || 'Unnamed'}`,
        severity: 'MEDIUM'
      }).catch(err => console.error('Audit log error:', err));
    }

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting device:', error);
    
    // Log failed delete
    if (req.logBehavior) {
      req.logBehavior({
        action: 'DEVICE_DELETE_FAILED',
        category: 'DEVICE_OPERATION',
        relatedEntityId: req.params.id,
        description: 'Failed to delete device',
        result: 'FAILED',
        errorDetails: error.message,
        severity: 'HIGH'
      }).catch(err => console.error('Audit log error:', err));
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete device'
    });
  }
};
