import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agranova_secret_key_2026';

// Mock users
const mockUsers = {
  'demo@agranova.com': {
    _id: '1',
    email: 'demo@agranova.com',
    name: 'Demo User',
    role: 'user'
  },
  'admin@agranova.com': {
    _id: '2',
    email: 'admin@agranova.com',
    name: 'Admin User',
    role: 'admin'
  }
};

export default function handler(req, res) {
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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = mockUsers[email];
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    success: true,
    data: {
      token,
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
}
