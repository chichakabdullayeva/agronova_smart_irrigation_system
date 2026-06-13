const bcrypt = require('bcryptjs');

async function generateHash() {
  try {
    const password = 'demo123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('\n📋 Demo Admin Account Details:\n');
    console.log('Email:', 'demo@agranova.com');
    console.log('Password:', password);
    console.log('Password Hash:', hashedPassword);
    console.log('Role: admin');
    console.log('Name: Demo Admin');
    console.log('Region: Baku');
    console.log('\n📝 MongoDB Insert Command (use MongoDB Compass or mongosh):\n');
    
    const document = {
      name: 'Demo Admin',
      email: 'demo@agranova.com',
      password: hashedPassword,
      role: 'admin',
      region: 'Baku',
      crops: ['All Crops'],
      profileImage: '',
      groups: [],
      createdAt: new Date()
    };
    
    console.log('db.users.insertOne(' + JSON.stringify(document, null, 2) + ')\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateHash();
