import jwt from 'jsonwebtoken';
import { parseJsonBody } from '../_utils/bodyParser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agranova_secret_key_2026';

// In-memory store for new users (persists during deployment)
let registeredUsers = {};

// Pre-loaded demo users
const demoUsers = {
  'demo@agranova.com': { _id: '1', email: 'demo@agranova.com', name: 'Demo User', role: 'user' },
  'admin@agranova.com': { _id: '2', email: 'admin@agranova.com', name: 'Admin User', role: 'admin' },
  'testuser@example.com': { _id: '3', email: 'testuser@example.com', name: 'Test User', role: 'user' }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password, name } = await parseJsonBody(req);

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and name are required'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if already registered
  if (registeredUsers[normalizedEmail] || demoUsers[normalizedEmail]) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const newUser = {
    _id: Date.now().toString(),
    email: normalizedEmail,
    name,
    role: 'user'
  };

  registeredUsers[normalizedEmail] = newUser;

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    data: {
      token,
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
}
