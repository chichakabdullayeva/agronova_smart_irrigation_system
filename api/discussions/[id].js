import { loadData, saveData } from '../../_utils/dataStore.js';

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

  const discussions = await loadData('discussions', []);
  const discussionId = req.url.split('/').pop();
  const discussionIndex = discussions.findIndex((item) => item._id === discussionId);

  if (discussionIndex === -1) {
    return res.status(404).json({ success: false, message: 'Discussion not found' });
  }

  discussions[discussionIndex].views = (discussions[discussionIndex].views || 0) + 1;
  await saveData('discussions', discussions);

  res.status(200).json({ success: true, data: discussions[discussionIndex] });
}
