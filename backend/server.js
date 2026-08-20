// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import orderRoutes from './routes/orderRoutes.js';


dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));

// app.use(cors());
app.use(express.json());

// Routes
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Vercel requires export of app
export default app;
