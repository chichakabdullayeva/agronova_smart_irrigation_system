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

  // Mock devices
  const devices = [
    {
      _id: '1',
      name: 'Soil Moisture Sensor',
      type: 'sensor',
      status: 'active',
      location: 'Field A',
      price: 45.99,
      description: 'Advanced soil moisture sensor with real-time data tracking',
      category: 'sensors',
      stock: 15
    },
    {
      _id: '2',
      name: 'Wi-Fi Water Pump',
      type: 'pump',
      status: 'active',
      location: 'Field B',
      price: 129.99,
      description: 'Smart water pump with Wi-Fi connectivity',
      category: 'pumps',
      stock: 8
    },
    {
      _id: '3',
      name: 'Temperature & Humidity Sensor',
      type: 'sensor',
      status: 'active',
      location: 'Greenhouse',
      price: 35.99,
      description: 'Accurate temperature and humidity monitoring',
      category: 'sensors',
      stock: 20
    },
    {
      _id: '4',
      name: 'pH Sensor',
      type: 'sensor',
      status: 'active',
      location: 'Field C',
      price: 55.99,
      description: 'Soil pH measurement sensor',
      category: 'sensors',
      stock: 12
    }
  ];

  res.status(200).json({
    success: true,
    data: devices
  });
}
