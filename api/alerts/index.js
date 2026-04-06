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

  // Mock alerts
  const alerts = [
    {
      _id: '1',
      type: 'warning',
      message: 'Soil moisture is low in Field A',
      severity: 'medium',
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      _id: '2',
      type: 'info',
      message: 'Irrigation cycle completed successfully',
      severity: 'low',
      read: false,
      createdAt: new Date(Date.now() - 7200000)
    }
  ];

  res.status(200).json({
    success: true,
    data: alerts
  });
}
