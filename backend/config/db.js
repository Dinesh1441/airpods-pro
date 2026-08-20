// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return false;
    }

    // Hide password in logs
    const sanitizedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
    console.log('📡 Connecting to MongoDB...');
    console.log('📋 Connection string:', sanitizedUri);
    
    // Connect without deprecated options
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   📍 Host: ${conn.connection.host}`);
    console.log(`   📦 Database: ${conn.connection.name}`);
    console.log(`   🔗 Port: ${conn.connection.port}`);
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected, attempting to reconnect...');
      setTimeout(() => {
        connectDB(3, 10000);
      }, 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
    return true;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Helpful error messages
    if (error.message.includes('bad auth')) {
      console.error('   🔑 Authentication failed. Check:');
      console.error('      - Username in connection string');
      console.error('      - Password in connection string');
      console.error('      - User permissions in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('   🌐 Cluster not found. Check:');
      console.error('      - Cluster URL in connection string');
      console.error('      - Cluster is active in MongoDB Atlas');
    } else if (error.message.includes('timed out')) {
      console.error('   ⏱️ Connection timed out. Check:');
      console.error('      - IP whitelist in MongoDB Atlas');
      console.error('      - Network connectivity');
      console.error('      - Add 0.0.0.0/0 to MongoDB Atlas Network Access');
    } else if (error.message.includes('useNewUrlParser')) {
      console.error('   ⚠️ Remove useNewUrlParser and useUnifiedTopology options');
      console.error('      - These are deprecated in Mongoose 7+');
    }
    
    // Retry logic for production
    if (process.env.NODE_ENV === 'production' && retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts left)`);
      console.log(`⏱️ Waiting ${delay/1000} seconds before retry...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return await connectDB(retries - 1, delay);
    }
    
    // Don't exit process in production (Vercel)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    
    return false;
  }
};

export default connectDB;