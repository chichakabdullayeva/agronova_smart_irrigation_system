import { loadData } from '../../_utils/dataStore.js';

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
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const discussions = await loadData('discussions', []);

  const total = discussions.length;
  const solved = discussions.filter((item) => item.isSolved).length;
  const totalReplies = discussions.reduce((sum, item) => sum + (item.replies?.length || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      total,
      solved,
      totalReplies
    }
  });
}
