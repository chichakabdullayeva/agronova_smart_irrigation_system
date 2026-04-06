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
  if (!currentUser) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const groups = await loadData('groups', []);
  const groupId = req.url.split('/').slice(-2, -1)[0];
  const group = groups.find((item) => item._id === groupId);

  if (!group) {
    return res.status(404).json({ success: false, message: 'Group not found' });
  }

  group.members = group.members || [];
  group.members = group.members.filter((memberId) => memberId !== currentUser._id);
  await saveData('groups', groups);

  res.status(200).json({ success: true, data: group });
}
