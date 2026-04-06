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

  // Mock sensor history
  const history = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date();
    date.setHours(date.getHours() - (23 - i));
    history.push({
      timestamp: date,
      temperature: 25 + Math.random() * 8,
      humidity: 55 + Math.random() * 30,
      soilMoisture: 40 + Math.random() * 40,
      ph: 6.5 + Math.random() * 0.8
    });
  }

  res.status(200).json({
    success: true,
    data: history
  });
}
