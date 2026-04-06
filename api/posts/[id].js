import { loadData, saveData } from '../../_utils/dataStore.js';
import { getUserFromRequest } from '../../_utils/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const currentUser = await getUserFromRequest(req);
  const posts = await loadData('posts', []);
  const postId = req.url.split('/').pop();
  const index = posts.findIndex((post) => post._id === postId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: posts[index] });
  }

  if (req.method === 'DELETE') {
    const post = posts[index];
    const isOwner = currentUser && post.author?._id === currentUser._id;
    const isAdmin = currentUser && currentUser.role === 'admin';

    if (!currentUser || (!isOwner && !isAdmin)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    posts.splice(index, 1);
    await saveData('posts', posts);

    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
