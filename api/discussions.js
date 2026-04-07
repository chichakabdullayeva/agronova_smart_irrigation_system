import { loadData, saveData } from './_utils/dataStore.js';
import { getUserFromRequest } from './_utils/auth.js';
import { parseRequestBody } from './_utils/bodyParser.js';

const DEFAULT_DISCUSSIONS = [];

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
  const discussions = await loadData('discussions', DEFAULT_DISCUSSIONS);

  if (req.method === 'GET') {
    const { page = 1, limit = 10, sort = 'recent', problemType, search, category } = req.query;
    let list = [...discussions];

    if (problemType) {
      list = list.filter((item) => item.problemType === problemType);
    }

    if (category) {
      list = list.filter((item) => item.category === category);
    }

    if (search) {
      const searchLower = String(search).toLowerCase();
      list = list.filter((item) =>
        String(item.title).toLowerCase().includes(searchLower) ||
        String(item.content).toLowerCase().includes(searchLower)
      );
    }

    if (sort === 'active') {
      list.sort((a, b) => new Date(b.lastActivityAt || b.createdAt) - new Date(a.lastActivityAt || a.createdAt));
    } else if (sort === 'popular') {
      list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (sort === 'solved') {
      list = list.filter((item) => item.isSolved);
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const start = (pageNumber - 1) * limitNumber;
    const paged = list.slice(start, start + limitNumber);

    res.status(200).json({
      success: true,
      data: {
        discussions: paged,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: list.length,
          pages: Math.max(1, Math.ceil(list.length / limitNumber))
        }
      }
    });
    return;
  }

  if (req.method === 'POST') {
    const body = await parseRequestBody(req);
    const fields = body.fields || body;
    const title = String(fields.title || '').trim();
    const content = String(fields.content || '').trim();
    const category = String(fields.category || 'general-questions');
    const problemType = String(fields.problemType || 'general');
    const tags = String(fields.tags || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    let imageUrls = [];
    if (fields.imageUrls) {
      try {
        imageUrls = typeof fields.imageUrls === 'string'
          ? JSON.parse(fields.imageUrls)
          : fields.imageUrls;
      } catch (error) {
        imageUrls = [String(fields.imageUrls)];
      }
      if (!Array.isArray(imageUrls)) {
        imageUrls = [String(imageUrls)];
      }
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const author = currentUser || { _id: '0', name: 'Anonymous', email: 'anonymous@agranova.com', role: 'guest' };

    const newDiscussion = {
      _id: `discussion_${Date.now()}`,
      title,
      content,
      category,
      problemType,
      tags,
      imageUrls,
      author,
      replies: [],
      views: 0,
      likes: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      isSolved: false
    };

    discussions.unshift(newDiscussion);
    await saveData('discussions', discussions);

    return res.status(201).json({ success: true, data: newDiscussion });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
