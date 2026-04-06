import { loadData } from '../../_utils/dataStore.js';
import { getUserFromRequest } from '../../_utils/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const currentUser = await getUserFromRequest(req);
  const groups = await loadData('groups', []);
  const groupId = req.url.split('/').pop();
  const group = groups.find((item) => item._id === groupId);

  if (!group) {
    return res.status(404).json({ success: false, message: 'Group not found' });
  }

  const memberIds = group.members || [];
  const isMember = currentUser && memberIds.includes(currentUser._id);
  const isAdmin = currentUser && (group.creator?._id === currentUser._id || currentUser.role === 'admin');

  res.status(200).json({
    success: true,
    data: group,
    userRole: isMember ? (isAdmin ? 'admin' : 'member') : 'visitor'
  });
}
