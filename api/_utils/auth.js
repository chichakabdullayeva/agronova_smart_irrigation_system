import jwt from 'jsonwebtoken';
import { loadUsers } from './userStore.js';
import { normalizeEmail } from './userStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agranova_secret_key_2026';

const baseUsers = {
  'demo@agranova.com': { _id: '1', email: 'demo@agranova.com', name: 'Demo User', role: 'user' },
  'admin@agranova.com': { _id: '2', email: 'admin@agranova.com', name: 'Admin User', role: 'admin' },
  'testuser@example.com': { _id: '3', email: 'testuser@example.com', name: 'Test User', role: 'user' }
};

export async function getAllUsers() {
  const stored = await loadUsers();
  return { ...baseUsers, ...stored };
}

export async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const users = await getAllUsers();
  return users[normalizedEmail] || null;
}

export async function getUserById(userId) {
  const users = await getAllUsers();
  return Object.values(users).find((user) => user._id === userId) || null;
}

export async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (user) {
      return user;
    }

    return {
      _id: decoded.id,
      email: decoded.email,
      name: decoded.name || 'User',
      role: decoded.role || 'user'
    };
  } catch (error) {
    return null;
  }
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
