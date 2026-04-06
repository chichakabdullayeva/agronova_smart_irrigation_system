import { loadData, saveData } from '../../../../../_utils/dataStore.js';
import { getUserFromRequest } from '../../../../../_utils/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const currentUser = await getUserFromRequest(req);
  if (!currentUser) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const discussions = await loadData('discussions', []);
  const segments = req.url.split('/');
  const discussionId = segments[segments.indexOf('discussions') + 1];
  const replyId = segments[segments.indexOf('replies') + 1];

  const discussion = discussions.find((item) => item._id === discussionId);
  if (!discussion) {
    return res.status(404).json({ success: false, message: 'Discussion not found' });
  }

  const reply = (discussion.replies || []).find((item) => item._id === replyId);
  if (!reply) {
    return res.status(404).json({ success: false, message: 'Reply not found' });
  }

  reply.isHelpful = true;
  discussion.lastActivityAt = new Date().toISOString();
  await saveData('discussions', discussions);

  res.status(200).json({ success: true, data: discussion });
}
