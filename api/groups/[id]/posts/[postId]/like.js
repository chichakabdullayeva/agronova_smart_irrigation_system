import { loadData, saveData } from '../../../../../_utils/dataStore.js';
import { getUserFromRequest } from '../../../../../_utils/auth.js';

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

  post.likes = post.likes || [];
  const likeIndex = post.likes.indexOf(currentUser._id);

  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1);
  } else {
    post.likes.push(currentUser._id);
  }

  await saveData('groups', groups);

  res.status(200).json({
    success: true,
    likeCount: post.likes.length,
    liked: likeIndex === -1
  });
}
