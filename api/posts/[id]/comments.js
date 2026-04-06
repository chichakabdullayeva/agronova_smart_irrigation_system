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
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const currentUser = await getUserFromRequest(req);
  const body = await parseJsonBody(req);
  const content = String(body.content || '').trim();

  if (!content) {
    return res.status(400).json({ success: false, message: 'Comment content is required' });
  }

  const posts = await loadData('posts', []);
  const postId = req.url.split('/').slice(-2)[0];
  const index = posts.findIndex((post) => post._id === postId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const post = posts[index];
  const author = currentUser || { _id: '0', name: 'Anonymous', email: 'anonymous@agranova.com', role: 'guest' };

  const comment = {
    _id: `comment_${Date.now()}`,
    author,
    content,
    createdAt: new Date().toISOString()
  };

  post.comments = post.comments || [];
  post.comments.push(comment);
  await saveData('posts', posts);

  res.status(201).json({
    success: true,
    comment,
    commentCount: post.comments.length
  });
}
