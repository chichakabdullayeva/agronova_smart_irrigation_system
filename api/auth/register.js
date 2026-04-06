import jwt from 'jsonwebtoken';
import { loadUsers, saveUsers, normalizeEmail } from '../_utils/userStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agranova_secret_key_2026';

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

  const normalizedEmail = normalizeEmail(email);
  const users = await loadUsers();

  if (users[normalizedEmail]) {
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

  users[normalizedEmail] = newUser;
  await saveUsers(users);

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
