import { promises as fs } from 'fs';
import path from 'path';

const TMP_USERS_PATH = '/tmp/users.json';
const BUILTIN_USERS_PATH = path.resolve(process.cwd(), 'api', '_data', 'users.json');

let cachedUsers = null;

async function loadUsers() {
  if (cachedUsers) {
    return cachedUsers;
  }

  try {
    const data = await fs.readFile(TMP_USERS_PATH, 'utf8');
    cachedUsers = JSON.parse(data);
    return cachedUsers;
  } catch (error) {
    // No persisted runtime users available yet.
  }

  try {
    const data = await fs.readFile(BUILTIN_USERS_PATH, 'utf8');
    cachedUsers = JSON.parse(data);
    return cachedUsers;
  } catch (error) {
    cachedUsers = {};
    return cachedUsers;
  }
}

async function saveUsers(users) {
  cachedUsers = users;
  try {
    await fs.writeFile(TMP_USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save users to /tmp/users.json:', error);
  }
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export { loadUsers, saveUsers, normalizeEmail };
