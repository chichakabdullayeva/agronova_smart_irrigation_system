const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isDatabaseConnected } = require('../config/database');

// In-memory user store for demo mode (when database is not connected)
const demoUsers = new Map();

// Export for use in middleware
exports.getDemoUser = (id) => {
  return Array.from(demoUsers.values()).find(u => u._id === id);
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'demo_secret_key', {
    expiresIn: '30d'
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, region, crops } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Determine role - admin@agranova.com gets admin role automatically
    const role = email.toLowerCase() === 'admin@agranova.com' ? 'admin' : 'user';

    if (isDatabaseConnected()) {
      // Database mode
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        region,
        crops
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
          crops: user.crops,
          token: generateToken(user._id)
        }
      });
    } else {
      // Demo mode - in-memory storage
      if (demoUsers.has(email.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = Date.now().toString();
      
      const user = {
        _id: userId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        region: region || '',
        crops: crops || [],
        createdAt: new Date()
      };

      demoUsers.set(email.toLowerCase(), user);

      res.status(201).json({
        success: true,
        message: 'Registration successful (Demo Mode)',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
          crops: user.crops,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (isDatabaseConnected()) {
      // Database mode
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
          crops: user.crops,
          token: generateToken(user._id)
        }
      });
    } else {
      // Demo mode - in-memory storage
      const user = demoUsers.get(email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
          crops: user.crops,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const user = await User.findById(req.user._id);
      res.status(200).json({
        success: true,
        data: user
      });
    } else {
      // Demo mode - find user in memory
      const user = Array.from(demoUsers.values()).find(u => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      const { password, ...userData } = user;
      res.status(200).json({
        success: true,
        data: userData
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, region, crops } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, region, crops },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
