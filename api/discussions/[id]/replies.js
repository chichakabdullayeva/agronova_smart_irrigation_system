import { loadData, saveData } from '../../../../../_utils/dataStore.js';
import { getUserFromRequest } from '../../../../../_utils/auth.js';
import { parseJsonBody } from '../../../../../_utils/bodyParser.js';

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
    return res.status(400).json({ success: false, message: 'Reply content is required' });
  }

  const discussions = await loadData('discussions', []);
  const discussionId = req.url.split('/').slice(-2, -1)[0];
  const discussion = discussions.find((item) => item._id === discussionId);

  if (!discussion) {
    return res.status(404).json({ success: false, message: 'Discussion not found' });
  }

  discussion.replies = discussion.replies || [];
  const reply = {
    _id: `reply_${Date.now()}`,
    author: currentUser,
    content,
    createdAt: new Date().toISOString(),
    isHelpful: false
  };

  discussion.replies.push(reply);
  discussion.lastActivityAt = new Date().toISOString();
  await saveData('discussions', discussions);

  res.status(201).json({ success: true, data: discussion });
}
