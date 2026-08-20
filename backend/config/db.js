// backend/config/db.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return false;
    }

    // Connect without deprecated options
    const conn = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

  
    return true;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
 
    
    return false;
  }
};

export default connectDB;