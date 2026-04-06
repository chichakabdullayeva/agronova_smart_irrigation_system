const mongoose = require('mongoose');

// Question Schema
const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isBestAnswer: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  answers: [answerSchema],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);

// DB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agranova';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

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

  try {
    await connectDB();

    if (req.method === 'GET') {
      const questions = await Question.find()
        .populate('user', 'name email')
        .populate('answers.user', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: questions
      });
    } else if (req.method === 'POST') {
      const { title, content, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      // For now, use a mock user ID since auth is hardcoded
      const mockUserId = '507f1f77bcf86cd799439011'; // Mock ObjectId

      const question = await Question.create({
        user: mockUserId,
        title,
        content,
        tags: tags || []
      });

      await question.populate('user', 'name email');

      res.status(201).json({
        success: true,
        data: question
      });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
