// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB Connected Successfully');
//   } catch (error) {
//     console.error('MongoDB Connection Error:', error);
//     process.exit(1);
//   }
// };

// export default connectDB;

// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGODB_URI exists
    const mongoUri = process.env.MONGODB_URI;
    
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('📋 Available env vars:', Object.keys(process.env).join(', '));
      return;
    }

    // Log connection string (hide password)
    const sanitizedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
    console.log('📡 Connecting to MongoDB...');
    console.log('📋 Connection string:', sanitizedUri);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('bad auth')) {
      console.error('⚠️ Authentication failed. Please check:');
      console.error('   - Username in connection string');
      console.error('   - Password in connection string');
      console.error('   - User permissions in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('⚠️ Cluster not found. Please check:');
      console.error('   - Cluster URL in connection string');
      console.error('   - Cluster is active in MongoDB Atlas');
    } else if (error.message.includes('timed out')) {
      console.error('⚠️ Connection timed out. Please check:');
      console.error('   - Network access in MongoDB Atlas');
      console.error('   - Vercel can reach MongoDB Atlas');
    }
  }
};

export default connectDB;