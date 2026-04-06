import { parseJsonBody } from '../../_utils/bodyParser.js';

export default async function handler(req, res) {
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { pumpId, action, duration } = await parseJsonBody(req);

  if (!pumpId || !action) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      pumpId,
      action,
      duration: duration || 30,
      timestamp: new Date(),
      status: 'executed'
    },
    message: `Pump ${action} command executed successfully`
  });
}
