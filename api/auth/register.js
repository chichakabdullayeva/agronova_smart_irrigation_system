import { parseJsonBody } from '../_utils/bodyParser.js';
import { loadUsers, saveUsers } from '../_utils/userStore.js';
import { signToken } from '../_utils/auth.js';

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
    role: 'user'
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
