import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agranova_secret_key_2026';

// Simple in-memory user store (replace with MongoDB in production)
let registeredUsers = {
  'demo@agranova.com': {
    _id: '1',
    email: 'demo@agranova.com',
    name: 'Demo User',
    role: 'user'
  }
};

import { parseJsonBody } from '../_utils/bodyParser.js';

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

  if (registeredUsers[email]) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const newUser = {
    _id: Date.now().toString(),
    email,
    name,
    role: 'user'
  };

  registeredUsers[email] = newUser;

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
