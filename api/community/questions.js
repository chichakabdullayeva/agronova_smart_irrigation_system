let questions = [
  {
    _id: '1',
    title: 'Best time to irrigate?',
    content: 'What is the optimal time for irrigation?',
    user: { name: 'Demo User', email: 'demo@agranova.com' },
    tags: ['irrigation'],
    answers: [],
    createdAt: new Date()
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: questions
    });
  } else if (req.method === 'POST') {
    try {
      const { title, content, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      const newQuestion = {
        _id: Date.now().toString(),
        title,
        content,
        tags: tags || [],
        user: { name: 'Anonymous', email: 'user@example.com' }, // Mock user, in real app get from token
        answers: [],
        createdAt: new Date()
      };

      questions.push(newQuestion);

      res.status(201).json({
        success: true,
        data: newQuestion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
