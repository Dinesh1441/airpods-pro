// // backend/server.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import orderRoutes from './routes/orderRoutes.js';

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api', orderRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import connectDB, {getDBStatus} from './config/db.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();


app.get("/api/health", (req, res) => {
  const db = getDBStatus();

  res.status(db.connected ? 200 : 503).json({
    success: db.connected,
    message: db.message,
    database: {
      connected: db.connected,
      error: db.error,
    },
  });
});

// Connect to MongoDB
connectDB();

// CORS configuration for production
const allowedOrigins = [
  'https://airpods-pro-two.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', orderRoutes);

// Health check endpoint

app.get('/api/test-db', async (req, res) => {
  try {
    const status = mongoose.connection.readyState;
    const statusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
      99: 'Uninitialized'
    };
    
    let dbInfo = {};
    if (status === 1) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        dbInfo = {
          database: mongoose.connection.db.databaseName,
          collections: collections.map(c => c.name)
        };
      } catch (err) {
        dbInfo.error = err.message;
      }
    }
    
    res.json({
      success: true,
      mongodb: {
        status: statusMap[status] || 'Unknown',
        readyState: status,
        ...dbInfo
      },
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    // name: 'DS Global Store API',
    version: '1.0.0',
    status: 'Active',
    // endpoints: {
    //   health: '/api/health',
    //   createOrder: '/api/create-order [POST]',
    //   verifyPayment: '/api/verify-payment [POST]',
    //   getOrder: '/api/order/:orderId [GET]',
    //   getAllOrders: '/api/orders [GET]'
    // },
    // documentation: 'Contact admin for API documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export for Vercel
export default app;

