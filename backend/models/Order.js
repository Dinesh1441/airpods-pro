// backend/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  productName: {
    type: String,
    default: 'Black T55+ Smartwatch'
  },
  customer: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  orderDetails: {
    quantity: { type: Number, required: true, default: 1 },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'ONLINE'], required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
  },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  orderId : { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order =mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;