import { loadData, saveData } from '../../../_utils/dataStore.js';
import { getUserFromRequest } from '../../../_utils/auth.js';
import { parseJsonBody } from '../../../_utils/bodyParser.js';

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

  const body = await parseJsonBody(req);
  const content = String(body.content || '').trim();

  if (!content) {
    return res.status(400).json({ success: false, message: 'Post content is required' });
  }

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

  group.posts = group.posts || [];
  const newPost = {
    _id: `gpost_${Date.now()}`,
    author: currentUser,
    content,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  };

  group.posts.push(newPost);
  await saveData('groups', groups);

  res.status(201).json({ success: true, data: group });
}
