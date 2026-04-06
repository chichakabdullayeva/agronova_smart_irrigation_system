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
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const currentUser = await getUserFromRequest(req);
  if (!currentUser) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const body = await parseJsonBody(req);
  const content = String(body.content || '').trim();

  if (!content) {
    return res.status(400).json({ success: false, message: 'Comment content is required' });
  }

  const groups = await loadData('groups', []);
  const segments = req.url.split('/');
  const groupId = segments[segments.indexOf('groups') + 1];
  const postId = segments[segments.indexOf('posts') + 1];

  const group = groups.find((item) => item._id === groupId);
  if (!group) {
    return res.status(404).json({ success: false, message: 'Group not found' });
  }

  const post = (group.posts || []).find((item) => item._id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found in group' });
  }

  post.comments = post.comments || [];
  const newComment = {
    _id: `comment_${Date.now()}`,
    author: currentUser,
    content,
    createdAt: new Date().toISOString()
  };

  post.comments.push(newComment);
  await saveData('groups', groups);

  res.status(201).json({
    success: true,
    comment: newComment,
    commentCount: post.comments.length
  });
}
