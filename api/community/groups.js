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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Mock community groups
  const groups = [
    {
      _id: '1',
      name: 'Smart Farming Tips',
      description: 'Share and learn best practices for smart farming',
      members: 245,
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Irrigation Techniques',
      description: 'Discussion on modern irrigation methods',
      members: 189,
      createdAt: new Date()
    }
  ];

  res.status(200).json({
    success: true,
    data: groups
  });
}
