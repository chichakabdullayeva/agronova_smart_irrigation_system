import { loadData, saveData } from './_utils/dataStore.js';
import { getUserFromRequest } from './_utils/auth.js';
import { parseRequestBody } from './_utils/bodyParser.js';

const DEFAULT_GROUPS = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const currentUser = await getUserFromRequest(req);
  const groups = await loadData('groups', DEFAULT_GROUPS);

  if (req.method === 'GET') {
    const { type = 'all', category, search } = req.query;
    let list = [...groups];

    if (type === 'public') {
      list = list.filter((group) => group.type === 'public');
    } else if (type === 'private') {
      list = list.filter((group) => group.type === 'private');
    } else if (type === 'my-groups') {
      const userId = currentUser?._id;
      list = list.filter((group) => userId && group.members?.includes(userId));
    }

    if (category) {
      list = list.filter((group) => group.category === category);
    }

    if (search) {
      const searchLower = String(search).toLowerCase();
      list = list.filter((group) =>
        String(group.name).toLowerCase().includes(searchLower) ||
        String(group.description).toLowerCase().includes(searchLower)
      );
    }

    const payload = list.map((group) => ({
      ...group,
      memberCount: Array.isArray(group.members) ? group.members.length : 0,
      postCount: Array.isArray(group.posts) ? group.posts.length : 0
    }));

    return res.status(200).json({ success: true, data: payload });
  }

  if (req.method === 'POST') {
    const body = await parseRequestBody(req);
    const fields = body.fields || body;

    const name = String(fields.name || '').trim();
    const description = String(fields.description || '').trim();
    const type = String(fields.type || 'public');
    const category = String(fields.category || 'general');

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    const author = currentUser || { _id: '0', name: 'Anonymous', email: 'anonymous@agranova.com' };

    const newGroup = {
      _id: `group_${Date.now()}`,
      name,
      description,
      type,
      category,
      creator: author,
      members: [author._id],
      posts: [],
      createdAt: new Date().toISOString()
    };

    groups.unshift(newGroup);
    await saveData('groups', groups);

    return res.status(201).json({ success: true, data: newGroup });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
