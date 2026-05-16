import { parseJsonBody } from '../_utils/bodyParser.js';
import { loadUsers, saveUsers } from '../_utils/userStore.js';
import { signToken, hashPassword } from '../_utils/auth.js';

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
  let name;
  let region;

  try {
    ({ email, password, name, region } = await parseJsonBody(req));
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Invalid request body'
    });
  }

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and name are required'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUsers = await loadUsers();

  if (existingUsers[normalizedEmail]) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const newUser = {
    _id: Date.now().toString(),
    email: normalizedEmail,
    name,
    role: 'user',
    region: region || '',
    password: hashPassword(password)
  };

  existingUsers[normalizedEmail] = newUser;
  await saveUsers(existingUsers);

  const token = signToken(newUser);

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
