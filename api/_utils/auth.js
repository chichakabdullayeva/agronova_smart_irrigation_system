import jwt from 'jsonwebtoken';
import { loadUsers } from './userStore.js';
import { normalizeEmail } from './userStore.js';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'agranova_secret_key_2026';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, hashedPassword) {
  if (!hashedPassword) {
    return false;
  }

  if (!hashedPassword.includes(':')) {
    return password === hashedPassword;
  }

  const [salt, key] = hashedPassword.split(':');
  const derived = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 64, 'sha512').toString('hex');
  return derived === key;
}

const baseUsers = {
  'demo@agranova.com': {
    _id: '1',
    email: 'demo@agranova.com',
    name: 'Demo User',
    role: 'user',
    password: '0e790026e28846b57c56f8d716ff078e:0efbd68d7ae66600c5e984905676b55bc502b55aa5e405c94c084cde586d9b9e7acdbfb83a4d281fc7861b0512dc630e2aa9a1b333913cc3ea2036a66623b637'
  },
  'admin@agranova.com': {
    _id: '2',
    email: 'admin@agranova.com',
    name: 'Admin User',
    role: 'admin',
    password: '6324fc01f9fea11a177d3147abad32ab:2db1e676bb3120b6da361fb04dc68c44c90181f3b8bd3306c6cf608251dccb14a87a1eefa46aa89110bfff5906472b2857591d539e89cdc78db45d143ff29c78'
  },
  'testuser@example.com': {
    _id: '3',
    email: 'testuser@example.com',
    name: 'Test User',
    role: 'user',
    password: '18dc0c792d61d8f324e1241e9910a099:712ec6894491995c1f9f67f3f96a3ad5be8bb182d6265454c1e26b6172c795b3f3da4549a81a2a52a771a629efb8c84b472e46119fa00a29c01ac2d7cd53b850'
  }
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
