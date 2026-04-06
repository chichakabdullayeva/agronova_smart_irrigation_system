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
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const currentUser = await getUserFromRequest(req);
  const posts = await loadData('posts', []);
  const postId = req.url.split('/').pop();
  const index = posts.findIndex((post) => post._id === postId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const post = posts[index];
  if (!post.likes) post.likes = [];

  const userIndex = currentUser ? post.likes.indexOf(currentUser._id) : -1;
  if (userIndex > -1) {
    post.likes.splice(userIndex, 1);
  } else if (currentUser) {
    post.likes.push(currentUser._id);
  }

  await saveData('posts', posts);

  res.status(200).json({
    success: true,
    likeCount: post.likes.length,
    liked: userIndex === -1
  });
}
