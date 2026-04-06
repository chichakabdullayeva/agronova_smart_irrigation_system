import { parseJsonBody } from '../_utils/bodyParser.js';

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

  const { userId, deviceId, quantity, totalPrice } = await parseJsonBody(req);

  if (!userId || !deviceId || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  // Mock order creation
  const order = {
    _id: Date.now().toString(),
    userId,
    items: [
      {
        deviceId,
        quantity,
        price: totalPrice / quantity
      }
    ],
    totalPrice,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created successfully'
  });
}
