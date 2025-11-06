import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/roomipk";
const client = new MongoClient(uri);

let database;

export const connectToDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📡 Connection URI:', uri.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));
    
    await client.connect();
    database = client.db('roomipk');
    
    console.log('✅ Connected to MongoDB');
    console.log('🏷️ Database name:', database.databaseName);
    
    // List all databases to verify connection
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();
    console.log('📊 Available databases:', databases.databases.map(db => db.name));
    
    // Create collections if they don't exist
    const collections = await database.listCollections().toArray();
    console.log('📂 Existing collections:', collections.map(c => c.name));
    
    if (!collections.find(c => c.name === 'users')) {
      await database.createCollection('users');
      console.log('✅ Created users collection');
    }
    
    if (!collections.find(c => c.name === 'verification_codes')) {
      await database.createCollection('verification_codes');
      console.log('✅ Created verification_codes collection');
    }
    
    // Create indexes
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    await database.collection('users').createIndex({ username: 1 }, { unique: true });
    await database.collection('verification_codes').createIndex({ createdAt: 1 }, { expireAfterSeconds: 480 });
    
    console.log('✅ Database setup complete');
    return database;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB service is running');
    console.log('2. Check if MongoDB is installed correctly');
    console.log('3. Try: mongod --version to check installation');
    process.exit(1);
  }
};

export const getDatabase = () => {
  if (!database) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return database;
};

export const getCollection = (collectionName) => {
  return getDatabase().collection(collectionName);
};