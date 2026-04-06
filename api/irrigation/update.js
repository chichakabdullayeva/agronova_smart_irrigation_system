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

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { pumpEnabled, soilMoistureThreshold, wateringDuration, wateringInterval, autoMode } = await parseJsonBody(req);

  // Mock config update
  const updatedConfig = {
    pumpEnabled: pumpEnabled !== undefined ? pumpEnabled : true,
    soilMoistureThreshold: soilMoistureThreshold || 40,
    wateringDuration: wateringDuration || 30,
    wateringInterval: wateringInterval || 6,
    autoMode: autoMode !== undefined ? autoMode : true
  };

  res.status(200).json({
    success: true,
    data: updatedConfig,
    message: 'Configuration updated successfully'
  });
}
