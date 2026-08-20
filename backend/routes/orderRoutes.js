// backend/routes/orderRoutes.js
import express from 'express';
import { 
  createOrder, 
  verifyPayment, 
  getOrderById,
  getAllOrders 
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/order/:orderId', getOrderById);
router.get('/orders', getAllOrders);

export default router;