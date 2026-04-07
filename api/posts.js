import { loadData, saveData } from './_utils/dataStore.js';
import { getUserFromRequest } from './_utils/auth.js';
import { parseRequestBody } from './_utils/bodyParser.js';

const DEFAULT_POSTS = [];

function normalizePost(post, currentUser) {
  const likedByUser = currentUser && Array.isArray(post.likes)
    ? post.likes.includes(currentUser._id)
    : false;

  return {
    ...post,
    likeCount: Array.isArray(post.likes) ? post.likes.length : 0,
    commentCount: Array.isArray(post.comments) ? post.comments.length : 0,
    isLikedByUser: likedByUser
  };
}

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
  const posts = await loadData('posts', DEFAULT_POSTS);

  if (req.method === 'GET') {
    const { page = 1, limit = 10, sort = 'recent', problemType, search } = req.query;
    let filtered = [...posts];

    if (problemType) {
      filtered = filtered.filter((post) => post.problemType === problemType);
    }

    if (search) {
      const searchLower = String(search).toLowerCase();
      filtered = filtered.filter((post) =>
        String(post.title).toLowerCase().includes(searchLower) ||
        String(post.description).toLowerCase().includes(searchLower)
      );
    }

    if (sort === 'popular') {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const start = (pageNumber - 1) * limitNumber;
    const paged = filtered.slice(start, start + limitNumber);

    res.status(200).json({
      success: true,
      posts: paged.map((post) => normalizePost(post, currentUser)),
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: filtered.length,
        pages: Math.max(1, Math.ceil(filtered.length / limitNumber))
      }
    });
    return;
  }

  if (req.method === 'POST') {
    const body = await parseRequestBody(req);
    const fields = body.fields || body;
    const files = body.files || {};

    const title = String(fields.title || '').trim();
    const description = String(fields.description || '').trim();
    const problemType = String(fields.problemType || 'general');
    const category = String(fields.category || 'general');
    const tags = String(fields.tags || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const author = currentUser || { _id: '0', name: 'Anonymous', email: 'anonymous@agranova.com', role: 'guest' };

    // Process attached files
    const imageCount = files.images ? (Array.isArray(files.images) ? files.images.length : 1) : 0;
    const videoCount = files.videos ? (Array.isArray(files.videos) ? files.videos.length : 1) : 0;

    const newPost = {
      _id: `post_${Date.now()}`,
      title,
      description,
      problemType,
      category,
      tags,
      author,
      likes: [],
      comments: [],
      images: imageCount,
      videos: videoCount,
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    await saveData('posts', posts);

    res.status(201).json({
      success: true,
      data: normalizePost(newPost, currentUser)
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
