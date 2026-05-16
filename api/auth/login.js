import { parseJsonBody } from '../_utils/bodyParser.js';
import { getAllUsers, signToken, verifyPassword } from '../_utils/auth.js';

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

  let email;
  let password;

  try {
    ({ email, password } = await parseJsonBody(req));
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid request body'
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const users = await getAllUsers();
  const user = users[normalizedEmail];

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const token = signToken(user);

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
