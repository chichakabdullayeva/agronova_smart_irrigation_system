import { loadData, saveData } from '../../../_utils/dataStore.js';
import { getUserFromRequest } from '../../../_utils/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const currentUser = await getUserFromRequest(req);
  // Allow anonymous joining for now (same as posts)
  const user = currentUser || { _id: 'anonymous_' + Date.now(), name: 'Anonymous User', email: 'anonymous@agranova.com', role: 'guest' };

  const groups = await loadData('groups', []);
  
  // Vercel dynamic routing: Extract groupId from [id] parameter
  const groupId = req.query.id;
  
  if (!groupId) {
    return res.status(400).json({ success: false, message: 'Group ID is required' });
  }
  
  const group = groups.find((item) => item._id === groupId);

  if (!group) {
    return res.status(404).json({ success: false, message: 'Group not found' });
  }

  group.members = group.members || [];
  if (group.members.includes(user._id)) {
    return res.status(400).json({ success: false, message: 'Already a member' });
  }

  group.members.push(user._id);
  await saveData('groups', groups);

  res.status(200).json({ success: true, data: group });
}
