import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import database and routes
import { connectToDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Fix CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Roomi.pk Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Test database route
app.get('/api/test-db', async (req, res) => {
  try {
    const database = (await import('./config/database.js')).getDatabase();
    const testDoc = {
      message: 'Database test',
      timestamp: new Date()
    };
    
    const result = await database.collection('test').insertOne(testDoc);
    
    const collections = await database.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.json({
      success: true,
      database: database.databaseName,
      testInsert: result.insertedId,
      collections: collectionNames,
      message: 'Database is working correctly'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🚀 Roomi.pk Backend running on http://localhost:${PORT}`);
});